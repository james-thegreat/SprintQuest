import { create } from 'zustand';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask,
} from '../api/tasksApi';
import type {
  CreateTaskRequest,
  SprintTask,
  TaskStatus,
} from '../types/task';

const sampleTasks: SprintTask[] = [
  {
    id: '1',
    sprintId: '1',
    title: 'Design sprint board layout',
    description: 'Create the first responsive board view for SprintQuest.',
    status: 4,
    priority: 2,
    storyPoints: 3,
    xpReward: 50,
  },
  {
    id: '2',
    sprintId: '2',
    title: 'Connect board to task API',
    description: 'Load task cards from the backend instead of sample data.',
    status: 2,
    priority: 2,
    storyPoints: 5,
    xpReward: 80,
  },
  {
    id: '3',
    sprintId: '3',
    title: 'Add task create form',
    description: 'Allow users to create a task from the board page.',
    status: 1,
    priority: 1,
    storyPoints: 3,
    xpReward: 40,
  },
  {
    id: '4',
    sprintId: '4',
    title: 'Review checklist progress UI',
    description: 'Show checklist progress on each task card.',
    status: 0,
    priority: 0,
    storyPoints: 2,
    xpReward: 25,
  },
];

type TaskStateUpdate =
  | SprintTask[]
  | ((currentTasks: SprintTask[]) => SprintTask[]);

type BoardStore = {
  tasks: SprintTask[];
  isLoading: boolean;
  isCreating: boolean;
  errorMessage: string | null;

  loadTasks: () => Promise<void>;
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
  tasks: sampleTasks,
  isLoading: true,
  errorMessage: null,
  isCreating: false,

  loadTasks: async () => {
    set({
      isLoading: true,
      errorMessage: null,
    });

    try {
      const apiTasks = await getTasks();

      set({
        tasks: apiTasks,
        errorMessage: null,
      });
    } catch {
      set({
        tasks: sampleTasks,
        errorMessage:
          'Could not load tasks from the API. Showing sample board data for now.',
      });
    } finally {
      set({
        isLoading: false,
      });
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