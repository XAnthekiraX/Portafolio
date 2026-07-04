import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="rounded-md p-2 text-dark-400 transition-colors hover:bg-dark-800 hover:text-dark-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
