/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noteService } from '../services/note.service';
import { NoteFormData } from '../validation/note.schema';
import { toast } from 'sonner';

export const NOTES_QUERY_KEY = 'notes';

export function useNotes(entityType: 'leadId' | 'conversationId' | 'appointmentId' | 'campaignId', entityId: string) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, entityType, entityId],
    queryFn: () => noteService.getNotesByEntity(entityType, entityId),
    enabled: !!entityId,
  });
}

export function useCreateNote(entityType: string, entityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NoteFormData) => noteService.createNote(data),
    onSuccess: () => {
      toast.success('Note added');
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, entityType, entityId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add note');
    },
  });
}

export function useDeleteNote(entityType: string, entityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noteService.deleteNote(id),
    onSuccess: () => {
      toast.success('Note deleted');
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY, entityType, entityId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete note');
    },
  });
}
