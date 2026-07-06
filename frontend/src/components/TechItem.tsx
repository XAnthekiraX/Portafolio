import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Technology } from "../types";
import { ScrollReveal } from "./ScrollReveal";

function pascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Icons.HelpCircle as unknown as LucideIcon;
  const iconName = pascalCase(name);
  return (Icons as unknown as Record<string, LucideIcon>)[iconName] ?? (Icons.HelpCircle as unknown as LucideIcon);
}

interface TechItemProps {
  tech: Technology;
  index: number;
}

export function TechItem({ tech, index }: TechItemProps) {
  const Icon = resolveIcon(tech.icon);
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
