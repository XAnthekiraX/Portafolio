import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "ES", label: "ES" },
  { code: "EN", label: "EN" },
  { code: "PT", label: "PT" },
];

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("ES");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-sm text-dark-400 transition-colors hover:text-dark-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950"
      >
        <span>{current}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-24 rounded-lg border border-dark-700 bg-dark-900 py-1 shadow-xl backdrop-blur-lg">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => {
                setCurrent(lang.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left font-mono text-sm transition-colors ${
                lang.code === current
                  ? "bg-primary/10 text-dark-100"
                  : "text-dark-400 hover:bg-dark-800"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
