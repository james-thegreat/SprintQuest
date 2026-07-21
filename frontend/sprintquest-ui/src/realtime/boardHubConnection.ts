import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from '@microsoft/signalr';
import { API_BASE_URL } from '../api/apiClient';
import { useBoardStore } from '../stores/useBoardStore';
import { useGamificationStore } from '../stores/useGamificationStore';
import type { SprintTask } from '../types/task';

type TaskDeletedPayload = {
  taskId: string;
};

const boardEvents = {
  taskCreated: 'TaskCreated',
  taskUpdated: 'TaskUpdated',
  taskDeleted: 'TaskDeleted',
} as const;

const boardHubUrl = `${API_BASE_URL}/hubs/board`;

let connection: HubConnection | null = null;
let startPromise: Promise<void> | null = null;
let activeSubscribers = 0;
let stopTimer: number | null = null;

function createBoardHubConnection(): HubConnection {
  const boardConnection = new HubConnectionBuilder()
    .withUrl(boardHubUrl)
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  boardConnection.on(
    boardEvents.taskCreated,
    (task: SprintTask) => {
      useBoardStore.getState().reconcileTask(task);
    },
  );

  boardConnection.on(
    boardEvents.taskUpdated,
    (task: SprintTask) => {
      const boardStore = useBoardStore.getState();

      const previousTask = boardStore.tasks.find(
        (currentTask) => currentTask.id === task.id,
      );

      boardStore.reconcileTask(task);

      if (previousTask?.status !== task.status) {
        void useGamificationStore.getState().loadSummary();
      }
    },
  );

  boardConnection.on(
    boardEvents.taskDeleted,
    (payload: TaskDeletedPayload) => {
      useBoardStore.getState().removeTaskById(payload.taskId);
    },
  );

  boardConnection.onreconnecting((error) => {
    console.warn(
      'SprintQuest live-board connection was interrupted.',
      error,
    );
  });

  boardConnection.onreconnected(() => {
    console.info('SprintQuest live-board connection restored.');
  });

  boardConnection.onclose((error) => {
    if (error) {
      console.error(
        'SprintQuest live-board connection closed unexpectedly.',
        error,
      );
    }
  });

  return boardConnection;
}

async function startConnection(): Promise<void> {
  connection ??= createBoardHubConnection();

  if (connection.state !== HubConnectionState.Disconnected) {
    return;
  }

  if (startPromise) {
    await startPromise;
    return;
  }

  startPromise = connection
    .start()
    .then(() => {
      console.info('SprintQuest live-board connection started.');
    })
    .catch((error: unknown) => {
      console.error(
        'SprintQuest could not start the live-board connection.',
        error,
      );
    })
    .finally(() => {
      startPromise = null;
    });

  await startPromise;
}

async function stopConnection(): Promise<void> {
  if (!connection) {
    return;
  }

  if (startPromise) {
    await startPromise;
  }

  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop();
  }

  connection = null;
}

export function subscribeToBoardHub(): () => void {
  activeSubscribers += 1;

  if (stopTimer !== null) {
    window.clearTimeout(stopTimer);
    stopTimer = null;
  }

  void startConnection();

  return () => {
    activeSubscribers = Math.max(0, activeSubscribers - 1);

    if (activeSubscribers > 0) {
      return;
    }

    stopTimer = window.setTimeout(() => {
      stopTimer = null;

      if (activeSubscribers === 0) {
        void stopConnection();
      }
    }, 0);
  };
}