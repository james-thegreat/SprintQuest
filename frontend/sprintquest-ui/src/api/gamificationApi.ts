import { apiGet } from './apiClient';
import type { GamificationSummary } from '../types/gamification';

const GAMIFICATION_PATH = '/api/Gamification';

export function getGamificationSummary() {
  return apiGet<GamificationSummary>(`${GAMIFICATION_PATH}/summary`);
}