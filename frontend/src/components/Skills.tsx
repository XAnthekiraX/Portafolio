import { useSkills } from "../hooks/useSkills";
import { SkillCard } from "./SkillCard";
import { ScrollReveal } from "./ScrollReveal";

export function Skills() {
  const { skills } = useSkills();

  return (
    <section
      id="skills"
      className="border-y border-dark-800 bg-dark-900 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-sm text-primary">
              // 02. Habilidades
            </span>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Stack Tecnológico &amp; Expertise
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
