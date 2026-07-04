import { useState, useEffect } from "react";
import { getEducation } from "../services/api";
import type { EducationItem } from "../types";

export function useEducation() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEducation()
      .then((res) => setEducation(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { education, loading };
}
