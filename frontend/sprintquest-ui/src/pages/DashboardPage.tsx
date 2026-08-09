import { useEffect } from 'react';
import { useAppSelectionStore } from '../stores/useAppSelectionStore';
import { useBoardStore } from '../stores/useBoardStore';
import { useGamificationStore } from '../stores/useGamificationStore';

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

  const tasks = useBoardStore((state) => state.tasks);
  const loadTasks = useBoardStore(
    (state) => state.loadTasks,
  );

  const gamificationSummary = useGamificationStore(
    (state) => state.summary,
  );
  const loadGamificationSummary = useGamificationStore(
    (state) => state.loadSummary,
  );

  const isDashboardLoading =
    isProjectsLoading || isSprintsLoading;

  const selectedSprint = sprints.find(
    (sprint) => sprint.id === selectedSprintId,
  );

  useEffect(() => {
    if (!selectedSprintId) {
      return;
    }

    void loadTasks(selectedSprintId);
  }, [loadTasks, selectedSprintId]);

  useEffect(() => {
    void loadGamificationSummary();
  }, [loadGamificationSummary]);

  const selectedSprintTasks = selectedSprintId
    ? tasks.filter(
        (task) => task.sprintId === selectedSprintId,
      )
    : [];

  const completedTaskCount = selectedSprintTasks.filter(
    (task) => task.status === 4,
  ).length;

  const remainingTaskCount =
    selectedSprintTasks.length - completedTaskCount;

  const completionPercentage =
    selectedSprintTasks.length === 0
      ? 0
      : Math.round(
          (completedTaskCount / selectedSprintTasks.length) *
            100,
        );

  const totalXp = gamificationSummary?.totalXp ?? 0;
  const unlockedAchievements =
    gamificationSummary?.unlockedAchievements ?? [];

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
        Track your projects, sprint progress, and XP rewards
        in one place.
      </p>

      <div className="dashboard-grid">
        <article className="stat-card">
          <span className="stat-label">
            Active Projects
          </span>
          <strong>{projects.length}</strong>
          <p>Projects currently available.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Current Sprint
          </span>

          {selectedSprint ? (
            <>
              <strong>{selectedSprint.name}</strong>
              <p>
                {formatDashboardDate(
                  selectedSprint.startDate,
                )}
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

        <article className="stat-card">
          <span className="stat-label">
            Completed Tasks
          </span>
          <strong>{completedTaskCount}</strong>
          <p>Tasks completed in the selected sprint.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Remaining Tasks
          </span>
          <strong>{remainingTaskCount}</strong>
          <p>Tasks still requiring completion.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Sprint Completion
          </span>
          <strong>{completionPercentage}%</strong>
          <p>Progress across the selected sprint.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">XP Earned</span>
          <strong>{totalXp} XP</strong>
          <p>XP earned by completing tasks.</p>
        </article>

        <article className="stat-card">
          <span className="stat-label">
            Achievements
          </span>
          <strong>
            {unlockedAchievements.length} unlocked
          </strong>

          {unlockedAchievements.length > 0 ? (
            <ul>
              {unlockedAchievements.map((achievement) => (
                <li key={achievement.badgeKey}>
                  {achievement.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No achievements unlocked yet.</p>
          )}
        </article>
      </div>
    </section>
  );
}