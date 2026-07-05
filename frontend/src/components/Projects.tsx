import { useProjects } from "../hooks/useProjects";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";

export function Projects() {
  const { projects } = useProjects();

  return (
    <section
      id="projects"
      className="border-y border-dark-800 bg-dark-900 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 04. Proyectos
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Trabajo seleccionado
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
