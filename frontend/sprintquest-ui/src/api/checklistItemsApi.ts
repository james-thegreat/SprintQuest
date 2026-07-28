import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from './apiClient';
import type {
  ChecklistItem,
  CreateChecklistItemRequest,
  UpdateChecklistItemRequest,
} from '../types/checklist';

const CHECKLIST_ITEMS_PATH = '/api/ChecklistItems';

export function getChecklistItemsByTaskId(taskItemId: string) {
  return apiGet<ChecklistItem[]>(
    `${CHECKLIST_ITEMS_PATH}/task/${taskItemId}`,
  );
}

export function getChecklistItemById(checklistItemId: string) {
  return apiGet<ChecklistItem>(
    `${CHECKLIST_ITEMS_PATH}/${checklistItemId}`,
  );
}

export function createChecklistItem(
  request: CreateChecklistItemRequest,
) {
  return apiPost<ChecklistItem, CreateChecklistItemRequest>(
    CHECKLIST_ITEMS_PATH,
    request,
  );
}

export function updateChecklistItem(
  checklistItemId: string,
  request: UpdateChecklistItemRequest,
) {
  return apiPut<void, UpdateChecklistItemRequest>(
    `${CHECKLIST_ITEMS_PATH}/${checklistItemId}`,
    request,
  );
}

export function deleteChecklistItem(checklistItemId: string) {
  return apiDelete(
    `${CHECKLIST_ITEMS_PATH}/${checklistItemId}`,
  );
}
