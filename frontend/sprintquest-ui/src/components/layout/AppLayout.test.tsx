import { render, waitFor } from '@testing-library/react';
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
});