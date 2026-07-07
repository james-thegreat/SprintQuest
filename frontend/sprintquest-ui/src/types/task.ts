export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Testing' | 'Done';

export type TaskPriority = 'Low' | 'Medium' | 'High';

export type SprintTask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  storyPoints: number;
  xpReward: number;
};

export const taskStatuses: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'Testing', 'Done'];