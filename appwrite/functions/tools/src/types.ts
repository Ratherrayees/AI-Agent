import { z } from 'zod';
import { Databases } from 'node-appwrite';

export interface ToolContext {
  databases: Databases;
  req: any; // Appwrite request object
  res: any; // Appwrite response object
  log: (message: any) => void;
  error: (message: any) => void;
}

export interface ToolDefinition<T extends z.ZodTypeAny> {
  name: string;
  description: string;
  schema: T;
  execute: (args: z.infer<T>, context: ToolContext) => Promise<any>;
}

export interface ToolResponse {
  success: boolean;
  data?: any;
  error?: string;
  executionTimeMs?: number;
}
