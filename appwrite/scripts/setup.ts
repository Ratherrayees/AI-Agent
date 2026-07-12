import { Client, Databases, Storage, ID, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env from the dashboard folder
dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DATABASE_ID = 'stateai_crm';

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error('Missing Appwrite environment variables. Please check dashboard/.env.local');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

// Utility to sleep (Appwrite sometimes needs a moment after creating collections/attributes)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createDatabase() {
  try {
    await databases.get(DATABASE_ID);
    console.log(`Database ${DATABASE_ID} already exists.`);
  } catch (error: any) {
    if (error.code === 404) {
      await databases.create(DATABASE_ID, 'StateAI CRM Database');
      console.log(`Created database: ${DATABASE_ID}`);
      await sleep(1000);
    } else {
      throw error;
    }
  }
}

async function createCollection(collectionId: string, name: string) {
  try {
    await databases.getCollection(DATABASE_ID, collectionId);
    console.log(`Collection ${name} (${collectionId}) already exists.`);
  } catch (error: any) {
    if (error.code === 404) {
      await databases.createCollection(DATABASE_ID, collectionId, name, [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]);
      console.log(`Created collection: ${name}`);
      await sleep(1000);
    } else {
      throw error;
    }
  }
}

async function createBucket(bucketId: string, name: string) {
  try {
    await storage.getBucket(bucketId);
    console.log(`Bucket ${name} (${bucketId}) already exists.`);
  } catch (error: any) {
    if (error.code === 404) {
      await storage.createBucket(
        bucketId,
        name,
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        false,
        true,
        undefined,
        []
      );
      console.log(`Created bucket: ${name}`);
      await sleep(1000);
    } else {
      throw error;
    }
  }
}

async function main() {
  console.log('Starting StateAI CRM Appwrite setup...');
  await createDatabase();

  const collections = [
    { id: 'users', name: 'Users' },
    { id: 'leads', name: 'Leads' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'campaigns', name: 'Campaigns' },
    { id: 'call_history', name: 'Call History' },
    { id: 'conversations', name: 'Conversations' },
    { id: 'notes', name: 'Notes' },
    { id: 'activities', name: 'Activities' },
    { id: 'follow_ups', name: 'Follow Ups' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'tags', name: 'Tags' },
    { id: 'company_settings', name: 'Company Settings' },
    { id: 'business_hours', name: 'Business Hours' },
    { id: 'audit_logs', name: 'Audit Logs' },
    { id: 'files', name: 'Files' },
    { id: 'ai_agents', name: 'AI Agents' },
  ];

  for (const coll of collections) {
    await createCollection(coll.id, coll.name);
  }
  
  const buckets = [
    { id: 'documents', name: 'Documents' },
    { id: 'images', name: 'Images' },
    { id: 'audio', name: 'Audio' },
    { id: 'recordings', name: 'Recordings' },
  ];
  
  for (const bucket of buckets) {
    await createBucket(bucket.id, bucket.name);
  }

  console.log('Base setup complete. Note: Run the attribute creation script next.');
}

main().catch(console.error);
