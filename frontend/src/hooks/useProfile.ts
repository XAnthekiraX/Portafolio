import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../services/api";
import { queryKeys } from "../lib/queryKeys";

export function useProfile() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: ({ signal }) => getProfile(signal).then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  return { profile: data ?? null, loading: isLoading };
}
