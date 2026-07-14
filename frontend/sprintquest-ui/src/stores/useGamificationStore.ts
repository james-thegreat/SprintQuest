import { create } from 'zustand';
import { getGamificationSummary } from '../api/gamificationApi';
import type { GamificationSummary } from '../types/gamification';

type GamificationStore = {
  summary: GamificationSummary | null;
  isLoading: boolean;
  errorMessage: string | null;
  loadSummary: () => Promise<boolean>;
};

export const useGamificationStore = create<GamificationStore>((set) => ({
  summary: null,
  isLoading: true,
  errorMessage: null,

  loadSummary: async () => {
    set({
      isLoading: true,
      errorMessage: null,
    });

    try {
      const summary = await getGamificationSummary();

      set({
        summary,
        errorMessage: null,
      });

      return true;
    } catch {
      set({
        errorMessage:
          'Could not load the gamification summary. Please try again.',
      });

      return false;
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));