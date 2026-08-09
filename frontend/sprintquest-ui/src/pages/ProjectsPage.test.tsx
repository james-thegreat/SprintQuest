import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppSelectionStore } from '../stores/useAppSelectionStore';
import { ProjectsPage } from './ProjectsPage';

describe('ProjectsPage', () => {
  beforeEach(() => {
    useAppSelectionStore.setState({
      projects: [],
      selectedProjectId: null,
      sprints: [],
      selectedSprintId: null,
      isProjectsLoading: false,
      isSprintsLoading: false,
      projectsErrorMessage: null,
      sprintsErrorMessage: null,
    });
  });

  it('displays the available projects', () => {
    useAppSelectionStore.setState({
      projects: [
        {
          id: 'project-1',
          name: 'SprintQuest',
          description: 'Gamified project management',
          createdAt: '2026-08-09T00:00:00Z',
        },
        {
          id: 'project-2',
          name: 'Portfolio',
          description: null,
          createdAt: '2026-08-09T00:00:00Z',
        },
      ],
      selectedProjectId: 'project-1',
    });

    render(<ProjectsPage />);

    expect(
      screen.getByRole('heading', { name: 'Projects' }),
    ).toBeInTheDocument();

    expect(screen.getByText('SprintQuest')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();

    expect(
      screen.getByText('Gamified project management'),
    ).toBeInTheDocument();
  });

  it('selects a project and displays its sprints', () => {
    const selectProject = vi.fn().mockResolvedValue(true);

    useAppSelectionStore.setState({
      projects: [
        {
          id: 'project-1',
          name: 'SprintQuest',
          description: null,
          createdAt: '2026-08-09T00:00:00Z',
        },
        {
          id: 'project-2',
          name: 'Portfolio',
          description: null,
          createdAt: '2026-08-09T00:00:00Z',
        },
      ],
      selectedProjectId: 'project-1',
      sprints: [
        {
          id: 'sprint-1',
          projectId: 'project-1',
          name: 'Dashboard Integration',
          startDate: '2026-08-01T00:00:00Z',
          endDate: '2026-08-14T00:00:00Z',
          createdAt: '2026-08-01T00:00:00Z',
        },
      ],
      selectedSprintId: 'sprint-1',
      selectProject,
    });

    render(<ProjectsPage />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Select Portfolio' }),
    );

    expect(selectProject).toHaveBeenCalledWith('project-2');

    expect(
      screen.getByRole('heading', { name: 'Sprints' }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Dashboard Integration'),
    ).toBeInTheDocument();
  });
});