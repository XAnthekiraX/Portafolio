import { useRef, useEffect, useState, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const current = ref.current;
      if (!current) return;
      const rect = current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 100) {
        setVisible(true);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
      style={{ transitionDuration: "0.8s", transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
