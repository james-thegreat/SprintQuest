export function DashboardPage() {
  return (
    <section>
      <div className="page-header">
        <div>
          <p className="eyebrow">SprintQuest</p>
          <h1>Dashboard</h1>
          <p className="page-description">
            Track your projects, sprint progress, and XP rewards in one place.
          </p>
        </div>
      </div>

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