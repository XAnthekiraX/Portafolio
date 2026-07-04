import { useState, useEffect } from "react";
import { getServices } from "../services/api";
import type { Service } from "../types";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { services, loading };
}
