import { Mail, MapPin, Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

const socialIconMap: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
};

export function ContactInfo() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="space-y-8">
        <p className="text-lg leading-relaxed text-dark-400">
          ¿Tienes un proyecto en mente o necesitas mejorar tu producto actual?
          Rellena el formulario o contáctame directamente.
        </p>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-zinc-700/50 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-16 rounded bg-zinc-700/50 animate-pulse" />
                <div className="h-4 w-40 rounded bg-zinc-700/50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-8">
      <p className="text-lg leading-relaxed text-dark-400">
        ¿Tienes un proyecto en mente o necesitas mejorar tu producto actual?
        Rellena el formulario o contáctame directamente.
      </p>

      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dark-700 bg-dark-800">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-mono text-sm text-dark-400">Email</p>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-primary"
            >
              {profile.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dark-700 bg-dark-800">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-mono text-sm text-dark-400">Ubicación</p>
            <p>{profile.location} (Remoto)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dark-700 bg-dark-800">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-green-500" />
          </div>
          <div>
            <p className="font-mono text-sm text-dark-400">Estado</p>
            <p>Disponible para proyectos</p>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-800 pt-8">
        <p className="mb-4 text-sm text-dark-400">Sígueme</p>
        <div className="flex gap-4">
          {profile.socialLinks.slice(0, 3).map((link) => {
            const Icon = socialIconMap[link.platform];
            if (!Icon) return null;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-dark-700 bg-dark-800 text-dark-400 transition-colors hover:border-primary hover:text-primary"
              >
                <Icon style={{ width: 20, height: 20 }} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
