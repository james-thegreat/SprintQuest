import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getProjects } from '../api/projectsApi';
import type { Project } from '../types/project';
import { useAppSelectionStore } from './useAppSelectionStore';
import { getSprintsByProjectId } from '../api/sprintsApi';
import type { Sprint } from '../types/sprint';


vi.mock('../api/projectsApi', () => ({
  getProjects: vi.fn(),
}));

vi.mock('../api/sprintsApi', () => ({
  getSprintsByProjectId: vi.fn(),
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

const firstSprint: Sprint = {
  id: 'sprint-1',
  projectId: firstProject.id,
  name: 'M13 App Selection Foundation',
  startDate: '2026-07-29T00:00:00Z',
  endDate: '2026-08-05T00:00:00Z',
  createdAt: '2026-07-29T00:00:00Z',
};

const secondSprint: Sprint = {
  id: 'sprint-2',
  projectId: firstProject.id,
  name: 'M14 Dashboard Integration',
  startDate: '2026-08-06T00:00:00Z',
  endDate: '2026-08-13T00:00:00Z',
  createdAt: '2026-07-29T01:00:00Z',
};

const otherProjectSprint: Sprint = {
  id: 'sprint-3',
  projectId: secondProject.id,
  name: 'Portfolio Sprint',
  startDate: '2026-08-01T00:00:00Z',
  endDate: '2026-08-08T00:00:00Z',
  createdAt: '2026-07-29T02:00:00Z',
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

describe('useAppSelectionStore sprint loading', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAppSelectionStore.setState({
      projects: [firstProject],
      selectedProjectId: firstProject.id,
      sprints: [],
      selectedSprintId: null,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
      hasInitialised: false,
    });
  });

  it('loads project sprints and selects the first sprint', async () => {
    vi.mocked(getSprintsByProjectId).mockResolvedValue([
      firstSprint,
      secondSprint,
    ]);

    const result = await useAppSelectionStore
      .getState()
      .loadSprints(firstProject.id);

    expect(result).toBe(true);
    expect(getSprintsByProjectId).toHaveBeenCalledWith(
      firstProject.id,
    );
    expect(useAppSelectionStore.getState().sprints).toEqual([
      firstSprint,
      secondSprint,
    ]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(firstSprint.id);
    expect(
      useAppSelectionStore.getState().sprintsErrorMessage,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isSprintsLoading,
    ).toBe(false);
  });

  it('represents a project with no sprints', async () => {
    vi.mocked(getSprintsByProjectId).mockResolvedValue([]);

    const result = await useAppSelectionStore
      .getState()
      .loadSprints(firstProject.id);

    expect(result).toBe(true);
    expect(useAppSelectionStore.getState().sprints).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isSprintsLoading,
    ).toBe(false);
  });



  it('clears sprint state and reports a sprint API failure', async () => {
        useAppSelectionStore.setState({
        sprints: [firstSprint],
        selectedSprintId: firstSprint.id,
        });

        vi.mocked(getSprintsByProjectId).mockRejectedValue(
        new Error('Sprint request failed'),
        );

        const result = await useAppSelectionStore
        .getState()
        .loadSprints(firstProject.id);

        expect(result).toBe(false);
        expect(useAppSelectionStore.getState().sprints).toEqual([]);
        expect(
        useAppSelectionStore.getState().selectedSprintId,
        ).toBeNull();
        expect(
        useAppSelectionStore.getState().sprintsErrorMessage,
        ).toBe('Could not load sprints. Please try again.');
        expect(
        useAppSelectionStore.getState().isSprintsLoading,
        ).toBe(false);
    });

    it('keeps the current sprint when it still belongs to the project', async () => {
        useAppSelectionStore.setState({
            selectedSprintId: secondSprint.id,
        });

        vi.mocked(getSprintsByProjectId).mockResolvedValue([
            firstSprint,
            secondSprint,
        ]);

        const result = await useAppSelectionStore
            .getState()
            .loadSprints(firstProject.id);

        expect(result).toBe(true);
        expect(
            useAppSelectionStore.getState().selectedSprintId,
        ).toBe(secondSprint.id);
    });

    it('falls back to the first sprint when the current selection is invalid', async () => {
        useAppSelectionStore.setState({
            selectedSprintId: 'missing-sprint',
        });

        vi.mocked(getSprintsByProjectId).mockResolvedValue([
            firstSprint,
            secondSprint,
        ]);

        const result = await useAppSelectionStore
            .getState()
            .loadSprints(firstProject.id);

        expect(result).toBe(true);
        expect(
            useAppSelectionStore.getState().selectedSprintId,
        ).toBe(firstSprint.id);
    });

    it('ignores a stale sprint response after the selected project changes', async () => {
        let resolveRequest!: (sprints: Sprint[]) => void;

        const pendingRequest = new Promise<Sprint[]>((resolve) => {
            resolveRequest = resolve;
        });

        vi.mocked(getSprintsByProjectId).mockReturnValue(
            pendingRequest,
        );

        const requestPromise = useAppSelectionStore
            .getState()
            .loadSprints(firstProject.id);

        useAppSelectionStore.setState({
            selectedProjectId: secondProject.id,
            sprints: [otherProjectSprint],
            selectedSprintId: otherProjectSprint.id,
        });

        resolveRequest([firstSprint, secondSprint]);

        await requestPromise;

        expect(useAppSelectionStore.getState().sprints).toEqual([
            otherProjectSprint,
        ]);
        expect(
            useAppSelectionStore.getState().selectedSprintId,
        ).toBe(otherProjectSprint.id);
    });

});

describe('useAppSelectionStore project selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAppSelectionStore.setState({
      projects: [firstProject, secondProject],
      selectedProjectId: firstProject.id,
      sprints: [firstSprint, secondSprint],
      selectedSprintId: firstSprint.id,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
      hasInitialised: false,
    });
  });

  it('selects a valid project and clears the previous sprint context', () => {
    const result = useAppSelectionStore
      .getState()
      .selectProject(secondProject.id);

    expect(result).toBe(true);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(secondProject.id);
    expect(useAppSelectionStore.getState().sprints).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().sprintsErrorMessage,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isSprintsLoading,
    ).toBe(false);
  });

  it('rejects a project that is not in the loaded project list', () => {
    const result = useAppSelectionStore
      .getState()
      .selectProject('missing-project');

    expect(result).toBe(false);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(firstProject.id);
    expect(useAppSelectionStore.getState().sprints).toEqual([
      firstSprint,
      secondSprint,
    ]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(firstSprint.id);
  });

  it('invalidates an in-flight sprint request when selecting another project', async () => {
    let resolveRequest!: (sprints: Sprint[]) => void;

    const pendingRequest = new Promise<Sprint[]>((resolve) => {
      resolveRequest = resolve;
    });

    vi.mocked(getSprintsByProjectId).mockReturnValue(
      pendingRequest,
    );

    const requestPromise = useAppSelectionStore
      .getState()
      .loadSprints(firstProject.id);

    expect(
      useAppSelectionStore.getState().isSprintsLoading,
    ).toBe(true);

    const selectionResult = useAppSelectionStore
      .getState()
      .selectProject(secondProject.id);

    expect(selectionResult).toBe(true);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(secondProject.id);
    expect(useAppSelectionStore.getState().sprints).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
    expect(
      useAppSelectionStore.getState().isSprintsLoading,
    ).toBe(false);

    resolveRequest([firstSprint, secondSprint]);

    const requestResult = await requestPromise;

    expect(requestResult).toBe(false);
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(secondProject.id);
    expect(useAppSelectionStore.getState().sprints).toEqual([]);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBeNull();
  });
});

describe('useAppSelectionStore sprint selection', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAppSelectionStore.setState({
      projects: [firstProject],
      selectedProjectId: firstProject.id,
      sprints: [firstSprint, secondSprint],
      selectedSprintId: firstSprint.id,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
      hasInitialised: false,
    });
  });

  it('selects a valid sprint from the loaded sprint list', () => {
    const result = useAppSelectionStore
      .getState()
      .selectSprint(secondSprint.id);

    expect(result).toBe(true);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(secondSprint.id);
  });

  it('rejects a sprint that is not in the loaded sprint list', () => {
    const result = useAppSelectionStore
      .getState()
      .selectSprint('missing-sprint');

    expect(result).toBe(false);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(firstSprint.id);
  });


});
