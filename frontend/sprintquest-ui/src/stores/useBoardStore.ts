import { create } from 'zustand';
import { getTasks } from '../api/tasksApi';
import type { SprintTask } from '../types/task';

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
  errorMessage: string | null;
  loadTasks: () => Promise<void>;
  setTasks: (nextTasks: TaskStateUpdate) => void;
  setErrorMessage: (message: string | null) => void;
};

export const useBoardStore = create<BoardStore>((set) => ({
  tasks: sampleTasks,
  isLoading: true,
  errorMessage: null,

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