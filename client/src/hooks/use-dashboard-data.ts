import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRecentSimilarityMatches, getSimilarityMatches } from "@/lib/api";

export function useDashboardStats(userId: number) {
  return useQuery({
    queryKey: ["/api/dashboard/stats", userId],
    queryFn: () => getDashboardStats(userId),
    enabled: !!userId,
  });
}

export function useRecentSimilarityMatches(userId: number) {
  return useQuery({
    queryKey: ["/api/dashboard/recent-similarity-matches", userId],
    queryFn: () => getRecentSimilarityMatches(userId),
    enabled: !!userId,
  });
}

export function useSimilarityMatches(userId: number) {
  return useQuery({
    queryKey: ["/api/similarity-matches", userId],
    queryFn: () => getSimilarityMatches(userId),
    enabled: !!userId,
  });
}

export function useContentItems(userId: number) {
  return useQuery({
    queryKey: ["/api/content", userId],
    queryFn: () => getSimilarityMatches(userId),
    enabled: !!userId,
  });
}
