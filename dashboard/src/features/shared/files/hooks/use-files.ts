/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../services/file.service';
import { toast } from 'sonner';

export const FILES_QUERY_KEY = 'files';

export function useFiles(entityType: 'leadId' | 'conversationId' | 'campaignId', entityId: string) {
  return useQuery({
    queryKey: [FILES_QUERY_KEY, entityType, entityId],
    queryFn: () => fileService.getFilesByEntity(entityType, entityId),
    enabled: !!entityId,
  });
}

export function useUploadFile(entityType: string, entityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, uploaderId }: { file: File; uploaderId: string }) => 
      fileService.uploadFile(file, entityType, entityId, uploaderId),
    onSuccess: () => {
      toast.success('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY, entityType, entityId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    },
  });
}

export function useDeleteFile(entityType: string, entityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, bucketId, fileId }: { id: string; bucketId: string; fileId: string }) => 
      fileService.deleteFile(id, bucketId, fileId),
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: [FILES_QUERY_KEY, entityType, entityId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete file');
    },
  });
}
