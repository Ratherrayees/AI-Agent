import { Databases } from 'node-appwrite';

export interface WorkflowContext {
  databases: Databases;
  req: any;
  res: any;
  log: (msg: string) => void;
  error: (msg: string) => void;
}

export type ActionHandler = (payload: any, context: WorkflowContext) => Promise<any>;
