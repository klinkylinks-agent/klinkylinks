import { useQuery } from "@tanstack/react-query";
import { getDashboardStats, getRecentViolations, getInfringements } from "@/lib/api";

export function useDashboardStats(userId: number) {
  return useQuery({
    queryKey: ["/api/dashboard/stats", userId],
    queryFn: () => getDashboardStats(userId),
    enabled: !!userId,
  });
}

export function useRecentViolations(userId: number) {
  return useQuery({
    queryKey: ["/api/dashboard/recent-violations", userId],
    queryFn: () => getRecentViolations(userId),
    enabled: !!userId,
  });
}

export function useViolations(userId: number) {
  return useQuery({
    queryKey: ["/api/infringements", userId],
    queryFn: () => getInfringements(userId),
    enabled: !!userId,
  });
}

export function useContentItems(userId: number) {
  return useQuery({
    queryKey: ["/api/content", userId],
    queryFn: () => getInfringements(userId),
    enabled: !!userId,
  });
}
