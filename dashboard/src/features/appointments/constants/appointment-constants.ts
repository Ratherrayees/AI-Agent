import { AppointmentStatus, MeetingType } from '@/types';

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
  rescheduled: 'Rescheduled',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  confirmed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  no_show: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  rescheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  phone_call: 'Phone Call',
  video_meeting: 'Video Meeting',
  in_person: 'In Person',
  google_meet: 'Google Meet',
  zoom: 'Zoom',
  custom: 'Custom',
};
