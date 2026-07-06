import { useState, useEffect, useCallback } from "react";

const THEME_KEY = "folio-theme";

function getInitialTheme(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem(THEME_KEY);
  if (stored !== null) return stored === "dark";
  return true;
}

export function useTheme() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  return { dark, toggle };
}
