import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { useProfile } from "../hooks/useProfile";

export function Footer() {
  const { profile } = useProfile();

  return (
    <footer className="border-t border-dark-800 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <Logo />

          <div className="flex gap-6 text-sm text-dark-400">
            <a href="#about" className="transition-colors hover:text-dark-100">
              Sobre mi
            </a>
            <a
              href="#projects"
              className="transition-colors hover:text-dark-100"
            >
              Proyectos
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-dark-100"
            >
              Contacto
            </a>
          </div>

          {profile && (
            <div className="flex gap-4">
              <SocialLinks links={profile.socialLinks.slice(0, 3)} size={20} />
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-dark-800 pt-8 text-center text-sm text-dark-400">
          <p>&copy; {new Date().getFullYear()} {profile?.name ?? "Portafolio"}. Diseñado y construido con precisión.</p>
        </div>
      </div>
    </footer>
  );
}
