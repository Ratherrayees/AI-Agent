import { z } from 'zod';
import { ToolDefinition } from '../types.js';
import { ID } from 'node-appwrite';

const DATABASE_ID = 'stateai_crm';
const LEADS_COLLECTION = 'leads';

export const createLeadTool: ToolDefinition<any> = {
  name: 'create_lead',
  description: 'Creates a new lead in the CRM from an AI conversation.',
  schema: z.object({
    firstName: z.string().describe('The first name of the lead'),
    lastName: z.string().describe('The last name of the lead'),
    phone: z.string().describe('The phone number of the lead'),
    email: z.string().email().optional().describe('The email address of the lead'),
    company: z.string().optional().describe('The company the lead works for'),
    notes: z.string().optional().describe('Any summary or notes from the conversation'),
  }),
  execute: async (args, context) => {
    context.log(`Executing create_lead for ${args.firstName} ${args.lastName}`);
    
    const leadData = {
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone,
      email: args.email || '',
      company: args.company || '',
      description: args.notes || 'Created via AI Agent',
      leadStatus: 'new',
    };

    const lead = await context.databases.createDocument(
      DATABASE_ID,
      LEADS_COLLECTION,
      ID.unique(),
      leadData
    );

    context.log(`Successfully created lead ${lead.$id}`);
    
    return {
      leadId: lead.$id,
      status: 'success',
      message: `Lead ${args.firstName} ${args.lastName} created successfully.`,
    };
  }
};
