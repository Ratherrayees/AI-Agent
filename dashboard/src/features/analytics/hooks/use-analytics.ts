import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const STATS_QUERY_KEY = 'dashboard-stats';
export const CALL_VOLUME_QUERY_KEY = 'call-volume-chart';

export function useDashboardStats() {
  return useQuery({
    queryKey: [STATS_QUERY_KEY],
    queryFn: () => analyticsService.getDashboardStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    placeholderData: {
      totalLeads: 124,
      leadsThisMonth: 38,
      totalAppointments: 19,
      totalConversations: 86,
      callsThisWeek: 24,
      activeCampaigns: 3,
    },
  });
}

export function useCallVolumeData() {
  return useQuery({
    queryKey: [CALL_VOLUME_QUERY_KEY],
    queryFn: () => analyticsService.getCallVolumeData(),
    refetchInterval: 5 * 60 * 1000,
    placeholderData: [
      { name: 'Mon', inbound: 12, outbound: 28 },
      { name: 'Tue', inbound: 18, outbound: 35 },
      { name: 'Wed', inbound: 15, outbound: 42 },
      { name: 'Thu', inbound: 22, outbound: 30 },
      { name: 'Fri', inbound: 19, outbound: 38 },
      { name: 'Sat', inbound: 8, outbound: 15 },
      { name: 'Sun', inbound: 6, outbound: 12 },
    ],
  });
}
