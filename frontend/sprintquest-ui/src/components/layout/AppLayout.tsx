import { useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAppSelectionStore } from '../../stores/useAppSelectionStore';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/board', label: 'Sprint Board' },
  { to: '/progress', label: 'Progress' },
];



export function AppLayout() {
  const initialise = useAppSelectionStore(
    (state) => state.initialise,
  );

  const projects = useAppSelectionStore(
    (state) => state.projects,
  );

  const selectedProjectId = useAppSelectionStore(
    (state) => state.selectedProjectId,
  );

  const sprints = useAppSelectionStore(
    (state) => state.sprints,
  );

  const selectedSprintId = useAppSelectionStore(
    (state) => state.selectedSprintId,
  );

  const selectProject = useAppSelectionStore(
    (state) => state.selectProject,
  );

  const isProjectsLoading = useAppSelectionStore(
    (state) => state.isProjectsLoading,
  );

  const selectSprint = useAppSelectionStore(
    (state) => state.selectSprint,
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

  useEffect(() => {
    void initialise();
  }, [initialise]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h2>SprintQuest</h2>

        <div className="app-context-selectors">
          <div>
            <label htmlFor="project-selector">
              Project
            </label>

            <select
              id="project-selector"
              value={selectedProjectId ?? ''}
              disabled={
                isProjectsLoading || projects.length === 0
              }
              onChange={(event) => {
                void selectProject(event.target.value);
              }}
            >

              {isProjectsLoading ? (
                <option value="">
                  Loading projects...
                </option>
              ) : projects.length === 0 ? (
                <option value="">
                  No projects available
                </option>
              ) : (
                projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))
              )}
            </select>

            {projectsErrorMessage && (
                <p role="alert">
                  {projectsErrorMessage}
                </p>
              )}
          </div>

          <div>
            <label htmlFor="sprint-selector">
              Sprint
            </label>

            <select
              id="sprint-selector"
              value={selectedSprintId ?? ''}
              disabled={
                isSprintsLoading || sprints.length === 0
              }
              onChange={(event) => {
                selectSprint(event.target.value);
              }}
            >
              {isSprintsLoading ? (
                <option value="">
                  Loading sprints...
                </option>
              ) : sprints.length === 0 ? (
                <option value="">
                  No sprints available
                </option>
              ) : (
                sprints.map((sprint) => (
                  <option
                    key={sprint.id}
                    value={sprint.id}
                  >
                    {sprint.name}
                  </option>
                ))
              )}
            </select>

            {sprintsErrorMessage && (
              <p role="alert">
                {sprintsErrorMessage}
              </p>
            )}
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}