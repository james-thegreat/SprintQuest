import { useAppSelectionStore } from '../stores/useAppSelectionStore';

export function ProjectsPage() {
  const projects = useAppSelectionStore((state) => state.projects);

  return (
    <section>
      <h1>Projects</h1>

      {projects.map((project) => (
        <article key={project.id}>
          <h2>{project.name}</h2>
          {project.description && <p>{project.description}</p>}
        </article>
      ))}
    </section>
  );
}
