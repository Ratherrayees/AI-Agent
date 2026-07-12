import { z } from 'zod';

export const integrationSchema = z.object({
  provider: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']).default('disconnected'),
  authStatus: z.string().optional(),
  lastSync: z.string().optional(),
  lastError: z.string().optional(),
});

export const webhookSchema = z.object({
  name: z.string().min(1, 'Webhook name is required'),
  url: z.string().url('Must be a valid URL'),
  direction: z.enum(['incoming', 'outgoing']).default('outgoing'),
  status: z.enum(['active', 'paused', 'error']).default('active'),
  events: z.array(z.string()).min(1, 'At least one event is required'),
  retryPolicyJson: z.string().default('{"maxAttempts": 3, "delay": 1000, "backoff": "exponential"}'),
});

export type WebhookFormData = z.infer<typeof webhookSchema>;

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  expiresAt: z.string().optional(),
});

export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
