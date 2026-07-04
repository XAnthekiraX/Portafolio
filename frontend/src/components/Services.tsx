import { useServices } from "../hooks/useServices";
import { ServiceCard } from "./ServiceCard";
import { ScrollReveal } from "./ScrollReveal";

export function Services() {
  const { services } = useServices();

  return (
    <section
      id="services"
      className="border-y border-dark-800 bg-dark-900 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 06. Servicios
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Qué puedo hacer por ti
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
