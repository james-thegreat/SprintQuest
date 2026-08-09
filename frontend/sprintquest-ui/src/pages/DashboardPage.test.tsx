import {
  fireEvent,
  render,
  screen,
  within,
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
import { useBoardStore } from '../stores/useBoardStore';
import { useGamificationStore } from '../stores/useGamificationStore';

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

    useBoardStore.setState({
        tasks: [],
        isLoading: false,
        isCreating: false,
        errorMessage: null,
        loadTasks: vi.fn().mockResolvedValue(undefined),
        });

        useGamificationStore.setState({
        summary: null,
        isLoading: false,
        errorMessage: null,
        loadSummary: vi.fn().mockResolvedValue(true),
        });
  });

  it('shows a loading state while application context is loading', () => {
    useAppSelectionStore.setState({
      isProjectsLoading: true,
    });

    useBoardStore.setState({
        tasks: [],
        isLoading: false,
        isCreating: false,
        errorMessage: null,
        loadTasks: vi.fn().mockResolvedValue(undefined),
    });

        useGamificationStore.setState({
        summary: null,
        isLoading: false,
        errorMessage: null,
        loadSummary: vi.fn().mockResolvedValue(true),
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

    it('shows the real Project count and selected Sprint summary', () => {
        useAppSelectionStore.setState({
            projects: [
            {
                id: 'project-1',
                name: 'SprintQuest',
                description: 'Gamified project management',
                createdAt: '2026-07-01T00:00:00Z',
            },
            {
                id: 'project-2',
                name: 'Portfolio',
                description: null,
                createdAt: '2026-07-15T00:00:00Z',
            },
            ],
            selectedProjectId: 'project-1',
            sprints: [
            {
                id: 'sprint-1',
                projectId: 'project-1',
                name: 'Dashboard Integration',
                startDate: '2026-08-01',
                endDate: '2026-08-14',
                createdAt: '2026-08-01T00:00:00Z',
            },
            ],
            selectedSprintId: 'sprint-1',
        });

        render(
            <MemoryRouter>
            <DashboardPage />
            </MemoryRouter>,
        );

        expect(
            screen.getByText('2', { selector: 'strong' }),
        ).toBeInTheDocument();

        expect(
            screen.getByText('Dashboard Integration', {
            selector: 'strong',
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByText('1 Aug 2026 – 14 Aug 2026'),
        ).toBeInTheDocument();
        });

    it('loads and shows sprint progress and gamification metrics', () => {
        const loadTasks = vi.fn().mockResolvedValue(undefined);
        const loadSummary = vi.fn().mockResolvedValue(true);

        useAppSelectionStore.setState({
            selectedProjectId: 'project-1',
            selectedSprintId: 'sprint-1',
        });

        useBoardStore.setState({
            tasks: [
            {
                id: 'task-1',
                sprintId: 'sprint-1',
                title: 'Build Dashboard cards',
                status: 4,
                priority: 2,
                storyPoints: 3,
                xpReward: 25,
            },
            {
                id: 'task-2',
                sprintId: 'sprint-1',
                title: 'Add Dashboard tests',
                status: 4,
                priority: 1,
                storyPoints: 2,
                xpReward: 20,
            },
            {
                id: 'task-3',
                sprintId: 'sprint-1',
                title: 'Polish responsive layout',
                status: 2,
                priority: 1,
                storyPoints: 3,
                xpReward: 30,
            },
            ],
            loadTasks,
        });

        useGamificationStore.setState({
            summary: {
            totalXp: 75,
            xpEventCount: 2,
            completedTaskCount: 2,
            unlockedAchievements: [
                {
                name: 'First Task Complete',
                description: 'Complete your first task.',
                badgeKey: 'first-task',
                },
                {
                name: 'Sprint Starter',
                description: 'Begin making sprint progress.',
                badgeKey: 'sprint-starter',
                },
            ],
            },
            loadSummary,
        });

        render(
            <MemoryRouter>
            <DashboardPage />
            </MemoryRouter>,
        );

        expect(loadTasks).toHaveBeenCalledOnce();
        expect(loadTasks).toHaveBeenCalledWith('sprint-1');
        expect(loadSummary).toHaveBeenCalledOnce();

        const completedCard = screen
            .getByText('Completed Tasks')
            .closest('article');

        const remainingCard = screen
            .getByText('Remaining Tasks')
            .closest('article');

        expect(completedCard).not.toBeNull();
        expect(remainingCard).not.toBeNull();

        expect(
            within(completedCard as HTMLElement).getByText('2', {
            selector: 'strong',
            }),
        ).toBeInTheDocument();

        expect(
            within(remainingCard as HTMLElement).getByText('1', {
            selector: 'strong',
            }),
        ).toBeInTheDocument();

        expect(screen.getByText('67%')).toBeInTheDocument();
        expect(screen.getByText('75 XP')).toBeInTheDocument();
        expect(screen.getByText('2 unlocked')).toBeInTheDocument();
        expect(screen.getByText('First Task Complete')).toBeInTheDocument();
        expect(screen.getByText('Sprint Starter')).toBeInTheDocument();
        });

});
