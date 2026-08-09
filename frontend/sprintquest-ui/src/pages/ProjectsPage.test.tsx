import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
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
});