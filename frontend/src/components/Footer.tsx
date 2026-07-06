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
              About
            </a>
            <a
              href="#projects"
              className="transition-colors hover:text-dark-100"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="transition-colors hover:text-dark-100"
            >
              Contact
            </a>
          </div>

          {profile && (
            <div className="flex gap-4">
              {profile.socialLinks.slice(0, 3).map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  className="text-dark-400 transition-colors hover:text-primary"
                >
                  <SocialLinks links={[link]} size={20} />
                </a>
              ))}
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
