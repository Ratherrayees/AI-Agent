import { z } from 'zod';

export const workflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  trigger: z.object({
    type: z.enum(['lead_created', 'lead_updated', 'appointment_booked', 'call_completed', 'manual']),
    conditions: z.array(z.object({
      field: z.string(),
      operator: z.enum(['equals', 'not_equals', 'contains', 'greater_than', 'less_than']),
      value: z.any()
    })).optional()
  }),
  actions: z.array(z.object({
    id: z.string(),
    type: z.enum(['send_email', 'update_lead', 'assign_user', 'trigger_webhook', 'create_task']),
    config: z.record(z.string(), z.any())
  }))
});

export type WorkflowFormData = z.infer<typeof workflowSchema>;
