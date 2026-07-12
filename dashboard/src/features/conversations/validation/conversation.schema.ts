import { z } from 'zod';

export const conversationSchema = z.object({
  leadId: z.string().min(1, 'Lead is required'),
  type: z.enum(['inbound_call', 'outbound_call', 'sms', 'email', 'chat']).default('inbound_call'),
  status: z.enum(['completed', 'missed', 'voicemail', 'failed', 'in_progress']).default('completed'),
  direction: z.enum(['inbound', 'outbound']).default('inbound'),
  durationSeconds: z.number().optional().default(0),
  transcript: z.string().optional(),
  recordingUrl: z.string().optional(),
  aiSummary: z.string().optional(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  agentId: z.string().optional(), // The AI agent ID if handled by AI
});

export type ConversationFormData = z.infer<typeof conversationSchema>;
