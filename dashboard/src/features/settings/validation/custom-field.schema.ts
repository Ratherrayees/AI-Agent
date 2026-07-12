import { z } from 'zod';

export const customFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  label: z.string().min(1, 'Field label is required'),
  targetEntity: z.enum(['leads', 'appointments', 'campaigns']).default('leads'),
  type: z.enum(['text', 'number', 'boolean', 'dropdown', 'date', 'url']).default('text'),
  options: z.array(z.string()).optional(), // for dropdowns
  required: z.boolean().default(false),
  active: z.boolean().default(true),
  order: z.number().default(0),
});

export type CustomFieldFormData = z.infer<typeof customFieldSchema>;
