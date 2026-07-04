import { Github, Linkedin, Twitter, Dribbble } from "lucide-react";
import type { SocialLink } from "../types";

const iconMap: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  dribbble: Dribbble,
};

interface SocialLinksProps {
  links: SocialLink[];
  size?: number;
}

export function SocialLinks({ links, size = 24 }: SocialLinksProps) {
  return (
    <>
      {links.map((link) => {
        const Icon = iconMap[link.platform];
        if (!Icon) return null;
        return (
          <a
            key={link.platform}
            href={link.url}
            className="rounded-md text-dark-400 transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon style={{ width: size, height: size }} />
          </a>
        );
      })}
    </>
  );
}
