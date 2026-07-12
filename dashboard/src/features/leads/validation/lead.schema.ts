import { z } from 'zod';

export const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  leadSource: z.string().optional(),
  leadStatus: z.enum([
    'new',
    'contacted',
    'interested',
    'qualified',
    'appointment_scheduled',
    'proposal_sent',
    'won',
    'lost',
    'archived',
  ]),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignedUserId: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const updateLeadSchema = leadSchema.partial();
export type UpdateLeadFormData = z.infer<typeof updateLeadSchema>;
