import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityService } from '../services/activity.service';
import { ActivityFormData } from '../validation/activity.schema';

export const ACTIVITIES_QUERY_KEY = 'activities';

export function useActivities(leadId: string) {
  return useQuery({
    queryKey: [ACTIVITIES_QUERY_KEY, leadId],
    queryFn: () => activityService.getActivitiesByLead(leadId),
    enabled: !!leadId,
  });
}

// Activity logging is typically done silently in the background
export function useLogActivity(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityFormData) => activityService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ACTIVITIES_QUERY_KEY, leadId] });
    },
    // We intentionally don't show toast errors for silent activity logs
  });
}
