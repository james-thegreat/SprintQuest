import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getProjects } from '../api/projectsApi';
import type { Project } from '../types/project';
import { useAppSelectionStore } from './useAppSelectionStore';

vi.mock('../api/projectsApi', () => ({
  getProjects: vi.fn(),
}));

const firstProject: Project = {
  id: 'project-1',
  name: 'SprintQuest',
  description: 'Gamified project planning.',
  createdAt: '2026-07-29T00:00:00Z',
};

const secondProject: Project = {
  id: 'project-2',
  name: 'Portfolio',
  description: null,
  createdAt: '2026-07-29T01:00:00Z',
};

describe('useAppSelectionStore project loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAppSelectionStore.setState({
      projects: [],
      selectedProjectId: null,
      sprints: [],
      selectedSprintId: null,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
      hasInitialised: false,
    });
  });

  it('loads projects and selects the first project when none is selected', async () => {
    vi.mocked(getProjects).mockResolvedValue([
      firstProject,
      secondProject,
    ]);

    const result = await useAppSelectionStore
      .getState()
      .loadProjects();

    expect(result).toBe(true);
    expect(useAppSelectionStore.getState().projects).toEqual([
      firstProject,
      secondProject,
    ]);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(firstProject.id);
    expect(
      useAppSelectionStore.getState().projectsErrorMessage,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isProjectsLoading,
    ).toBe(false);
  });

  it('represents an empty project response without inventing a selection', async () => {
    vi.mocked(getProjects).mockResolvedValue([]);

    const result = await useAppSelectionStore
      .getState()
      .loadProjects();

    expect(result).toBe(true);
    expect(useAppSelectionStore.getState().projects).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isProjectsLoading,
    ).toBe(false);
  });

  it('clears application context and reports a project API failure', async () => {
    useAppSelectionStore.setState({
      projects: [firstProject],
      selectedProjectId: firstProject.id,
      sprints: [
        {
          id: 'sprint-1',
          projectId: firstProject.id,
          name: 'M13',
          startDate: '2026-07-29T00:00:00Z',
          endDate: '2026-08-05T00:00:00Z',
          createdAt: '2026-07-29T00:00:00Z',
        },
      ],
      selectedSprintId: 'sprint-1',
    });

    vi.mocked(getProjects).mockRejectedValue(
      new Error('Project request failed'),
    );

    const result = await useAppSelectionStore
      .getState()
      .loadProjects();

    expect(result).toBe(false);
    expect(useAppSelectionStore.getState().projects).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBeNull();
    expect(useAppSelectionStore.getState().sprints).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().projectsErrorMessage,
    ).toBe('Could not load projects. Please try again.');
    expect(
      useAppSelectionStore.getState().isProjectsLoading,
    ).toBe(false);
  });

  it('keeps the current project when it still exists', async () => {
    useAppSelectionStore.setState({
        selectedProjectId: secondProject.id,
    });

    vi.mocked(getProjects).mockResolvedValue([
        firstProject,
        secondProject,
    ]);

    const result = await useAppSelectionStore
        .getState()
        .loadProjects();

    expect(result).toBe(true);
    expect(
        useAppSelectionStore.getState().selectedProjectId,
    ).toBe(secondProject.id);
    });


    it('falls back to the first project when the current selection is invalid', async () => {
        useAppSelectionStore.setState({
            selectedProjectId: 'missing-project',
        });

        vi.mocked(getProjects).mockResolvedValue([
            firstProject,
            secondProject,
        ]);

        const result = await useAppSelectionStore
            .getState()
            .loadProjects();

        expect(result).toBe(true);
        expect(
            useAppSelectionStore.getState().selectedProjectId,
        ).toBe(firstProject.id);
        });
});
