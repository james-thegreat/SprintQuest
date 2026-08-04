import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getProjects } from '../../api/projectsApi';
import { getSprintsByProjectId } from '../../api/sprintsApi';
import { useAppSelectionStore } from '../../stores/useAppSelectionStore';
import type { Project } from '../../types/project';
import type { Sprint } from '../../types/sprint';
import { AppLayout } from './AppLayout';

vi.mock('../../api/projectsApi', () => ({
  getProjects: vi.fn(),
}));

vi.mock('../../api/sprintsApi', () => ({
  getSprintsByProjectId: vi.fn(),
}));

const project: Project = {
  id: 'project-1',
  name: 'SprintQuest',
  description: 'Gamified project planning.',
  createdAt: '2026-07-29T00:00:00Z',
};

const sprint: Sprint = {
  id: 'sprint-1',
  projectId: project.id,
  name: 'M13 App Selection Foundation',
  startDate: '2026-07-29T00:00:00Z',
  endDate: '2026-08-05T00:00:00Z',
  createdAt: '2026-07-29T00:00:00Z',
};

const secondProject: Project = {
  id: 'project-2',
  name: 'Portfolio Website',
  description: 'Personal development portfolio.',
  createdAt: '2026-07-29T00:00:00Z',
};

const secondSprint: Sprint = {
  id: 'sprint-2',
  projectId: secondProject.id,
  name: 'Portfolio Foundation',
  startDate: '2026-07-30T00:00:00Z',
  endDate: '2026-08-06T00:00:00Z',
  createdAt: '2026-07-29T00:00:00Z',
};

const alternateSprint: Sprint = {
  id: 'sprint-2',
  projectId: project.id,
  name: 'M14 Dashboard Integration',
  startDate: '2026-08-06T00:00:00Z',
  endDate: '2026-08-13T00:00:00Z',
  createdAt: '2026-07-29T01:00:00Z',
};

describe('AppLayout application context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

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

  it('initialises the shared application selection context', async () => {
    vi.mocked(getProjects).mockResolvedValue([project]);
    vi.mocked(getSprintsByProjectId).mockResolvedValue([
      sprint,
    ]);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<div>Dashboard content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        useAppSelectionStore.getState().hasInitialised,
      ).toBe(true);
    });

    expect(getProjects).toHaveBeenCalledTimes(1);
    expect(getSprintsByProjectId).toHaveBeenCalledWith(
      project.id,
    );
    expect(
      useAppSelectionStore.getState().selectedProjectId,
    ).toBe(project.id);
    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(sprint.id);
  });

  it('displays the selected project and sprint', async () => {
    vi.mocked(getProjects).mockResolvedValue([project]);

    vi.mocked(getSprintsByProjectId).mockResolvedValue([
      sprint,
    ]);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<div>Dashboard content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        useAppSelectionStore.getState().hasInitialised,
      ).toBe(true);
    });

    const projectSelector = screen.getByLabelText('Project');
    const sprintSelector = screen.getByLabelText('Sprint');

    expect(projectSelector).toHaveValue(project.id);
    expect(sprintSelector).toHaveValue(sprint.id);

    expect(
      screen.getByRole('option', {
        name: project.name,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('option', {
        name: sprint.name,
      }),
    ).toBeInTheDocument();
  });

  it('changes the selected project and loads its sprints', async () => {
    vi.mocked(getProjects).mockResolvedValue([
      project,
      secondProject,
    ]);

    vi.mocked(getSprintsByProjectId).mockImplementation(
      async (projectId) => {
        if (projectId === project.id) {
          return [sprint];
        }

        if (projectId === secondProject.id) {
          return [secondSprint];
        }

        return [];
      },
    );

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<div>Dashboard content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        useAppSelectionStore.getState().hasInitialised,
      ).toBe(true);
    });

    const projectSelector =
      screen.getByLabelText('Project');

    expect(projectSelector).toBeEnabled();

    fireEvent.change(projectSelector, {
      target: {
        value: secondProject.id,
      },
    });

    await waitFor(() => {
  expect(
    useAppSelectionStore.getState().selectedProjectId,
    ).toBe(secondProject.id);

    expect(
      getSprintsByProjectId,
    ).toHaveBeenLastCalledWith(secondProject.id);

    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(secondSprint.id);
  });

    expect(
      screen.getByLabelText('Sprint'),
    ).toHaveValue(secondSprint.id);
  });

  it('changes the selected sprint', async () => {
    vi.mocked(getProjects).mockResolvedValue([project]);

    vi.mocked(getSprintsByProjectId).mockResolvedValue([
      sprint,
      alternateSprint,
    ]);

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route
              index
              element={<div>Dashboard content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        useAppSelectionStore.getState().hasInitialised,
      ).toBe(true);
    });

    const sprintSelector =
      screen.getByLabelText('Sprint');

    expect(sprintSelector).toBeEnabled();

    fireEvent.change(sprintSelector, {
      target: {
        value: alternateSprint.id,
      },
    });

    expect(
      useAppSelectionStore.getState().selectedSprintId,
    ).toBe(alternateSprint.id);

    expect(sprintSelector).toHaveValue(
      alternateSprint.id,
    );

    expect(
      localStorage.getItem(
        'sprintquest.selectedSprintId',
      ),
    ).toBe(alternateSprint.id);
  });

});