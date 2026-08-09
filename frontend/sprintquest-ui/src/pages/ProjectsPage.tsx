import { useAppSelectionStore } from '../stores/useAppSelectionStore';

export function ProjectsPage() {
  const projects = useAppSelectionStore((state) => state.projects);
  const selectedProjectId = useAppSelectionStore(
    (state) => state.selectedProjectId,
  );
  const sprints = useAppSelectionStore((state) => state.sprints);
  const selectedSprintId = useAppSelectionStore(
    (state) => state.selectedSprintId,
  );
  const selectProject = useAppSelectionStore(
    (state) => state.selectProject,
  );
  const selectSprint = useAppSelectionStore(
    (state) => state.selectSprint,
  );

  return (
    <section>
      <h1>Projects</h1>

      {projects.map((project) => {
        const isSelected = project.id === selectedProjectId;

        return (
          <article key={project.id}>
            <h2>{project.name}</h2>

            {project.description && <p>{project.description}</p>}

            <button
              type="button"
              aria-label={`Select ${project.name}`}
              disabled={isSelected}
              onClick={() => void selectProject(project.id)}
            >
              {isSelected ? 'Selected' : 'Select project'}
            </button>
          </article>
        );
      })}

      <h2>Sprints</h2>

      {sprints.map((sprint) => {
        const isSelected = sprint.id === selectedSprintId;

        return (
          <article key={sprint.id}>
            <h3>{sprint.name}</h3>

            <button
              type="button"
              aria-label={`Select ${sprint.name}`}
              disabled={isSelected}
              onClick={() => selectSprint(sprint.id)}
            >
              {isSelected ? 'Selected' : 'Select sprint'}
            </button>
          </article>
        );
      })}
    </section>
  );
}