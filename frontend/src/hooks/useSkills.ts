import { useState, useEffect } from "react";
import { getSkills } from "../services/api";
import type { SkillCategory } from "../types";

export function useSkills() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSkills()
      .then((res) => setSkills(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { skills, loading };
}
