import {
  LayoutDashboard,
  Server,
  Cloud,
  Wrench,
  Palette,
  type LucideIcon,
} from "lucide-react";
import type { SkillCategory } from "../types";
import { ScrollReveal } from "./ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  "layout-dashboard": LayoutDashboard,
  server: Server,
  cloud: Cloud,
  wrench: Wrench,
  palette: Palette,
};

interface SkillCardProps {
  skill: SkillCategory;
  index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
  const Icon = iconMap[skill.icon] || LayoutDashboard;
  const isAccent = index % 2 !== 0;

  return (
    <ScrollReveal delay={index * 0.1}>
      <div className="rounded-2xl border border-dark-800 bg-dark-950 p-8 transition-colors hover:border-dark-700">
        <div className="mb-6 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              isAccent ? "bg-accent/10" : "bg-primary/10"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${isAccent ? "text-accent" : "text-primary"}`}
            />
          </div>
          <h3 className="text-2xl font-semibold">{skill.name}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skill.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md bg-dark-800 px-3 py-1 font-mono text-sm text-dark-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
