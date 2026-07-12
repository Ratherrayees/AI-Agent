import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationService } from '../services/integration.service';
import { WebhookFormData, ApiKeyFormData } from '../validation/integration.schema';
import { toast } from 'sonner';

export function useWebhooks() {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: () => integrationService.getWebhooks(),
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WebhookFormData) => integrationService.createWebhook(data),
    onSuccess: () => {
      toast.success('Webhook created successfully');
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });
}

export function useWebhookLogs(webhookId: string) {
  return useQuery({
    queryKey: ['webhook_logs', webhookId],
    queryFn: () => integrationService.getWebhookLogs(webhookId),
    enabled: !!webhookId,
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: ['api_keys'],
    queryFn: () => integrationService.getApiKeys(),
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ApiKeyFormData) => integrationService.createApiKey(data),
    onSuccess: () => {
      toast.success('API Key generated successfully');
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => integrationService.revokeApiKey(id),
    onSuccess: () => {
      toast.success('API Key revoked');
      queryClient.invalidateQueries({ queryKey: ['api_keys'] });
    },
  });
}

export function useSystemJobs() {
  return useQuery({
    queryKey: ['system_jobs'],
    queryFn: () => integrationService.getSystemJobs(),
    refetchInterval: 10000,
  });
}
