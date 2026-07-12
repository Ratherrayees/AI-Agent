import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationService } from '../services/conversation.service';
import { ConversationFormData } from '../validation/conversation.schema';
import { ListParams } from '@/types';
import { toast } from 'sonner';

export const CONVERSATIONS_QUERY_KEY = 'conversations';
export const CONVERSATION_QUERY_KEY = 'conversation';

export function useConversations(params: ListParams) {
  return useQuery({
    queryKey: [CONVERSATIONS_QUERY_KEY, params],
    queryFn: () => conversationService.getConversations(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useLeadConversations(leadId: string) {
  return useQuery({
    queryKey: [CONVERSATIONS_QUERY_KEY, 'lead', leadId],
    queryFn: () => conversationService.getConversationsByLead(leadId),
    enabled: !!leadId,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: [CONVERSATION_QUERY_KEY, id],
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => conversationService.deleteConversation(id),
    onSuccess: () => {
      toast.success('Conversation record deleted');
      queryClient.invalidateQueries({ queryKey: [CONVERSATIONS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete conversation');
    },
  });
}
