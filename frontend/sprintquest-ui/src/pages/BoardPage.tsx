import { useEffect, useState, type FormEvent } from 'react';
import { useBoardStore } from '../stores/useBoardStore';
import {
  taskPriorities,
  taskPriorityLabels,
  taskStatusLabels,
  taskStatuses,
  type SprintTask,
  type TaskPriority,
  type TaskStatus,
} from '../types/task';
import { useGamificationStore } from '../stores/useGamificationStore';

const defaultSprintId = '9ed966c5-43b8-4b05-8254-cf40666e4b25';

export function BoardPage() {

    const tasks = useBoardStore((state) => state.tasks);
    const isLoading = useBoardStore((state) => state.isLoading);
    const errorMessage = useBoardStore((state) => state.errorMessage);
    const loadTasks = useBoardStore((state) => state.loadTasks);
    const setErrorMessage = useBoardStore((state) => state.setErrorMessage);

    const updateTaskStatus = useBoardStore(
      (state) => state.updateTaskStatus,
    );

    const deleteTaskFromStore = useBoardStore(
      (state) => state.deleteTask,
    );

    const isCreating = useBoardStore((state) => state.isCreating);

    const createTaskInStore = useBoardStore(
      (state) => state.createTask,
    );

    const gamificationSummary = useGamificationStore(
      (state) => state.summary,
    );

    const isGamificationLoading = useGamificationStore(
      (state) => state.isLoading,
    );

    const gamificationErrorMessage = useGamificationStore(
      (state) => state.errorMessage,
    );

    const loadGamificationSummary = useGamificationStore(
      (state) => state.loadSummary,
    );

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(1);
    const [newTaskStoryPoints, setNewTaskStoryPoints] = useState(1);
    const [newTaskXpReward, setNewTaskXpReward] = useState(10);


    useEffect(() => {
      void loadTasks();
    }, [loadTasks]);

    useEffect(() => {
      void loadGamificationSummary();
    }, [loadGamificationSummary]);



    async function handleStatusChange(
      task: SprintTask,
      nextStatus: TaskStatus,
    ) {
      const wasUpdated = await updateTaskStatus(task, nextStatus);

      if (!wasUpdated) {
        return;
      }

      await loadGamificationSummary();
    }

    async function handleDeleteTask(taskId: string) {
      await deleteTaskFromStore(taskId);
    }



    async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const trimmedTitle = newTaskTitle.trim();

      if (!trimmedTitle) {
        setErrorMessage('Task title is required.');
        return;
      }

      const wasCreated = await createTaskInStore({
        sprintId: defaultSprintId,
        title: trimmedTitle,
        description: newTaskDescription.trim() || null,
        priority: newTaskPriority,
        storyPoints: newTaskStoryPoints,
        xpReward: newTaskXpReward,
      });

      if (!wasCreated) {
        return;
      }

      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority(1);
      setNewTaskStoryPoints(1);
      setNewTaskXpReward(10);
    }


    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 4).length;
    const remainingTasks = totalTasks - completedTasks;

    const sprintProgressPercentage =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);



    const completedSprintXp = tasks
        .filter((task) => task.status === 4)
        .reduce((total, task) => total + task.xpReward, 0);

  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">M6 Sprint Board UI</p>
        <h1>Sprint Board</h1>
        <p className="page-description">
          Track sprint work across the board and build momentum as tasks move toward Done.
        </p>
      </header>

      {isLoading && <p className="board-message">Loading board tasks...</p>}
      {errorMessage && <p className="board-message board-message-error">{errorMessage}</p>}

      {isGamificationLoading && (
        <p className="board-message">Loading gamification summary...</p>
      )}

      {gamificationErrorMessage && (
        <p className="board-message board-message-error">
          {gamificationErrorMessage}
        </p>
      )}
        
              <section className="gamification-summary" aria-label="Sprint progress summary">
                <article className="summary-card summary-card-wide">
                <p className="summary-label">Sprint Progress</p>
                <strong>{sprintProgressPercentage}%</strong>

                <progress
                    className="sprint-progress-bar"
                    max="100"
                    value={sprintProgressPercentage}
                >
                    {sprintProgressPercentage}%
                </progress>

                <p className="summary-help-text">
                    {totalTasks === 0
                    ? 'Create your first task to start tracking sprint progress.'
                    : `${completedTasks} of ${totalTasks} tasks complete.`}
                </p>
                </article>

                <article className="summary-card">
                <p className="summary-label">Tasks Remaining</p>
                <strong>{remainingTasks}</strong>
                <p className="summary-help-text">
                    {remainingTasks === 0 && totalTasks > 0
                    ? 'Sprint complete!'
                    : 'Move tasks to Done to finish the sprint.'}
                </p>
                </article>

                <article className="summary-card">
                  <p className="summary-label">Total XP</p>
                  <strong>{gamificationSummary?.totalXp ?? completedSprintXp}</strong>
                  <p className="summary-help-text">
                    XP earned from completed task rewards.
                  </p>
                </article>

                <article className="summary-card">
                  <p className="summary-label">Achievements</p>
                  <strong>{gamificationSummary?.unlockedAchievements.length ?? 0}</strong>
                  <p className="summary-help-text">
                    {gamificationSummary?.unlockedAchievements.length
                      ? gamificationSummary.unlockedAchievements
                          .map((achievement) => achievement.name)
                          .join(', ')
                      : 'Complete your first task to unlock an achievement.'}
                  </p>
              </article>
            </section>

        

        <form className="task-create-form" onSubmit={handleCreateTask}>
            <div className="form-field">
                <label htmlFor="task-title">Task title</label>
                <input
                id="task-title"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Add a new sprint task"
                />
            </div>

            <div className="form-field">
                <label htmlFor="task-description">Description</label>
                <input
                id="task-description"
                value={newTaskDescription}
                onChange={(event) => setNewTaskDescription(event.target.value)}
                placeholder="What needs to be done?"
                />
            </div>

            <div className="form-row">
                <div className="form-field">
                <label htmlFor="task-priority">Priority</label>
                <select
                    id="task-priority"
                    value={newTaskPriority}
                    onChange={(event) => setNewTaskPriority(Number(event.target.value) as TaskPriority)}
                >
                    {taskPriorities.map((priority) => (
                    <option value={priority} key={priority}>
                        {taskPriorityLabels[priority]}
                    </option>
                    ))}
                </select>
                </div>

                <div className="form-field">
                <label htmlFor="task-story-points">Story points</label>
                <input
                    id="task-story-points"
                    min="0"
                    type="number"
                    value={newTaskStoryPoints}
                    onChange={(event) => setNewTaskStoryPoints(Number(event.target.value))}
                />
                </div>

                <div className="form-field">
                <label htmlFor="task-xp">XP reward</label>
                <input
                    id="task-xp"
                    min="0"
                    type="number"
                    value={newTaskXpReward}
                    onChange={(event) => setNewTaskXpReward(Number(event.target.value))}
                />
                </div>
            </div>

            <button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating task...' : 'Create task'}
            </button>
        </form>


      <div className="board-grid">
        {taskStatuses.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column);

          return (
            <section className="board-column" key={column}>
              <div className="board-column-header">
                <h2>{taskStatusLabels[column]}</h2>
                <span>{columnTasks.length}</span>
              </div>

              <div className="task-card-list">
                {columnTasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className="task-card-header">
                      <h3>{task.title}</h3>
                      <span className={`priority-badge priority-${taskPriorityLabels[task.priority].toLowerCase()}`}>
                        {taskPriorityLabels[task.priority]}
                      </span>
                    </div>

                    <p>{task.description}</p>

                    <div className="task-card-meta">
                      <span>{task.storyPoints} SP</span>
                      <span>{task.xpReward} XP</span>
                    </div>

                    <label className="task-status-control">
                    <span>Status</span>
                    <select
                        value={task.status}
                        onChange={(event) =>
                        void handleStatusChange(task, Number(event.target.value) as TaskStatus)
                        }
                    >
                        {taskStatuses.map((status) => (
                        <option value={status} key={status}>
                            {taskStatusLabels[status]}
                        </option>
                        ))}
                    </select>
                    </label>
                    
                    <button
                        className="task-delete-button"
                        type="button"
                        onClick={() => void handleDeleteTask(task.id)}
                    >
                        Delete task
                    </button>

                  </article>
                ))}

                {columnTasks.length === 0 && (
                  <p className="empty-column">No tasks here yet.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}