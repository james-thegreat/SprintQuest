import { apiGet } from './apiClient';
import type { Sprint } from '../types/sprint';

const SPRINTS_PATH = '/api/Sprints';

export function getSprintsByProjectId(projectId: string) {
  return apiGet<Sprint[]>(`${SPRINTS_PATH}/project/${projectId}`);
}
