import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DATABASE_ID = 'stateai_crm';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createAttr(
  collectionId: string,
  key: string,
  type: 'string' | 'integer' | 'double' | 'boolean' | 'datetime' | 'enum' | 'email' | 'url',
  size: number = 255,
  required: boolean = false,
  array: boolean = false
) {
  try {
    switch (type) {
      case 'string':
        await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, undefined, array);
        break;
      case 'integer':
        await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, 0, 9999999999, undefined, array);
        break;
      case 'double':
        await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, 0, 9999999999, undefined, array);
        break;
      case 'boolean':
        await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, undefined, array);
        break;
      case 'datetime':
        await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, undefined, array);
        break;
    }
    console.log(`+ Created attribute [${type}]: ${collectionId}.${key}`);
    await sleep(800);
  } catch (error: any) {
    if (error.code === 409) {
      // Attribute already exists
    } else {
      console.error(`Failed to create ${collectionId}.${key}:`, error.message);
    }
  }
}

async function main() {
  console.log('Setup ALL attributes for all CRM collections starting...');

  // 1. Appointments
  console.log('\n--- Appointments ---');
  await createAttr('appointments', 'title', 'string', 255, false);
  await createAttr('appointments', 'description', 'string', 5000, false);
  await createAttr('appointments', 'leadId', 'string', 36, false);
  await createAttr('appointments', 'assignedUserId', 'string', 36, false);
  await createAttr('appointments', 'meetingType', 'string', 100, false);
  await createAttr('appointments', 'status', 'string', 100, false);
  await createAttr('appointments', 'date', 'string', 50, false);
  await createAttr('appointments', 'startTime', 'string', 50, false);
  await createAttr('appointments', 'endTime', 'string', 50, false);
  await createAttr('appointments', 'timezone', 'string', 100, false);
  await createAttr('appointments', 'location', 'string', 255, false);
  await createAttr('appointments', 'meetingLink', 'string', 500, false);
  await createAttr('appointments', 'googleEventId', 'string', 100, false);
  await createAttr('appointments', 'createdById', 'string', 36, false);
  await createAttr('appointments', 'deletedAt', 'string', 50, false);

  // 2. Conversations
  console.log('\n--- Conversations ---');
  await createAttr('conversations', 'leadId', 'string', 36, false);
  await createAttr('conversations', 'type', 'string', 100, false);
  await createAttr('conversations', 'status', 'string', 100, false);
  await createAttr('conversations', 'direction', 'string', 50, false);
  await createAttr('conversations', 'assignedUserId', 'string', 36, false);
  await createAttr('conversations', 'aiAgentId', 'string', 36, false);
  await createAttr('conversations', 'agentId', 'string', 36, false);
  await createAttr('conversations', 'startedAt', 'string', 100, false);
  await createAttr('conversations', 'endedAt', 'string', 100, false);
  await createAttr('conversations', 'duration', 'integer', 0, false);
  await createAttr('conversations', 'durationSeconds', 'integer', 0, false);
  await createAttr('conversations', 'summary', 'string', 5000, false);
  await createAttr('conversations', 'aiSummary', 'string', 5000, false);
  await createAttr('conversations', 'sentiment', 'string', 100, false);
  await createAttr('conversations', 'outcome', 'string', 255, false);
  await createAttr('conversations', 'recordingUrl', 'string', 1000, false);
  await createAttr('conversations', 'transcript', 'string', 10000, false);

  // 3. Campaigns
  console.log('\n--- Campaigns ---');
  await createAttr('campaigns', 'name', 'string', 255, false);
  await createAttr('campaigns', 'description', 'string', 5000, false);
  await createAttr('campaigns', 'type', 'string', 100, false);
  await createAttr('campaigns', 'status', 'string', 100, false);
  await createAttr('campaigns', 'aiAgentId', 'string', 36, false);
  await createAttr('campaigns', 'assignedUserId', 'string', 36, false);
  await createAttr('campaigns', 'timezone', 'string', 100, false);
  await createAttr('campaigns', 'businessHoursId', 'string', 36, false);
  await createAttr('campaigns', 'priority', 'string', 50, false);
  await createAttr('campaigns', 'startDate', 'string', 100, false);
  await createAttr('campaigns', 'endDate', 'string', 100, false);
  await createAttr('campaigns', 'maxRetries', 'integer', 0, false);
  await createAttr('campaigns', 'retryDelay', 'integer', 0, false);
  await createAttr('campaigns', 'maxCallsPerLead', 'integer', 0, false);
  await createAttr('campaigns', 'createdById', 'string', 36, false);

  // 4. Call History
  console.log('\n--- Call History ---');
  await createAttr('call_history', 'conversationId', 'string', 36, false);
  await createAttr('call_history', 'direction', 'string', 50, false);
  await createAttr('call_history', 'phoneNumber', 'string', 50, false);
  await createAttr('call_history', 'duration', 'integer', 0, false);
  await createAttr('call_history', 'recordingUrl', 'string', 1000, false);
  await createAttr('call_history', 'transcriptUrl', 'string', 1000, false);
  await createAttr('call_history', 'callStatus', 'string', 100, false);
  await createAttr('call_history', 'callOutcome', 'string', 100, false);
  await createAttr('call_history', 'summary', 'string', 5000, false);
  await createAttr('call_history', 'appointmentId', 'string', 36, false);
  await createAttr('call_history', 'campaignId', 'string', 36, false);
  await createAttr('call_history', 'aiAgentId', 'string', 36, false);
  await createAttr('call_history', 'startedAt', 'string', 100, false);
  await createAttr('call_history', 'endedAt', 'string', 100, false);

  // 5. Notes
  console.log('\n--- Notes ---');
  await createAttr('notes', 'content', 'string', 5000, false);
  await createAttr('notes', 'leadId', 'string', 36, false);
  await createAttr('notes', 'conversationId', 'string', 36, false);
  await createAttr('notes', 'appointmentId', 'string', 36, false);
  await createAttr('notes', 'campaignId', 'string', 36, false);
  await createAttr('notes', 'createdById', 'string', 36, false);

  // 6. Activities
  console.log('\n--- Activities ---');
  await createAttr('activities', 'type', 'string', 100, false);
  await createAttr('activities', 'title', 'string', 255, false);
  await createAttr('activities', 'description', 'string', 5000, false);
  await createAttr('activities', 'leadId', 'string', 36, false);
  await createAttr('activities', 'userId', 'string', 36, false);
  await createAttr('activities', 'metadata', 'string', 5000, false);

  // 7. Files
  console.log('\n--- Files ---');
  await createAttr('files', 'name', 'string', 255, false);
  await createAttr('files', 'bucketId', 'string', 100, false);
  await createAttr('files', 'fileId', 'string', 100, false);
  await createAttr('files', 'mimeType', 'string', 100, false);
  await createAttr('files', 'size', 'integer', 0, false);
  await createAttr('files', 'leadId', 'string', 36, false);
  await createAttr('files', 'conversationId', 'string', 36, false);
  await createAttr('files', 'campaignId', 'string', 36, false);
  await createAttr('files', 'uploadedById', 'string', 36, false);

  // 8. AI Agents
  console.log('\n--- AI Agents ---');
  await createAttr('ai_agents', 'name', 'string', 255, false);
  await createAttr('ai_agents', 'description', 'string', 5000, false);
  await createAttr('ai_agents', 'voiceId', 'string', 100, false);
  await createAttr('ai_agents', 'prompt', 'string', 10000, false);
  await createAttr('ai_agents', 'status', 'string', 50, false);
  await createAttr('ai_agents', 'language', 'string', 50, false);

  // 9. Tags
  console.log('\n--- Tags ---');
  await createAttr('tags', 'name', 'string', 100, false);
  await createAttr('tags', 'color', 'string', 50, false);
  await createAttr('tags', 'description', 'string', 500, false);

  // 10. Company Settings
  console.log('\n--- Company Settings ---');
  await createAttr('company_settings', 'companyName', 'string', 255, false);
  await createAttr('company_settings', 'website', 'string', 255, false);
  await createAttr('company_settings', 'phone', 'string', 50, false);
  await createAttr('company_settings', 'email', 'string', 255, false);
  await createAttr('company_settings', 'address', 'string', 500, false);
  await createAttr('company_settings', 'defaultTimezone', 'string', 100, false);
  await createAttr('company_settings', 'currency', 'string', 20, false);

  // 11. Business Hours
  console.log('\n--- Business Hours ---');
  await createAttr('business_hours', 'dayOfWeek', 'integer', 0, false);
  await createAttr('business_hours', 'openTime', 'string', 20, false);
  await createAttr('business_hours', 'closeTime', 'string', 20, false);
  await createAttr('business_hours', 'isClosed', 'boolean', 0, false);
  await createAttr('business_hours', 'timezone', 'string', 100, false);

  // 12. Audit Logs
  console.log('\n--- Audit Logs ---');
  await createAttr('audit_logs', 'action', 'string', 255, false);
  await createAttr('audit_logs', 'entityType', 'string', 100, false);
  await createAttr('audit_logs', 'entityId', 'string', 36, false);
  await createAttr('audit_logs', 'userId', 'string', 36, false);
  await createAttr('audit_logs', 'details', 'string', 5000, false);
  await createAttr('audit_logs', 'timestamp', 'string', 100, false);

  console.log('\n✅ ALL collection attributes created/verified!');
}

main();
