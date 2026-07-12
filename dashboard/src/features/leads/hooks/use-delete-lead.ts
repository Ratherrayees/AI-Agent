import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../services/lead.service';
import { LEADS_QUERY_KEY } from './use-leads';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function useDeleteLead() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (id: string) => leadService.deleteLead(id),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete lead');
    },
  });

  return {
    ...mutation,
    deleteLead: mutation.mutate,
    deleteLeadAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}
