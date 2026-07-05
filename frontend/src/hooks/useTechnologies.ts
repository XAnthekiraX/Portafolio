import { useQuery } from "@tanstack/react-query";
import { getTechnologies } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useTechnologies() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.technologies,
    queryFn: () => getTechnologies().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { technologies: data ?? [], loading: isLoading };
}
