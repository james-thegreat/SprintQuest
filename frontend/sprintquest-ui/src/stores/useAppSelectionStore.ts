import { create } from 'zustand';
import { getProjects } from '../api/projectsApi';
import type { Project } from '../types/project';
import type { Sprint } from '../types/sprint';

type AppSelectionStore = {
  projects: Project[];
  selectedProjectId: string | null;

  sprints: Sprint[];
  selectedSprintId: string | null;

  isProjectsLoading: boolean;
  isSprintsLoading: boolean;

  projectsErrorMessage: string | null;
  sprintsErrorMessage: string | null;

  hasInitialised: boolean;

  loadProjects: () => Promise<boolean>;
};

export const useAppSelectionStore =
  create<AppSelectionStore>((set, get) => ({
    projects: [],
    selectedProjectId: null,

    sprints: [],
    selectedSprintId: null,

    isProjectsLoading: false,
    isSprintsLoading: false,

    projectsErrorMessage: null,
    sprintsErrorMessage: null,

    hasInitialised: false,

    loadProjects: async () => {
      set({
        isProjectsLoading: true,
        projectsErrorMessage: null,
      });

      try {
        const projects = await getProjects();
        const previousProjectId = get().selectedProjectId;

        const selectedProjectId =
          projects.some(
            (project) => project.id === previousProjectId,
          )
            ? previousProjectId
            : projects[0]?.id ?? null;

        const projectChanged =
          selectedProjectId !== previousProjectId;

        set({
          projects,
          selectedProjectId,
          projectsErrorMessage: null,
          ...(projectChanged || selectedProjectId === null
            ? {
                sprints: [],
                selectedSprintId: null,
              }
            : {}),
        });

        return true;
      } catch {
        set({
          projects: [],
          selectedProjectId: null,
          sprints: [],
          selectedSprintId: null,
          projectsErrorMessage:
            'Could not load projects. Please try again.',
        });

        return false;
      } finally {
        set({
          isProjectsLoading: false,
        });
      }
    },
  }));
