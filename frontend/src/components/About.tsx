import { ScrollReveal } from "./ScrollReveal";
import { Skeleton } from "./ui/Skeleton";
import { useProfile } from "../hooks/useProfile";

function AboutSkeleton() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-12 w-3/4" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/6" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  const { profile, loading } = useProfile();

  if (loading) return <AboutSkeleton />;
  if (!profile) return null;

  const paragraphs = profile.description
    .split(". ")
    .filter((p) => p.length > 0)
    .map((p) => (p.endsWith(".") ? p : p + "."));

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <ScrollReveal>
          <span className="mb-4 block font-mono text-sm text-primary">
            // 01. Sobre mí
          </span>
          <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl">
            Diseñando y construyendo el futuro digital.
          </h2>
          <div className="space-y-6 text-lg leading-relaxed text-dark-400">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
