import { beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteTask, updateTask } from '../api/tasksApi'
import type { SprintTask } from '../types/task'
import { useBoardStore } from './useBoardStore'

vi.mock('../api/tasksApi', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
}))

const backlogTask: SprintTask = {
  id: 'task-1',
  sprintId: 'sprint-1',
  title: 'Write store tests',
  description: 'Protect Zustand behaviour',
  status: 0,
  priority: 2,
  storyPoints: 3,
  xpReward: 30,
}

const secondTask: SprintTask = {
  id: 'task-2',
  sprintId: 'sprint-1',
  title: 'Test task removal',
  description: 'Remove only the matching task',
  status: 1,
  priority: 1,
  storyPoints: 2,
  xpReward: 20,
}

describe('useBoardStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    useBoardStore.setState({
      tasks: [],
      isLoading: false,
      isCreating: false,
      errorMessage: null,
    })
  })

  describe('reconcileTask', () => {
    it('adds a task when its ID does not exist', () => {
      // Act
      useBoardStore.getState().reconcileTask(backlogTask)

      // Assert
      expect(useBoardStore.getState().tasks).toEqual([backlogTask])
    })

    it('replaces an existing task without creating a duplicate', () => {
      // Arrange
      useBoardStore.setState({
        tasks: [backlogTask],
      })

      const authoritativeTask: SprintTask = {
        ...backlogTask,
        title: 'Authoritative task title',
        status: 2,
        completedAt: null,
      }

      // Act
      useBoardStore.getState().reconcileTask(authoritativeTask)

      // Assert
      const tasks = useBoardStore.getState().tasks

      expect(tasks).toHaveLength(1)
      expect(tasks[0]).toEqual(authoritativeTask)
    })
  })

  describe('removeTaskById', () => {
    it('removes only the task with the matching ID', () => {
      // Arrange
      useBoardStore.setState({
        tasks: [backlogTask, secondTask],
      })

      // Act
      useBoardStore.getState().removeTaskById(backlogTask.id)

      // Assert
      expect(useBoardStore.getState().tasks).toEqual([secondTask])
    })

    it('remains safe when the task ID does not exist', () => {
      // Arrange
      useBoardStore.setState({
        tasks: [backlogTask, secondTask],
      })

      // Act
      useBoardStore.getState().removeTaskById('missing-task')

      // Assert
      expect(useBoardStore.getState().tasks).toEqual([
        backlogTask,
        secondTask,
      ])
    })
  })

  describe('updateTaskStatus', () => {
    it('applies an optimistic status and then uses the authoritative API task', async () => {
      // Arrange
      useBoardStore.setState({
        tasks: [backlogTask],
      })

      const authoritativeTask: SprintTask = {
        ...backlogTask,
        title: 'Server-confirmed task title',
        status: 2,
        completedAt: null,
      }

      let resolveUpdate!: (task: SprintTask) => void

      const updatePromise = new Promise<SprintTask>((resolve) => {
        resolveUpdate = resolve
      })

      vi.mocked(updateTask).mockReturnValue(updatePromise)

      // Act
      const resultPromise = useBoardStore
        .getState()
        .updateTaskStatus(backlogTask, 2)

      // Assert optimistic state
      expect(useBoardStore.getState().tasks[0].status).toBe(2)

      // Complete the API request
      resolveUpdate(authoritativeTask)

      await expect(resultPromise).resolves.toBe(true)

      expect(updateTask).toHaveBeenCalledWith(backlogTask.id, {
        title: backlogTask.title,
        description: backlogTask.description,
        status: 2,
        priority: backlogTask.priority,
        storyPoints: backlogTask.storyPoints,
        xpReward: backlogTask.xpReward,
      })

      expect(useBoardStore.getState().tasks).toEqual([
        authoritativeTask,
      ])
      expect(useBoardStore.getState().errorMessage).toBeNull()
    })

    it('restores the previous tasks when the API update fails', async () => {
      // Arrange
      const previousTasks = [backlogTask, secondTask]

      useBoardStore.setState({
        tasks: previousTasks,
      })

      vi.mocked(updateTask).mockRejectedValue(
        new Error('Update request failed'),
      )

      // Act
      const result = await useBoardStore
        .getState()
        .updateTaskStatus(backlogTask, 3)

      // Assert
      expect(result).toBe(false)
      expect(useBoardStore.getState().tasks).toEqual(previousTasks)
      expect(useBoardStore.getState().errorMessage).toBe(
        'Could not update the task status. Please try again.',
      )
    })
  })


  describe('deleteTask', () => {
    it('removes the task optimistically and keeps it removed after success', async () => {
      // Arrange
      useBoardStore.setState({
        tasks: [backlogTask, secondTask],
      })

      let resolveDelete!: () => void

      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = () => resolve()
      })

      vi.mocked(deleteTask).mockReturnValue(deletePromise)

      // Act
      const resultPromise = useBoardStore
        .getState()
        .deleteTask(backlogTask.id)

      // Assert optimistic state
      expect(useBoardStore.getState().tasks).toEqual([secondTask])
      expect(useBoardStore.getState().errorMessage).toBeNull()

      // Complete the API request
      resolveDelete()

      await expect(resultPromise).resolves.toBe(true)

      expect(deleteTask).toHaveBeenCalledWith(backlogTask.id)
      expect(useBoardStore.getState().tasks).toEqual([secondTask])
      expect(useBoardStore.getState().errorMessage).toBeNull()
    })

    it('restores the removed task when the API deletion fails', async () => {
      // Arrange
      const previousTasks = [backlogTask, secondTask]

      useBoardStore.setState({
        tasks: previousTasks,
      })

      vi.mocked(deleteTask).mockRejectedValue(
        new Error('Delete request failed'),
      )

      // Act
      const result = await useBoardStore
        .getState()
        .deleteTask(backlogTask.id)

      // Assert
      expect(result).toBe(false)
      expect(useBoardStore.getState().tasks).toEqual(previousTasks)
      expect(useBoardStore.getState().errorMessage).toBe(
        'Could not delete the task. Please try again.',
      )
    })
  })

})
