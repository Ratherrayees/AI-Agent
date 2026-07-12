import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const STATS_QUERY_KEY = 'dashboard-stats';
export const CALL_VOLUME_QUERY_KEY = 'call-volume-chart';

export function useDashboardStats() {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => analyticsService.getDashboardStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

export function useCallVolumeData() {
  return useQuery({
    queryKey: [CALL_VOLUME_QUERY_KEY],
    queryFn: () => analyticsService.getCallVolumeData(),
    refetchInterval: 5 * 60 * 1000,
  });
}
