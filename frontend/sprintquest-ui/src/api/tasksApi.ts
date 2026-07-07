import { apiDelete, apiGet, apiPost, apiPut } from './apiClient';
import type { CreateTaskRequest, SprintTask, UpdateTaskRequest } from '../types/task';

const TASK_ITEMS_PATH = '/api/TaskItems';

export function getTasks() {
  return apiGet<SprintTask[]>(TASK_ITEMS_PATH);
}

export function getTasksBySprintId(sprintId: string) {
  return apiGet<SprintTask[]>(`${TASK_ITEMS_PATH}/sprint/${sprintId}`);
}

export function createTask(request: CreateTaskRequest) {
  return apiPost<SprintTask, CreateTaskRequest>(TASK_ITEMS_PATH, request);
}

export function updateTask(taskId: string, request: UpdateTaskRequest) {
  return apiPut<UpdateTaskRequest>(`${TASK_ITEMS_PATH}/${taskId}`, request);
}

export function deleteTask(taskId: string) {
  return apiDelete(`${TASK_ITEMS_PATH}/${taskId}`);
}