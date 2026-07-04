import { useState, useEffect } from "react";
import { getProjects } from "../services/api";
import type { Project } from "../types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { projects, loading };
}
