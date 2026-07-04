import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileDrawer } from "./MobileDrawer";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#services", label: "Services" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        } border-dark-800 bg-dark-950 backdrop-blur-lg`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />

            <div className="hidden items-center gap-8 text-sm font-medium text-dark-400 md:flex">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md transition-colors hover:text-dark-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <LanguageSwitcher />
              <ThemeToggle />

              <a
                href="#contact"
                className="hidden items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 md:inline-flex"
              >
                Contactar
              </a>

              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-2 text-dark-100 transition-colors hover:bg-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
