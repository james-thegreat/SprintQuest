export type TaskStatus = 0 | 1 | 2 | 3 | 4;

export type TaskPriority = 0 | 1 | 2 | 3;

export const taskPriorities: TaskPriority[] = [0, 1, 2, 3];

export type SprintTask = {
  id: string;
  sprintId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  xpReward: number;
  createdAt?: string;
  completedAt?: string | null;
};

export type CreateTaskRequest = {
  sprintId: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  storyPoints: number;
  xpReward: number;
};

export type UpdateTaskRequest = {
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  xpReward: number;
};

export const taskStatuses: TaskStatus[] = [0, 1, 2, 3, 4];

export const taskStatusLabels: Record<TaskStatus, string> = {
  0: 'Backlog',
  1: 'To Do',
  2: 'In Progress',
  3: 'Testing',
  4: 'Done',
};

export const taskPriorityLabels: Record<TaskPriority, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical',
};