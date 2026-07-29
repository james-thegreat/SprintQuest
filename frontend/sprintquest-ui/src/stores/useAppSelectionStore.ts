import { create } from 'zustand';
import { getProjects } from '../api/projectsApi';
import { getSprintsByProjectId } from '../api/sprintsApi';
import type { Project } from '../types/project';
import type { Sprint } from '../types/sprint';

const PROJECT_STORAGE_KEY =
  'sprintquest.selectedProjectId';

const SPRINT_STORAGE_KEY =
  'sprintquest.selectedSprintId';

let latestSprintsRequestId = 0;

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
  loadSprints: (projectId: string) => Promise<boolean>;
  selectProject: (projectId: string) => boolean;
  selectSprint: (sprintId: string) => boolean;
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
        const storedProjectId = localStorage.getItem(
        PROJECT_STORAGE_KEY,
        );

        const validPreviousProjectId = projects.some(
        (project) => project.id === previousProjectId,
        )
        ? previousProjectId
        : null;

        const validStoredProjectId = projects.some(
        (project) => project.id === storedProjectId,
        )
        ? storedProjectId
        : null;

        const selectedProjectId =
        validPreviousProjectId ??
        validStoredProjectId ??
        projects[0]?.id ??
        null;

        const projectChanged =
          selectedProjectId !== previousProjectId;

        if (selectedProjectId) {
            localStorage.setItem(
                PROJECT_STORAGE_KEY,
                selectedProjectId,
            );
        } else {
            localStorage.removeItem(PROJECT_STORAGE_KEY);
            localStorage.removeItem(SPRINT_STORAGE_KEY);
        }

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

    loadSprints: async (projectId) => {
        const requestId = ++latestSprintsRequestId;

        set({
            isSprintsLoading: true,
            sprintsErrorMessage: null,
        });

        try {
            const sprints = await getSprintsByProjectId(projectId);

            const requestIsStale =
            requestId !== latestSprintsRequestId ||
            get().selectedProjectId !== projectId;

            if (requestIsStale) {
            return false;
            }

            const previousSprintId = get().selectedSprintId;
            const storedSprintId = localStorage.getItem(
            SPRINT_STORAGE_KEY,
            );

            const validPreviousSprintId = sprints.some(
            (sprint) => sprint.id === previousSprintId,
            )
            ? previousSprintId
            : null;

            const validStoredSprintId = sprints.some(
            (sprint) => sprint.id === storedSprintId,
            )
            ? storedSprintId
            : null;

            const selectedSprintId =
            validPreviousSprintId ??
            validStoredSprintId ??
            sprints[0]?.id ??
            null;

            if (selectedSprintId) {
            localStorage.setItem(
                SPRINT_STORAGE_KEY,
                selectedSprintId,
            );
            } else {
            localStorage.removeItem(SPRINT_STORAGE_KEY);
            }

            set({
            sprints,
            selectedSprintId,
            sprintsErrorMessage: null,
            });

            return true;
        } catch {
            const requestIsStale =
            requestId !== latestSprintsRequestId ||
            get().selectedProjectId !== projectId;

            if (requestIsStale) {
            return false;
            }

            set({
            sprints: [],
            selectedSprintId: null,
            sprintsErrorMessage:
                'Could not load sprints. Please try again.',
            });

            return false;
        } finally {
            if (requestId === latestSprintsRequestId) {
            set({
                isSprintsLoading: false,
            });
            }
        }
        },
    selectProject: (projectId) => {
        const projectExists = get().projects.some(
            (project) => project.id === projectId,
        );

        if (!projectExists) {
            return false;
        }

        latestSprintsRequestId += 1;

        localStorage.setItem(PROJECT_STORAGE_KEY, projectId);
        localStorage.removeItem(SPRINT_STORAGE_KEY);

        set({
            selectedProjectId: projectId,
            sprints: [],
            selectedSprintId: null,
            isSprintsLoading: false,
            sprintsErrorMessage: null,
        });

        return true;
    },

    selectSprint: (sprintId) => {
        const sprintExists = get().sprints.some(
            (sprint) => sprint.id === sprintId,
        );

        if (!sprintExists) {
            return false;
        }

        localStorage.setItem(SPRINT_STORAGE_KEY, sprintId);

        set({
            selectedSprintId: sprintId,
        });

        return true;
    },
  }));
