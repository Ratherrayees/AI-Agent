import { z } from 'zod';

export const appointmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  leadId: z.string().min(1, 'Lead is required'),
  assignedUserId: z.string().min(1, 'Assignee is required'),
  meetingType: z.enum([
    'phone_call',
    'video_meeting',
    'in_person',
    'google_meet',
    'zoom',
    'custom'
  ]),
  status: z.enum([
    'scheduled',
    'confirmed',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled'
  ]),
  date: z.string().min(1, 'Date is required'), // YYYY-MM-DD
  startTime: z.string().min(1, 'Start time is required'), // HH:mm
  endTime: z.string().min(1, 'End time is required'), // HH:mm
  timezone: z.string().min(1, 'Timezone is required'),
  location: z.string().optional(),
  meetingLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  createdById: z.string().optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export const updateAppointmentSchema = appointmentSchema.partial();
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>;
