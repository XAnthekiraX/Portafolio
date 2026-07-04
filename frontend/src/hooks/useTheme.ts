import { useState, useEffect } from "react";

export function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  function toggle() {
    setDark((prev) => !prev);
  }

  return { dark, toggle };
}
