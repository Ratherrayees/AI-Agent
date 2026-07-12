import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeService } from '../services/knowledge.service';
import { KnowledgeSourceFormData } from '../validation/knowledge.schema';
import { toast } from 'sonner';

export function useKnowledgeSources() {
  return useQuery({
    queryKey: ['knowledge_sources'],
    queryFn: () => knowledgeService.getKnowledgeSources(),
  });
}

export function useCreateKnowledgeSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: KnowledgeSourceFormData) => knowledgeService.createKnowledgeSource(data),
    onSuccess: () => {
      toast.success('Knowledge source added');
      queryClient.invalidateQueries({ queryKey: ['knowledge_sources'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add knowledge source');
    },
  });
}

export function useDeleteKnowledgeSource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => knowledgeService.deleteKnowledgeSource(id),
    onSuccess: () => {
      toast.success('Knowledge source removed from catalog');
      queryClient.invalidateQueries({ queryKey: ['knowledge_sources'] });
    },
  });
}
