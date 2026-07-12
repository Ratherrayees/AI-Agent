import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DATABASE_ID = 'stateai_crm';
const COLLECTION_ID = 'workflows';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function setupWorkflows() {
  console.log('Resetting and initializing Workflows collection cleanly...');
  try {
    await databases.deleteCollection(DATABASE_ID, COLLECTION_ID);
    console.log('Removed old workflows collection to reset attribute schema limits.');
    await sleep(1500);
  } catch (err: any) {
    if (err.code !== 404) {
      console.log('Note on clean delete:', err.message);
    }
  }

  try {
    await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'Workflows', [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
      Permission.read(Role.users()),
      Permission.create(Role.users()),
      Permission.update(Role.users()),
      Permission.delete(Role.users()),
    ]);
    console.log('Created fresh Workflows collection.');
    await sleep(1500);
  } catch (err: any) {
    console.error('Failed to create collection:', err.message);
    return;
  }

  // Attributes with optimized sizes suitable for Appwrite string capacity
  const attributes = [
    { key: 'name', type: 'string', size: 255 },
    { key: 'description', type: 'string', size: 1000 },
    { key: 'status', type: 'string', size: 50 },
    { key: 'triggerJson', type: 'string', size: 2500 },
    { key: 'actionsJson', type: 'string', size: 3000 },
  ];

  for (const attr of attributes) {
    try {
      await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.size, false);
      console.log(`+ Created attribute: workflows.${attr.key}`);
      await sleep(1000);
    } catch (e: any) {
      console.error(`Failed attribute ${attr.key}:`, e.message);
    }
  }

  console.log('Waiting for attribute processing...');
  await sleep(3500);

  // Seeding sample automated workflows
  console.log('\nSeeding sample automated workflows...');
  const sampleWorkflows = [
    {
      name: 'Instant AI Voice Qualification on New Lead',
      description: 'Automatically triggers the ElevenLabs AI Voice Agent to call and qualify new leads within 60 seconds.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'lead_created',
        conditions: [{ field: 'leadSource', operator: 'equals', value: 'Website' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'trigger_webhook', config: { url: 'https://api.elevenlabs.io/v1/agent/call', agentId: 'agent_elevenlabs_realestate_1' } },
        { id: '2', type: 'update_lead', config: { leadStatus: 'contacted' } }
      ])
    },
    {
      name: 'VIP Showing Confirmed - Welcome Email & Task',
      description: 'Sends a customized property brochure and schedules an internal preparation task when an appointment is booked.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'appointment_booked',
        conditions: []
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'send_email', config: { subject: 'Confirmed: Your Exclusive Property Showing', template: 'vip_showing' } },
        { id: '2', type: 'create_task', config: { title: 'Prepare physical brochure and site access keys', priority: 'high' } }
      ])
    },
    {
      name: 'High-Priority Investor Alert SMS',
      description: 'Dispatches an urgent SMS alert to the assigned real estate agent whenever a lead priority escalates to High.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'lead_updated',
        conditions: [{ field: 'priority', operator: 'equals', value: 'high' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'send_email', config: { subject: 'URGENT: High Priority Investor Activity', recipient: 'agent@stateai.com' } }
      ])
    }
  ];

  for (const wf of sampleWorkflows) {
    try {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), wf);
      console.log(`Created sample workflow: ${wf.name}`);
    } catch (e: any) {
      console.error(`Error creating workflow ${wf.name}:`, e.message);
    }
  }

  console.log('\n✅ Workflows setup and demo data seeded completely!');
}

setupWorkflows();
