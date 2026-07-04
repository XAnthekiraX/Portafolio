import { useState, useEffect } from "react";
import { getTechnologies } from "../services/api";
import type { Technology } from "../types";

export function useTechnologies() {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTechnologies()
      .then((res) => setTechnologies(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { technologies, loading };
}
