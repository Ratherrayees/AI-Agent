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
      description: 'Automatically triggers the ElevenLabs Outbound Sales Specialist (`outbound_sales`) to call and qualify new leads within 60 seconds.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'lead_created',
        conditions: [{ field: 'leadSource', operator: 'in', value: ['Website', 'Facebook/Instagram', 'Google Ads'] }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'trigger_webhook', config: { url: 'https://api.elevenlabs.io/v1/agent/call', agentRole: 'outbound_sales' } },
        { id: '2', type: 'update_lead', config: { leadStatus: 'contacted' } }
      ])
    },
    {
      name: '24-Hour Site Visit Reminder Call',
      description: 'Automatically dispatches the ElevenLabs Outbound Coordinator (`outbound_coordinator`) 24 hours before an appointment to confirm or reschedule.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'appointment_reminder_24h',
        conditions: [{ field: 'status', operator: 'equals', value: 'scheduled' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'trigger_webhook', config: { url: 'https://api.elevenlabs.io/v1/agent/call', agentRole: 'outbound_coordinator' } }
      ])
    },
    {
      name: 'Missed Appointment Recovery Call',
      description: 'Automatically triggers the Outbound Coordinator within 2 hours of a no-show to reschedule.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'appointment_missed',
        conditions: [{ field: 'status', operator: 'equals', value: 'no_show' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'trigger_webhook', config: { url: 'https://api.elevenlabs.io/v1/agent/call', agentRole: 'outbound_coordinator' } }
      ])
    },
    {
      name: 'Post-Showing Customer Satisfaction Survey (NPS)',
      description: 'Triggers the Customer Care Specialist (`outbound_support`) 2 hours after a completed site visit to collect NPS ratings.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'appointment_completed',
        conditions: [{ field: 'status', operator: 'equals', value: 'completed' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'trigger_webhook', config: { url: 'https://api.elevenlabs.io/v1/agent/call', agentRole: 'outbound_support' } }
      ])
    },
    {
      name: 'High-Priority Investor & Urgent Complaint Alert',
      description: 'Dispatches urgent SMS and email alerts to management whenever a lead priority escalates to High or a detractor NPS is logged.',
      status: 'active',
      triggerJson: JSON.stringify({
        type: 'lead_updated',
        conditions: [{ field: 'priority', operator: 'equals', value: 'high' }]
      }),
      actionsJson: JSON.stringify([
        { id: '1', type: 'send_email', config: { subject: 'URGENT: High Priority Lead / Complaint Alert', recipient: 'management@stateai.com' } },
        { id: '2', type: 'create_task', config: { title: 'Immediate Manager Callback Required', priority: 'high' } }
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
