import { useTechnologies } from "../hooks/useTechnologies";
import { TechItem } from "./TechItem";
import { ScrollReveal } from "./ScrollReveal";

export function Technologies() {
  const { technologies } = useTechnologies();

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 03. Tecnologías
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Herramientas diarias
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {technologies.map((tech, index) => (
            <TechItem key={tech.id} tech={tech} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
