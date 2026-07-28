export type ChecklistItem = {
  id: string;
  taskItemId: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
};

export type CreateChecklistItemRequest = {
  taskItemId: string;
  title: string;
};

export type UpdateChecklistItemRequest = {
  title: string;
  isCompleted: boolean;
};
