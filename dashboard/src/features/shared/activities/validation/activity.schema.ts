import { z } from 'zod';

export const activitySchema = z.object({
  type: z.enum([
    'lead_created',
    'lead_updated',
    'note_added',
    'call_logged',
    'email_sent',
    'appointment_scheduled',
    'status_changed',
    'custom'
  ]),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  leadId: z.string().optional(),
  userId: z.string().optional(),
  metadata: z.string().optional(), // JSON string for extra data
});

export type ActivityFormData = z.infer<typeof activitySchema>;
