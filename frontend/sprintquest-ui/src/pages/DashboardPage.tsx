import { useAppSelectionStore } from '../stores/useAppSelectionStore';

const dashboardDateFormatter = new Intl.DateTimeFormat('en-NZ', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatDashboardDate(date: string) {
  return dashboardDateFormatter.format(new Date(date));
}

export function DashboardPage() {
  const isProjectsLoading = useAppSelectionStore(
    (state) => state.isProjectsLoading,
  );
  const isSprintsLoading = useAppSelectionStore(
    (state) => state.isSprintsLoading,
  );

  const isDashboardLoading =
    isProjectsLoading || isSprintsLoading;

  const projectsErrorMessage = useAppSelectionStore(
    (state) => state.projectsErrorMessage,
  );

  const sprintsErrorMessage = useAppSelectionStore(
    (state) => state.sprintsErrorMessage,
  );

  const loadProjects = useAppSelectionStore(
    (state) => state.loadProjects,
  );

  const selectedProjectId = useAppSelectionStore(
    (state) => state.selectedProjectId,
  );
  const loadSprints = useAppSelectionStore(
    (state) => state.loadSprints,
  );

  const projects = useAppSelectionStore(
  (state) => state.projects,
);
const sprints = useAppSelectionStore(
  (state) => state.sprints,
);
const selectedSprintId = useAppSelectionStore(
  (state) => state.selectedSprintId,
);

const selectedSprint = sprints.find(
  (sprint) => sprint.id === selectedSprintId,
);

  if (isDashboardLoading) {
    return (
      <section>
        <p>SprintQuest</p>
        <h1>Dashboard</h1>

        <div
          role="status"
          aria-label="Loading dashboard"
        >
          Loading dashboard...
        </div>
      </section>
    );
  }

  if (projectsErrorMessage) {
    return (
      <section>
        <p>SprintQuest</p>
        <h1>Dashboard</h1>

        <div role="alert">
          <p>{projectsErrorMessage}</p>

          <button
            type="button"
            onClick={() => void loadProjects()}
          >
            Retry Projects
          </button>
        </div>
      </section>
    );
  }

  if (sprintsErrorMessage) {
    return (
      <section>
        <p>SprintQuest</p>
        <h1>Dashboard</h1>

        <div role="alert">
          <p>{sprintsErrorMessage}</p>

          <button
            type="button"
            disabled={!selectedProjectId}
            onClick={() => {
              if (selectedProjectId) {
                void loadSprints(selectedProjectId);
              }
            }}
          >
            Retry Sprints
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <p>SprintQuest</p>
      <h1>Dashboard</h1>

      <p>
        Track your projects, sprint progress, and XP rewards in one place.
      </p>

      <div className="dashboard-grid">
        <article className="stat-card">
          <span className="stat-label">Active Projects</span>
          <strong>0</strong>
          <p>Projects will appear here once the API is connected.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">Active Projects</span>
          <strong>{projects.length}</strong>
          <p>Projects currently available.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">Current Sprint</span>

          {selectedSprint ? (
            <>
              <strong>{selectedSprint.name}</strong>
              <p>
                {formatDashboardDate(selectedSprint.startDate)}
                {' – '}
                {formatDashboardDate(selectedSprint.endDate)}
              </p>
            </>
          ) : (
            <>
              <strong>No sprint selected</strong>
              <p>Select a sprint to view its summary.</p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}