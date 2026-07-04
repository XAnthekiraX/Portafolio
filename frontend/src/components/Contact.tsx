import { ContactInfo } from "./ContactInfo";
import { ContactForm } from "./ContactForm";
import { ScrollReveal } from "./ScrollReveal";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 07. Contacto
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Trabajemos juntos
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <ContactInfo />
          </ScrollReveal>

          <ScrollReveal>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
