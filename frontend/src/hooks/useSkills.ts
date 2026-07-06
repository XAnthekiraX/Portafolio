import { useQuery } from "@tanstack/react-query";
import { getSkills } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useSkills() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.skills,
    queryFn: ({ signal }) => getSkills(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { skills: data ?? [], loading: isLoading };
}
