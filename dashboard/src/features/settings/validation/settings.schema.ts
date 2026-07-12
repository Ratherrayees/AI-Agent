import { z } from 'zod';

export const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  supportEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  supportPhone: z.string().optional(),
  address: z.string().optional(),
  timezone: z.string().min(1, 'Timezone is required'),
  elevenLabsAgentId: z.string().optional(),
});

export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;

export const businessHoursSchema = z.object({
  monday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  tuesday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  wednesday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  thursday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  friday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  saturday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
  sunday: z.object({ isOpen: z.boolean(), open: z.string(), close: z.string() }),
});

export type BusinessHoursFormData = z.infer<typeof businessHoursSchema>;
