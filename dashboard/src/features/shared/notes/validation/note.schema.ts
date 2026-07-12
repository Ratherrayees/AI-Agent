import { z } from 'zod';

export const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(5000, 'Note is too long'),
  leadId: z.string().optional(),
  conversationId: z.string().optional(),
  appointmentId: z.string().optional(),
  campaignId: z.string().optional(),
  createdById: z.string().min(1, 'Creator ID is required'),
});

export type NoteFormData = z.infer<typeof noteSchema>;
