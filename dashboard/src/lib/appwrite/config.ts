/**
 * Appwrite Configuration Constants
 * Centralized IDs for database, collections, and storage buckets.
 */

export const APPWRITE_CONFIG = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'stateai-crm',
} as const;

export const DATABASE_ID = 'stateai_crm';

export const COLLECTION_IDS = {
  USERS: 'users',
  LEADS: 'leads',
  APPOINTMENTS: 'appointments',
  CALL_HISTORY: 'call_history',
  CONVERSATIONS: 'conversations',
  CAMPAIGNS: 'campaigns',
  NOTES: 'notes',
  ACTIVITIES: 'activities',
  FOLLOW_UPS: 'follow_ups',
  NOTIFICATIONS: 'notifications',
  TAGS: 'tags',
  COMPANY_SETTINGS: 'company_settings',
  BUSINESS_HOURS: 'business_hours',
  AUDIT_LOGS: 'audit_logs',
  FILES: 'files',
  AI_AGENTS: 'ai_agents',
  PROPERTIES: 'properties',
} as const;

export const BUCKET_IDS = {
  DOCUMENTS: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'crm_storage',
  IMAGES: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'crm_storage',
  AUDIO: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'crm_storage',
  RECORDINGS: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'crm_storage',
} as const;
