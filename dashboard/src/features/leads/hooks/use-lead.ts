import { useQuery } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';

export const LEAD_QUERY_KEY = 'lead';

export function useLead(id: string) {
  return useQuery({
    queryKey: [LEAD_QUERY_KEY, id],
    queryFn: () => leadService.getLead(id),
    enabled: !!id,
  });
}
