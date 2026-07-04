import type { EducationItem } from "../types";
import { ScrollReveal } from "./ScrollReveal";

interface TimelineItemProps {
  item: EducationItem;
  index: number;
}

export function TimelineItem({ item, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;
  const dotColor = isLeft ? "bg-primary" : "bg-accent";
  const borderHover = isLeft ? "hover:border-primary/50" : "hover:border-accent/50";

  return (
    <ScrollReveal>
      <div className="relative mb-12">
        <div
          className={`absolute left-4 mt-2 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-dark-950 md:left-1/2 ${dotColor}`}
        />
        <div className={`pl-12 md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}>
          <div
            className={`rounded-xl border border-dark-800 bg-dark-900 p-6 transition-colors ${borderHover}`}
          >
            <span className="font-mono text-xs text-accent">
              {item.startDate} - {item.endDate}
            </span>
            <h3 className="mt-1 text-xl font-bold">{item.degree}</h3>
            <p className="mt-2 text-sm text-dark-400">{item.institution}</p>
            <p className="mt-2 text-sm text-dark-400">{item.description}</p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
