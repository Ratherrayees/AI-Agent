import { useQuery } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { ListParams } from '@/types';

export const LEADS_QUERY_KEY = 'leads';

export function useLeads(params: ListParams) {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, params],
    queryFn: () => leadService.getLeads(params),
    // Keep previous data when fetching a new page to prevent UI flicker
    placeholderData: (previousData) => previousData,
  });
}
