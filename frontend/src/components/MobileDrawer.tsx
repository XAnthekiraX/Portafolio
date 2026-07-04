import { X } from "lucide-react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#services", label: "Services" },
];

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  return (
    <div
      className={`${
        open ? "translate-x-0" : "translate-x-full"
      } fixed inset-y-0 right-0 z-40 w-full border-l border-dark-700 bg-dark-900 backdrop-blur-lg transition-transform duration-300 md:hidden`}
    >
      <div className="flex h-16 items-center justify-end px-6">
        <button
          onClick={onClose}
          className="rounded-md p-2 text-dark-100 transition-colors hover:bg-dark-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-6 text-lg">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="border-b border-dark-800 py-2 transition-colors hover:text-primary"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={onClose}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          Contactar
        </a>
      </div>
    </div>
  );
}
