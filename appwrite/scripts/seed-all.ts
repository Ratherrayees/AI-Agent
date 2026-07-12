import { Client, Databases, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = 'stateai_crm';

async function seedAll() {
  console.log('Fetching leads to link appointments and activities...');
  const leadsRes = await databases.listDocuments(DATABASE_ID, 'leads', [Query.limit(5)]);
  const leads = leadsRes.documents;

  if (leads.length === 0) {
    console.log('No leads found! Please run npm run seed first.');
    return;
  }

  const lead1 = leads[0];
  const lead2 = leads.length > 1 ? leads[1] : leads[0];

  // 1. Seed Appointments
  console.log('\nSeeding Appointments...');
  const appointments = [
    {
      title: 'Initial Property Acquisition Strategy Call',
      description: 'Review portfolio requirements and downtown Austin multi-family listings.',
      leadId: lead1.$id,
      assignedUserId: 'admin_user',
      meetingType: 'video_meeting',
      status: 'confirmed',
      date: '2026-07-15',
      startTime: '10:00',
      endTime: '11:00',
      timezone: 'America/Chicago',
      location: 'Zoom Meeting',
      meetingLink: 'https://zoom.us/j/demo123456',
      createdById: 'admin_user',
    },
    {
      title: 'Waterfront Commercial Lease Site Tour',
      description: 'In-person walk-through of the luxury Biscayne Bay office complex.',
      leadId: lead2.$id,
      assignedUserId: 'admin_user',
      meetingType: 'in_person',
      status: 'scheduled',
      date: '2026-07-18',
      startTime: '14:30',
      endTime: '16:00',
      timezone: 'America/New_York',
      location: '100 Biscayne Blvd, Miami, FL',
      meetingLink: '',
      createdById: 'admin_user',
    }
  ];

  for (const apt of appointments) {
    try {
      await databases.createDocument(DATABASE_ID, 'appointments', ID.unique(), apt);
      console.log(`Created appointment: ${apt.title}`);
    } catch (err: any) {
      console.error(`Error creating appointment ${apt.title}:`, err.message);
    }
  }

  // 2. Seed Campaigns
  console.log('\nSeeding Campaigns...');
  const campaigns = [
    {
      name: 'Q3 High-Yield Commercial Outbound Voice',
      description: 'AI Voice Agent calling pre-qualified commercial investors about new Class-A opportunities.',
      type: 'outbound_call',
      status: 'running',
      aiAgentId: 'agent_elevenlabs_realestate_1',
      assignedUserId: 'admin_user',
      timezone: 'America/New_York',
      priority: 'high',
      startDate: '2026-07-01',
      endDate: '2026-09-30',
      maxRetries: 3,
      retryDelay: 120,
      maxCallsPerLead: 5,
      createdById: 'admin_user',
    },
    {
      name: 'Multi-Family Seller Valuation Follow-up',
      description: 'Automated SMS & Email check-in for property owners requesting market analysis.',
      type: 'sms',
      status: 'scheduled',
      aiAgentId: 'agent_elevenlabs_realestate_2',
      assignedUserId: 'admin_user',
      timezone: 'America/Chicago',
      priority: 'medium',
      startDate: '2026-07-12',
      endDate: '2026-08-15',
      maxRetries: 2,
      retryDelay: 240,
      maxCallsPerLead: 3,
      createdById: 'admin_user',
    }
  ];

  for (const cmp of campaigns) {
    try {
      await databases.createDocument(DATABASE_ID, 'campaigns', ID.unique(), cmp);
      console.log(`Created campaign: ${cmp.name}`);
    } catch (err: any) {
      console.error(`Error creating campaign ${cmp.name}:`, err.message);
    }
  }

  // 3. Seed Notes
  console.log('\nSeeding Notes...');
  const notes = [
    {
      content: 'Marcus emphasized a firm budget ceiling of $18.5M for all 3 properties combined. Fast closing preferred.',
      leadId: lead1.$id,
      createdById: 'admin_user',
    },
    {
      content: 'Elena requested architectural floor plans and HVAC maintenance reports before our Friday walk-through.',
      leadId: lead2.$id,
      createdById: 'admin_user',
    }
  ];

  for (const nt of notes) {
    try {
      await databases.createDocument(DATABASE_ID, 'notes', ID.unique(), nt);
      console.log(`Created note for lead ID: ${nt.leadId}`);
    } catch (err: any) {
      console.error(`Error creating note:`, err.message);
    }
  }

  // 4. Seed Activities
  console.log('\nSeeding Activities...');
  const activities = [
    {
      type: 'call',
      title: 'Outbound AI Call Completed',
      description: 'AI Agent successfully qualified Marcus Vance and scheduled follow-up meeting.',
      leadId: lead1.$id,
      userId: 'admin_user',
    },
    {
      type: 'email',
      title: 'Brochure & Property Portfolio Sent',
      description: 'Sent custom PDF portfolio detailing waterfront executive properties.',
      leadId: lead2.$id,
      userId: 'admin_user',
    }
  ];

  for (const act of activities) {
    try {
      await databases.createDocument(DATABASE_ID, 'activities', ID.unique(), act);
      console.log(`Created activity: ${act.title}`);
    } catch (err: any) {
      console.error(`Error creating activity:`, err.message);
    }
  }

  console.log('\n✅ All demo data seeded cleanly!');
}

seedAll();
