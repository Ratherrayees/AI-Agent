import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { UpdateLeadFormData } from '../validation/lead.schema';
import { LEADS_QUERY_KEY } from './use-leads';
import { LEAD_QUERY_KEY } from './use-lead';
import { toast } from 'sonner';

interface UpdateLeadParams {
  id: string;
  data: UpdateLeadFormData;
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateLeadParams) =>
      leadService.updateLead(id, data),
    onSuccess: (updatedLead) => {
      toast.success('Lead updated successfully');
      
      // Update specific lead cache
      queryClient.setQueryData(
        [LEAD_QUERY_KEY, updatedLead.$id],
        updatedLead
      );
      
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
}
