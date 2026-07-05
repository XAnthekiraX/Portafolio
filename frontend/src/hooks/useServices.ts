import { useQuery } from "@tanstack/react-query";
import { getServices } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useServices() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.services,
    queryFn: () => getServices().then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { services: data ?? [], loading: isLoading };
}
