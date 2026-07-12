import { z } from 'zod';

export const knowledgeSourceSchema = z.object({
  name: z.string().min(1, 'Knowledge source name is required'),
  description: z.string().optional(),
  elevenLabsAgentId: z.string().min(1, 'ElevenLabs Agent ID is required'),
  documentType: z.enum(['pdf', 'url', 'text', 'doc', 'other']).default('text'),
  syncStatus: z.enum(['synced', 'pending', 'error']).default('pending'),
  version: z.string().default('v1.0'),
  notes: z.string().optional(),
});

export type KnowledgeSourceFormData = z.infer<typeof knowledgeSourceSchema>;
export const updateKnowledgeSourceSchema = knowledgeSourceSchema.partial();
