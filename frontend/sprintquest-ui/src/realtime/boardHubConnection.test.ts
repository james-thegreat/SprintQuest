import { describe, expect, it } from 'vitest'
import type { SprintTask } from '../types/task'
import { isTaskForActiveSprint } from './boardHubConnection'

const sprintOneTask: SprintTask = {
  id: 'task-1',
  sprintId: 'sprint-1',
  title: 'Sprint one task',
  description: null,
  status: 0,
  priority: 1,
  storyPoints: 2,
  xpReward: 20,
}

describe('boardHubConnection sprint filtering', () => {
  it('accepts only tasks belonging to the active sprint', () => {
    expect(
      isTaskForActiveSprint(
        sprintOneTask,
        'sprint-1',
      ),
    ).toBe(true)

    expect(
      isTaskForActiveSprint(
        sprintOneTask,
        'sprint-2',
      ),
    ).toBe(false)

    expect(
      isTaskForActiveSprint(
        sprintOneTask,
        null,
      ),
    ).toBe(false)
  })
})