import { useQuery } from "@tanstack/react-query";
import { getEducation } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useEducation() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.education,
    queryFn: ({ signal }) => getEducation(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { education: data ?? [], loading: isLoading };
}
