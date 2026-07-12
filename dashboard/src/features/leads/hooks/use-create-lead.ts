import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { LeadFormData } from '../validation/lead.schema';
import { LEADS_QUERY_KEY } from './use-leads';
import { toast } from 'sonner';

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadFormData) => leadService.createLead(data),
    onSuccess: () => {
      toast.success('Lead created successfully');
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
}
