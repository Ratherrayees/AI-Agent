import { Models } from 'appwrite';

// Enums
export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'qualified'
  | 'appointment_scheduled'
  | 'proposal_sent'
  | 'won'
  | 'lost'
  | 'archived';

export type ConversationType =
  | 'voice_call'
  | 'chat'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'custom';

export type ConversationStatus =
  | 'open'
  | 'in_progress'
  | 'completed'
  | 'archived'
  | 'failed';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'rescheduled';

export type MeetingType =
  | 'phone_call'
  | 'video_meeting'
  | 'in_person'
  | 'google_meet'
  | 'zoom'
  | 'custom';

export type CallStatus =
  | 'queued'
  | 'ringing'
  | 'answered'
  | 'busy'
  | 'voicemail'
  | 'failed'
  | 'completed'
  | 'cancelled';

export type CallOutcome =
  | 'interested'
  | 'appointment_booked'
  | 'follow_up_needed'
  | 'not_interested'
  | 'wrong_number'
  | 'spam'
  | 'no_response'
  | 'existing_customer';

export type CampaignStatus =
  | 'draft'
  | 'scheduled'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'archived';

// Collections
export interface Lead extends Models.Document {
  firstName: string;
  lastName: string;
  company?: string;
  jobTitle?: string;
  phone: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  leadSource?: string;
  leadStatus: LeadStatus;
  status?: string;
  campaignId?: string;
  priority?: 'low' | 'medium' | 'high';
  assignedUserId?: string; // Appwrite User ID
  description?: string;
  tags?: string[]; // Array of tag IDs
  appointmentsCount?: number;
}

export interface Conversation extends Models.Document {
  leadId: string;
  type: ConversationType;
  status: ConversationStatus;
  direction?: 'inbound' | 'outbound';
  assignedUserId?: string;
  aiAgentId?: string;
  agentId?: string;
  campaignId?: string;
  phoneNumber?: string;
  callStatus?: string;
  callOutcome?: string;
  conversationId?: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  durationSeconds?: number;
  summary?: string;
  aiSummary?: string;
  sentiment?: string;
  outcome?: string;
  recordingUrl?: string;
  transcript?: string;
}

export interface Appointment extends Models.Document {
  title: string;
  description?: string;
  leadId: string;
  assignedUserId: string;
  meetingType: MeetingType;
  status: AppointmentStatus;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timezone: string;
  location?: string;
  meetingLink?: string;
  googleEventId?: string;
  createdById: string;
  deletedAt?: string; // For soft-delete
}

export interface Campaign extends Models.Document {
  name: string;
  description?: string;
  type: 'outbound_call' | 'sms' | 'email';
  status: CampaignStatus;
  aiAgentId: string;
  promptOverride?: string;
  assignedUserId?: string;
  timezone: string;
  businessHoursId?: string;
  priority: 'low' | 'medium' | 'high';
  startDate?: string;
  endDate?: string;
  maxRetries: number;
  retryDelay: number;
  maxCallsPerLead: number;
  createdById: string;
}

export interface CallHistory extends Models.Document {
  conversationId: string;
  direction: 'inbound' | 'outbound';
  phoneNumber: string;
  duration: number;
  recordingUrl?: string;
  transcriptUrl?: string;
  callStatus: CallStatus;
  callOutcome?: CallOutcome;
  summary?: string;
  appointmentId?: string;
  campaignId?: string;
  aiAgentId?: string;
  startedAt: string;
  endedAt?: string;
}

export interface ToolExecution extends Models.Document {
  conversationId: string;
  toolName: string;
  arguments: string; // JSON string
  response?: string; // JSON string
  executionTime?: number; // ms
  status: 'success' | 'error' | 'timeout';
  error?: string;
}

export interface Note extends Models.Document {
  content: string;
  leadId?: string;
  conversationId?: string;
  appointmentId?: string;
  campaignId?: string;
  createdById: string;
}

export interface Activity extends Models.Document {
  type: string;
  title: string;
  description?: string;
  leadId?: string;
  userId?: string;
  metadata?: string; // JSON string
}

export interface FileRecord extends Models.Document {
  name: string;
  bucketId: string;
  fileId: string;
  mimeType: string;
  size: number;
  leadId?: string;
  conversationId?: string;
  campaignId?: string;
  uploadedById: string;
}
