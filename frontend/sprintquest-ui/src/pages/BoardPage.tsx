import { useEffect, useState, type FormEvent } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasksApi';
import {
  taskPriorities,
  taskPriorityLabels,
  taskStatusLabels,
  taskStatuses,
  type SprintTask,
  type TaskPriority,
  type TaskStatus,
} from '../types/task';

const defaultSprintId = '9ed966c5-43b8-4b05-8254-cf40666e4b25';

const sampleTasks: SprintTask[] = [
  {
    id: '1',
    sprintId: '1',
    title: 'Design sprint board layout',
    description: 'Create the first responsive board view for SprintQuest.',
    status: 4,
    priority: 2,
    storyPoints: 3,
    xpReward: 50,
  },
  {
    id: '2',
    sprintId: '2',
    title: 'Connect board to task API',
    description: 'Load task cards from the backend instead of sample data.',
    status: 2,
    priority: 2,
    storyPoints: 5,
    xpReward: 80,
  },
  {
    id: '3',
    sprintId: '3',
    title: 'Add task create form',
    description: 'Allow users to create a task from the board page.',
    status: 1,
    priority: 1,
    storyPoints: 3,
    xpReward: 40,
  },
  {
    id: '4',
    sprintId: '4',
    title: 'Review checklist progress UI',
    description: 'Show checklist progress on each task card.',
    status: 0,
    priority: 0,
    storyPoints: 2,
    xpReward: 25,
  },
];

export function BoardPage() {

    const [tasks, setTasks] = useState<SprintTask[]>(sampleTasks);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(1);
    const [newTaskStoryPoints, setNewTaskStoryPoints] = useState(1);
    const [newTaskXpReward, setNewTaskXpReward] = useState(10);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        async function loadTasks() {
            try {
            const apiTasks = await getTasks();
            setTasks(apiTasks);
            } catch {
            setErrorMessage('Could not load tasks from the API. Showing sample board data for now.');
            setTasks(sampleTasks);
            } finally {
            setIsLoading(false);
            }
        }

        void loadTasks();
    }, []);

    async function handleStatusChange(task: SprintTask, nextStatus: TaskStatus) {
        const previousTasks = tasks;

        const updatedTask: SprintTask = {
            ...task,
            status: nextStatus,
        };

        setTasks((currentTasks) =>
            currentTasks.map((currentTask) =>
            currentTask.id === task.id ? updatedTask : currentTask,
            ),
        );

        try {
            await updateTask(task.id, {
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            storyPoints: updatedTask.storyPoints,
            xpReward: updatedTask.xpReward,
            });

            setErrorMessage(null);
        } catch {
            setTasks(previousTasks);
            setErrorMessage('Could not update the task status. Please try again.');
        }
    }

    async function handleDeleteTask(taskId: string) {
        const previousTasks = tasks;

        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== taskId),
        );

        try {
            await deleteTask(taskId);
            setErrorMessage(null);
        } catch {
            setTasks(previousTasks);
            setErrorMessage('Could not delete the task. Please try again.');
        }
    }

    async function handleCreateTask(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedTitle = newTaskTitle.trim();

        if (!trimmedTitle) {
            setErrorMessage('Task title is required.');
            return;
        }

        setIsCreating(true);

        try {
            const createdTask = await createTask({
            sprintId: defaultSprintId,
            title: trimmedTitle,
            description: newTaskDescription.trim() || null,
            priority: newTaskPriority,
            storyPoints: newTaskStoryPoints,
            xpReward: newTaskXpReward,
            });

            setTasks((currentTasks) => [createdTask, ...currentTasks]);
            setNewTaskTitle('');
            setNewTaskDescription('');
            setNewTaskPriority(1);
            setNewTaskStoryPoints(1);
            setNewTaskXpReward(10);
            setErrorMessage(null);
        } catch {
            setErrorMessage('Could not create the task. Please try again.');
        } finally {
            setIsCreating(false);
        }
    }

    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 4).length;
    const remainingTasks = totalTasks - completedTasks;

    const sprintProgressPercentage =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const totalSprintXp = tasks.reduce(
        (total, task) => total + task.xpReward,
        0,
    );

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
                <p className="summary-label">Sprint XP</p>
                <strong>
                    {completedSprintXp} / {totalSprintXp}
                </strong>
                <p className="summary-help-text">XP earned from completed board tasks.</p>
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