import { Github, ExternalLink } from "lucide-react";
import type { Project } from "../types";
import { ScrollReveal } from "./ScrollReveal";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const borderHover = index % 2 === 0 ? "hover:border-primary/50" : "hover:border-accent/50";
  const titleHover = index % 2 === 0 ? "group-hover:text-primary" : "group-hover:text-accent";

  return (
    <ScrollReveal delay={index * 0.1}>
      <article
        className={`group flex flex-col overflow-hidden rounded-2xl border border-dark-800 bg-dark-950 transition-all duration-300 ${borderHover}`}
      >
        <div className="relative h-64 overflow-hidden bg-dark-800">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 mix-blend-overlay" />
          <img
            src={project.imageUrl}
            alt={project.title}
            className="h-full w-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 font-mono text-xs text-white">
            {project.category}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-8">
          <h3
            className={`mb-2 text-2xl font-bold transition-colors ${titleHover}`}
          >
            {project.title}
          </h3>
          <p className="mb-6 flex-1 text-dark-400">{project.description}</p>

          <div className="mb-6">
            <p className="mb-2 font-mono text-xs text-dark-400">Features:</p>
            <div className="flex flex-wrap gap-2">
              {project.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded bg-dark-800 px-2 py-1 font-mono text-xs text-dark-100"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 border-t border-dark-800 pt-4">
            <a
              href={project.repoUrl}
              className="flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-accent"
            >
              <Github className="h-4 w-4" /> Repo
            </a>
            <a
              href={project.demoUrl}
              className="ml-auto flex items-center gap-2 text-sm text-dark-400 transition-colors hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> Demo
            </a>
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
