import {
  taskPriorityLabels,
  taskStatusLabels,
  taskStatuses,
  type SprintTask,
} from '../types/task';

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
  return (
    <section>
      <header className="page-header">
        <p className="eyebrow">M6 Sprint Board UI</p>
        <h1>Sprint Board</h1>
        <p className="page-description">
          Track sprint work across the board and build momentum as tasks move toward Done.
        </p>
      </header>

      <div className="board-grid">
        {taskStatuses.map((column) => {
          const columnTasks = sampleTasks.filter((task) => task.status === column);

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