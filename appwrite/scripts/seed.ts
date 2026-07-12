import { Client, Databases, ID } from 'node-appwrite';
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

const sampleLeads = [
  {
    firstName: 'Marcus',
    lastName: 'Vance',
    company: 'Apex Real Estate Holdings',
    jobTitle: 'Managing Partner',
    phone: '+1 (555) 234-5678',
    email: 'm.vance@apexholdings.com',
    leadStatus: 'qualified',
    priority: 'high',
    leadSource: 'AI Inbound Call',
    city: 'Austin',
    state: 'TX',
    appointmentsCount: 2,
    description: 'Looking to acquire 3 multi-family residential properties in downtown Austin within Q3.',
  },
  {
    firstName: 'Elena',
    lastName: 'Rostova',
    company: 'Skyline Capital Ventures',
    jobTitle: 'Director of Acquisitions',
    phone: '+1 (555) 876-5432',
    email: 'elena@skylinecapital.io',
    leadStatus: 'appointment_scheduled',
    priority: 'high',
    leadSource: 'Website Inquiry',
    city: 'Miami',
    state: 'FL',
    appointmentsCount: 1,
    description: 'Interested in luxury waterfront commercial leases for regional headquarters.',
  },
  {
    firstName: 'David',
    lastName: 'Chen',
    company: 'Sovereign Wealth & Co.',
    jobTitle: 'Senior Investment Analyst',
    phone: '+1 (555) 345-6789',
    email: 'dchen@sovereignwealth.com',
    leadStatus: 'contacted',
    priority: 'medium',
    leadSource: 'Referral',
    city: 'San Francisco',
    state: 'CA',
    appointmentsCount: 0,
    description: 'Exploring yield opportunities in Class-A suburban office parks.',
  },
  {
    firstName: 'Sarah',
    lastName: 'Jenkins',
    company: 'Blue Horizons Development',
    jobTitle: 'VP of Development',
    phone: '+1 (555) 456-7890',
    email: 'sarah.j@bluehorizons.net',
    leadStatus: 'proposal_sent',
    priority: 'high',
    leadSource: 'AI Outbound Campaign',
    city: 'Denver',
    state: 'CO',
    appointmentsCount: 3,
    description: 'Requested proposal for joint venture on 120-unit mixed-use project.',
  },
  {
    firstName: 'Liam',
    lastName: 'O\'Connor',
    company: 'O\'Connor Family Trust',
    jobTitle: 'Trustee',
    phone: '+1 (555) 567-8901',
    email: 'liam@oconnortrust.org',
    leadStatus: 'new',
    priority: 'low',
    leadSource: 'Cold Call',
    city: 'Boston',
    state: 'MA',
    appointmentsCount: 0,
    description: 'Initial consultation regarding 1031 tax-deferred property exchange.',
  }
];

async function seedLeads() {
  console.log('Seeding demo leads into Appwrite...');
  for (const lead of sampleLeads) {
    try {
      await databases.createDocument(DATABASE_ID, 'leads', ID.unique(), lead);
      console.log(`Created lead: ${lead.firstName} ${lead.lastName}`);
    } catch (error: any) {
      console.error(`Error creating lead ${lead.firstName} ${lead.lastName}:`, error.message);
    }
  }
  console.log('Demo leads seeding finished!');
}

seedLeads();
