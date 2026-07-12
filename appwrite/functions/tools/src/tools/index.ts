import { ToolDefinition } from '../types.js';
import { createLeadTool } from './create-lead.js';

// Central registry for all AI tools
export const toolsRegistry: Record<string, ToolDefinition<any>> = {
  [createLeadTool.name]: createLeadTool,
  // Future tools will be registered here (e.g. check_calendar, book_appointment)
};

export function getTool(name: string): ToolDefinition<any> | undefined {
  return toolsRegistry[name];
}
