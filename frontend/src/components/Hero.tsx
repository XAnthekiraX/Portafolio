import { Download, Mail, MapPin, Briefcase } from "lucide-react";
import { useProfile } from "../hooks/useProfile";
import { StatusBadge } from "./StatusBadge";
import { AvatarFrame } from "./AvatarFrame";
import { ScrollIndicator } from "./ScrollIndicator";
import { ScrollReveal } from "./ScrollReveal";
import { SocialLinks } from "./SocialLinks";

export function Hero() {
  const { profile } = useProfile();

  if (!profile) return null;

  return (
    <header className="relative grid-bg flex min-h-screen items-center overflow-hidden pt-24 pb-12">
      <div className="absolute -left-20 top-1/4 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-1/4 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />

      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <ScrollReveal>
              <StatusBadge />

              <h1 className="mb-4 mt-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                {profile.name}
              </h1>
              <h2 className="mb-6 text-2xl font-medium text-dark-400 md:text-3xl">
                Senior Product Engineer <span className="text-primary">&</span>{" "}
                UI/UX Designer
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-dark-400 lg:mx-0">
                {profile.description}
              </p>

              <div className="mb-8 flex items-center justify-center gap-4 font-mono text-sm text-dark-400 lg:justify-start">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent" />
                  {profile.location}
                </div>
                <div className="h-1 w-1 rounded-full bg-dark-700" />
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-accent" />
                  {profile.experienceYears}+ años experiencia
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <a
                  href="#"
                  className="glow-red inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 sm:w-auto"
                >
                  <Download className="h-4 w-4" />
                  Descargar CV
                </a>
                <a
                  href="#contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-dark-700 px-6 py-3 font-medium text-dark-100 transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 sm:w-auto"
                >
                  <Mail className="h-4 w-4" />
                  Contactar
                </a>
              </div>

              <div className="mt-10 flex items-center justify-center gap-6 lg:justify-start">
                <SocialLinks links={profile.socialLinks} size={24} />
              </div>
            </ScrollReveal>
          </div>

          <div className="flex-shrink-0">
            <ScrollReveal>
              <AvatarFrame avatarUrl={profile.avatarUrl} name={profile.name} />
            </ScrollReveal>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </header>
  );
}
