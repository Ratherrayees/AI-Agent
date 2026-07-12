/**
 * Global API response types
 */
import type { Models } from 'appwrite';

export type AppwriteDocument = Models.Document;

export interface PaginatedResponse<T> {
  documents: T[];
  total: number;
}

export interface ApiError {
  message: string;
  code: number;
  type?: string;
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
