import { Code, PenTool, Rocket, type LucideIcon } from "lucide-react";
import type { Service } from "../types";
import { ScrollReveal } from "./ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  code: Code,
  "pen-tool": PenTool,
  rocket: Rocket,
};

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Code;
  const isAccent = index % 2 !== 0;
  const borderHover = isAccent ? "hover:border-accent" : "hover:border-primary";
  const iconHoverBg = isAccent
    ? "group-hover:bg-accent group-hover:text-white"
    : "group-hover:bg-primary group-hover:text-white";

  return (
    <ScrollReveal delay={index * 0.1}>
      <div
        className={`group rounded-2xl border border-dark-800 bg-dark-950 p-8 transition-all duration-300 hover:bg-dark-900 ${borderHover}`}
      >
        <div
          className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all ${iconHoverBg}`}
        >
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mb-4 text-2xl font-bold">{service.title}</h3>
        <p className="leading-relaxed text-dark-400">{service.description}</p>
      </div>
    </ScrollReveal>
  );
}
