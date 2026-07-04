import { useState, useEffect } from "react";
import { getProfile } from "../services/api";
import type { Profile } from "../types";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
}
