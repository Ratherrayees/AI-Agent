import { Client, Databases, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

async function test() {
  try {
    console.log('Testing listDocuments with API key...');
    const res = await databases.listDocuments('stateai_crm', 'leads', [Query.orderDesc('$createdAt')]);
    console.log(`Successfully fetched ${res.total} leads with API key!`);
  } catch (err: any) {
    console.error('Error with API key:', err.message);
  }

  try {
    console.log('\nTesting listDocuments WITHOUT API key (as unauthenticated browser user Role.any())...');
    const anonClient = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
    const anonDb = new Databases(anonClient);
    const res = await anonDb.listDocuments('stateai_crm', 'leads', [Query.orderDesc('$createdAt')]);
    console.log(`Successfully fetched ${res.total} leads as anonymous user!`);
  } catch (err: any) {
    console.error('Error as anonymous/unauthenticated user:', err.message);
  }
}

test();
