import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAppSelectionStore } from '../stores/useAppSelectionStore';
import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
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

  it('shows a loading state while application context is loading', () => {
    useAppSelectionStore.setState({
      isProjectsLoading: true,
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('status', {
        name: /loading dashboard/i,
      }),
    ).toBeInTheDocument();
  });


  it('shows the Project loading error', () => {
    useAppSelectionStore.setState({
        projectsErrorMessage: 'Unable to load Projects.',
    });

    render(
        <MemoryRouter>
        <DashboardPage />
        </MemoryRouter>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
        'Unable to load Projects.',
    );
    });

    it('shows the Sprint loading error', () => {
        useAppSelectionStore.setState({
            sprintsErrorMessage: 'Unable to load Sprints.',
        });

        render(
            <MemoryRouter>
            <DashboardPage />
            </MemoryRouter>,
        );

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Unable to load Sprints.',
        );
        });

    it('retries loading Projects after a Project error', () => {
        const loadProjects = vi.fn().mockResolvedValue(true);

        useAppSelectionStore.setState({
            projectsErrorMessage: 'Unable to load Projects.',
            loadProjects,
        });

        render(
            <MemoryRouter>
            <DashboardPage />
            </MemoryRouter>,
        );

        fireEvent.click(
            screen.getByRole('button', {
            name: /retry projects/i,
            }),
        );

        expect(loadProjects).toHaveBeenCalledOnce();
        });

    it('retries loading Sprints for the selected Project', () => {
        const loadSprints = vi.fn().mockResolvedValue(true);

        useAppSelectionStore.setState({
            selectedProjectId: 'project-1',
            sprintsErrorMessage: 'Unable to load Sprints.',
            loadSprints,
        });

        render(
            <MemoryRouter>
            <DashboardPage />
            </MemoryRouter>,
        );

        fireEvent.click(
            screen.getByRole('button', {
            name: /retry sprints/i,
            }),
        );

        expect(loadSprints).toHaveBeenCalledOnce();
        expect(loadSprints).toHaveBeenCalledWith('project-1');
        });
});