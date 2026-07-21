import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { subscribeToBoardHub } from '../realtime/boardHubConnection'
import { useBoardStore } from '../stores/useBoardStore'
import { useGamificationStore } from '../stores/useGamificationStore'
import type { SprintTask } from '../types/task'
import { BoardPage } from './BoardPage'

vi.mock('../realtime/boardHubConnection', () => ({
  subscribeToBoardHub: vi.fn(() => vi.fn()),
}))

const tasks: SprintTask[] = [
  {
    id: 'task-backlog',
    sprintId: 'sprint-1',
    title: 'Plan testing approach',
    description: 'Review current coverage',
    status: 0,
    priority: 1,
    storyPoints: 2,
    xpReward: 20,
  },
  {
    id: 'task-progress',
    sprintId: 'sprint-1',
    title: 'Write component tests',
    description: 'Test the board UI',
    status: 2,
    priority: 2,
    storyPoints: 5,
    xpReward: 50,
  },
  {
    id: 'task-done',
    sprintId: 'sprint-1',
    title: 'Configure Vitest',
    description: 'Frontend testing is ready',
    status: 4,
    priority: 2,
    storyPoints: 3,
    xpReward: 30,
  },
]

describe('BoardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useBoardStore.setState({
      tasks,
      isLoading: false,
      isCreating: false,
      errorMessage: null,
      loadTasks: vi.fn().mockResolvedValue(undefined),
      createTask: vi.fn().mockResolvedValue(true),
      updateTaskStatus: vi.fn().mockResolvedValue(true),
      deleteTask: vi.fn().mockResolvedValue(true),
      setErrorMessage: vi.fn(),
    })

    useGamificationStore.setState({
      summary: {
        totalXp: 90,
        xpEventCount: 2,
        completedTaskCount: 1,
        unlockedAchievements: [
          {
            name: 'First Task Complete',
            description: 'Complete your first task.',
            badgeKey: 'first-task-complete',
          },
        ],
      },
      isLoading: false,
      errorMessage: null,
      loadSummary: vi.fn().mockResolvedValue(true),
    })
  })

  it('renders all five board columns with their task counts', () => {
    // Act
    render(<BoardPage />)

    // Assert
    const backlogColumn = screen.getByRole('region', {
      name: 'Backlog column',
    })
    const toDoColumn = screen.getByRole('region', {
      name: 'To Do column',
    })
    const inProgressColumn = screen.getByRole('region', {
      name: 'In Progress column',
    })
    const testingColumn = screen.getByRole('region', {
      name: 'Testing column',
    })
    const doneColumn = screen.getByRole('region', {
      name: 'Done column',
    })

    expect(within(backlogColumn).getByText('1')).toBeInTheDocument()
    expect(within(toDoColumn).getByText('0')).toBeInTheDocument()
    expect(within(inProgressColumn).getByText('1')).toBeInTheDocument()
    expect(within(testingColumn).getByText('0')).toBeInTheDocument()
    expect(within(doneColumn).getByText('1')).toBeInTheDocument()

    expect(subscribeToBoardHub).toHaveBeenCalledOnce()
  })

  it('places tasks in matching columns and displays sprint progress', () => {
    // Act
    render(<BoardPage />)

    // Assert
    const backlogColumn = screen.getByRole('region', {
      name: 'Backlog column',
    })
    const inProgressColumn = screen.getByRole('region', {
      name: 'In Progress column',
    })
    const doneColumn = screen.getByRole('region', {
      name: 'Done column',
    })

    expect(
      within(backlogColumn).getByText('Plan testing approach'),
    ).toBeInTheDocument()

    expect(
      within(inProgressColumn).getByText('Write component tests'),
    ).toBeInTheDocument()

    expect(
      within(doneColumn).getByText('Configure Vitest'),
    ).toBeInTheDocument()

    const progressBar = screen.getByRole('progressbar', {
      name: 'Sprint progress',
    })

    expect(progressBar).toHaveAttribute('value', '33')
    expect(
      screen.getByText('1 of 3 tasks complete.'),
    ).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('shows loading and error feedback from both stores', () => {
    // Arrange
    useBoardStore.setState({
      isLoading: true,
      errorMessage: 'Board tasks could not be loaded.',
    })

    useGamificationStore.setState({
      isLoading: true,
      errorMessage: 'Gamification summary could not be loaded.',
    })

    // Act
    render(<BoardPage />)

    // Assert
    expect(
      screen.getByText('Loading board tasks...'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Board tasks could not be loaded.'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Loading gamification summary...'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Gamification summary could not be loaded.'),
    ).toBeInTheDocument()
  })

  it('handles an empty board with zero progress', () => {
    // Arrange
    useBoardStore.setState({
      tasks: [],
    })

    useGamificationStore.setState({
      summary: null,
    })

    // Act
    render(<BoardPage />)

    // Assert
    const progressBar = screen.getByRole('progressbar', {
      name: 'Sprint progress',
    })

    expect(progressBar).toHaveAttribute('value', '0')

    expect(
      screen.getByText(
        'Create your first task to start tracking sprint progress.',
      ),
    ).toBeInTheDocument()

    expect(
      screen.getAllByText('No tasks here yet.'),
    ).toHaveLength(5)
  })

  it('displays XP and unlocked achievement information', () => {
    // Act
    render(<BoardPage />)

    // Assert
    const summary = screen.getByRole('region', {
      name: 'Sprint progress summary',
    })

    expect(within(summary).getByText('Total XP')).toBeInTheDocument()
    expect(within(summary).getByText('90')).toBeInTheDocument()

    expect(
      within(summary).getByText('Achievements'),
    ).toBeInTheDocument()

    expect(within(summary).getByText('1')).toBeInTheDocument()

    expect(
      within(summary).getByText('First Task Complete'),
    ).toBeInTheDocument()
  })

  it('rejects a blank task title before creating a task', async () => {
    // Arrange
    const setErrorMessage = vi.mocked(
      useBoardStore.getState().setErrorMessage,
    )

    const createTask = vi.mocked(
      useBoardStore.getState().createTask,
    )

    render(<BoardPage />)

    const titleInput = screen.getByLabelText('Task title')

    fireEvent.change(titleInput, {
      target: {
        value: '   ',
      },
    })

    // Act
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Create task',
      }),
    )

    // Assert
    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledWith(
        'Task title is required.',
      )
    })

    expect(createTask).not.toHaveBeenCalled()
  })

})
