import { useAppSelectionStore } from '../stores/useAppSelectionStore';

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
          <span className="stat-label">Current Sprint</span>
          <strong>Not started</strong>
          <p>Create a sprint board in the next milestone.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">XP Earned</span>
          <strong>0 XP</strong>
          <p>XP rewards will unlock when tasks are completed.</p>
        </article>
      </div>
    </section>
  );
}