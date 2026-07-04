import { useEducation } from "../hooks/useEducation";
import { TimelineItem } from "./TimelineItem";
import { ScrollReveal } from "./ScrollReveal";

export function Education() {
  const { education } = useEducation();

  return (
    <section id="education" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 05. Educación
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Trayectoria Académica
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-dark-800 md:left-1/2" />
          {education.map((item, index) => (
            <TimelineItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
