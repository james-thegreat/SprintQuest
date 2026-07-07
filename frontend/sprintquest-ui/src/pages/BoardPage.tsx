type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Testing' | 'Done';

type SprintTask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  storyPoints: number;
  xpReward: number;
};

const boardColumns: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'Testing', 'Done'];

const sampleTasks: SprintTask[] = [
  {
    id: 1,
    title: 'Design sprint board layout',
    description: 'Create the first responsive board view for SprintQuest.',
    status: 'Done',
    priority: 'High',
    storyPoints: 3,
    xpReward: 50,
  },
  {
    id: 2,
    title: 'Connect board to task API',
    description: 'Load task cards from the backend instead of sample data.',
    status: 'In Progress',
    priority: 'High',
    storyPoints: 5,
    xpReward: 80,
  },
  {
    id: 3,
    title: 'Add task create form',
    description: 'Allow users to create a task from the board page.',
    status: 'To Do',
    priority: 'Medium',
    storyPoints: 3,
    xpReward: 40,
  },
  {
    id: 4,
    title: 'Review checklist progress UI',
    description: 'Show checklist progress on each task card.',
    status: 'Backlog',
    priority: 'Low',
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
        {boardColumns.map((column) => {
          const columnTasks = sampleTasks.filter((task) => task.status === column);

          return (
            <section className="board-column" key={column}>
              <div className="board-column-header">
                <h2>{column}</h2>
                <span>{columnTasks.length}</span>
              </div>

              <div className="task-card-list">
                {columnTasks.map((task) => (
                  <article className="task-card" key={task.id}>
                    <div className="task-card-header">
                      <h3>{task.title}</h3>
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
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