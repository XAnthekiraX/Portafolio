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
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
    localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  return { dark, toggle };
}
