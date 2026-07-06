import { useQuery } from "@tanstack/react-query";
import { getProjects } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useProjects() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.projects,
    queryFn: ({ signal }) => getProjects(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { projects: data ?? [], loading: isLoading };
}
