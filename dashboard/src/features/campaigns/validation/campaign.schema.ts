import { z } from 'zod';

export const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().optional(),
  status: z.enum(['draft', 'running', 'active', 'paused', 'completed', 'scheduled', 'cancelled', 'archived']),
  type: z.enum(['outbound_call', 'sms', 'email']),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0).optional(),
  aiAgentId: z.string().optional().describe('The ElevenLabs Voice Agent ID assigned to this campaign'),
  promptOverride: z.string().optional().describe('Optional custom prompt instructions for this specific campaign'),
  maxRetries: z.number().optional(),
  retryDelay: z.number().optional(),
  maxCallsPerLead: z.number().optional(),
});

export type CampaignFormData = z.infer<typeof campaignSchema>;
export const updateCampaignSchema = campaignSchema.partial();
export type UpdateCampaignFormData = z.infer<typeof updateCampaignSchema>;
