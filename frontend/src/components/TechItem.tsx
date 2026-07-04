import {
  Github,
  Figma,
  Database,
  Cloud,
  Terminal,
  GitBranch,
  Boxes,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { Technology } from "../types";
import { ScrollReveal } from "./ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  github: Github,
  figma: Figma,
  database: Database,
  cloud: Cloud,
  terminal: Terminal,
  "git-branch": GitBranch,
  boxes: Boxes,
  zap: Zap,
};

interface TechItemProps {
  tech: Technology;
  index: number;
}

export function TechItem({ tech, index }: TechItemProps) {
  const Icon = iconMap[tech.icon] || Github;
  const borderColor = index % 2 === 0 ? "hover:border-primary" : "hover:border-accent";

  return (
    <ScrollReveal delay={index * 0.05}>
      <div
        className={`flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dark-800 bg-dark-900 p-6 transition-all hover:-translate-y-1 ${borderColor}`}
      >
        <Icon className="mb-2 h-8 w-8 text-dark-100" />
        <span className="font-mono text-xs text-dark-400">{tech.name}</span>
      </div>
    </ScrollReveal>
  );
}
