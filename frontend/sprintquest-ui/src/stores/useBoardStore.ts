import { create } from 'zustand';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasksBySprintId,
  updateTask,
} from '../api/tasksApi';
import type {
  CreateTaskRequest,
  SprintTask,
  TaskStatus,
} from '../types/task';

type TaskStateUpdate =
  | SprintTask[]
  | ((currentTasks: SprintTask[]) => SprintTask[]);

let latestTasksRequestId = 0;

type BoardStore = {
  tasks: SprintTask[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage: string | null;

  loadTasks: (sprintId: string) => Promise<void>;
  createTask: (request: CreateTaskRequest) => Promise<boolean>;
  updateTaskStatus: (
      task: SprintTask,
      nextStatus: TaskStatus,
    ) => Promise<boolean>;
    deleteTask: (taskId: string) => Promise<boolean>;

    reconcileTask: (task: SprintTask) => void;
    removeTaskById: (taskId: string) => void;

    setTasks: (nextTasks: TaskStateUpdate) => void;
    setErrorMessage: (message: string | null) => void;
};

export const useBoardStore = create<BoardStore>((set, get) => ({
  tasks: [],
  isLoading: true,
  errorMessage: null,
  isCreating: false,

  loadTasks: async (sprintId) => {
    const requestId = ++latestTasksRequestId;

    set({
      isLoading: true,
      errorMessage: null,
    });

    try {
      const apiTasks = await getTasksBySprintId(
        sprintId,
      );

      if (requestId !== latestTasksRequestId) {
        return;
      }

      set({
        tasks: apiTasks,
        errorMessage: null,
      });
    } catch {
      if (requestId !== latestTasksRequestId) {
        return;
      }

      set({
        tasks: [],
        errorMessage:
          'Could not load tasks for the selected sprint. Please try again.',
      });
    } finally {
      if (requestId === latestTasksRequestId) {
        set({
          isLoading: false,
        });
      }
    }
  },


  createTask: async (request) => {
    set({
        isCreating: true,
        errorMessage: null,
    });

    try {
        const createdTask = await createTaskRequest(request);

        get().reconcileTask(createdTask);

        set({
        errorMessage: null,
        });

        return true;
    } catch {
        set({
        errorMessage: 'Could not create the task. Please try again.',
        });

        return false;
    } finally {
        set({
        isCreating: false,
        });
    }
  },




  updateTaskStatus: async (task, nextStatus) => {
    const previousTasks = get().tasks;

    const updatedTask: SprintTask = {
      ...task,
      status: nextStatus,
    };

    set((state) => ({
      tasks: state.tasks.map((currentTask) =>
        currentTask.id === task.id ? updatedTask : currentTask,
      ),
      errorMessage: null,
    }));

    try {
      const authoritativeTask = await updateTask(task.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        priority: updatedTask.priority,
        storyPoints: updatedTask.storyPoints,
        xpReward: updatedTask.xpReward,
        });

        get().reconcileTask(authoritativeTask);

        return true;
    } catch {
      set({
        tasks: previousTasks,
        errorMessage: 'Could not update the task status. Please try again.',
      });

      return false;
    }
  },


  deleteTask: async (taskId) => {
    const previousTasks = get().tasks;

    get().removeTaskById(taskId);

    set({
        errorMessage: null,
    });

    try {
        await deleteTaskRequest(taskId);
        return true;
    } catch {
        set({
        tasks: previousTasks,
        errorMessage: 'Could not delete the task. Please try again.',
        });

        return false;
    }
  },

  reconcileTask: (incomingTask) =>
  set((state) => {
    const taskExists = state.tasks.some(
      (task) => task.id === incomingTask.id,
    );

    return {
      tasks: taskExists
        ? state.tasks.map((task) =>
            task.id === incomingTask.id ? incomingTask : task,
          )
        : [incomingTask, ...state.tasks],
    };
  }),

  removeTaskById: (taskId) =>
  set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),

  setTasks: (nextTasks) =>
    set((state) => ({
      tasks:
        typeof nextTasks === 'function'
          ? nextTasks(state.tasks)
          : nextTasks,
    })),

  setErrorMessage: (message) => {
    set({
      errorMessage: message,
    });
  },
}));