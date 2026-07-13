/**
 * Application-wide constants
 */

export const APP_NAME = "Ru'a by StateAI";
export const APP_DESCRIPTION =
  "Autonomous AI Voice & Text Assistant that talks and sounds like a human, paired with an intelligent CRM dashboard by StateAI.";
export const APP_VERSION = '1.0.0';

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5 MB
  DOCUMENT: 10 * 1024 * 1024, // 10 MB
  AUDIO: 50 * 1024 * 1024, // 50 MB
  RECORDING: 100 * 1024 * 1024, // 100 MB
} as const;

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'text/plain',
];
