import { Client, Databases, Permission, Role } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = 'stateai_crm';

const COLLECTION_IDS = [
  'users',
  'leads',
  'appointments',
  'call_history',
  'conversations',
  'campaigns',
  'notes',
  'activities',
  'follow_ups',
  'notifications',
  'tags',
  'company_settings',
  'business_hours',
  'audit_logs',
  'files',
  'ai_agents',
];

async function updateAllPermissions() {
  console.log('Updating collection permissions to allow both unauthenticated (Role.any()) and authenticated (Role.users()) access for development/demo...');
  for (const cid of COLLECTION_IDS) {
    try {
      const col = await databases.getCollection(DATABASE_ID, cid);
      await databases.updateCollection(
        DATABASE_ID,
        cid,
        col.name,
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        col.documentSecurity
      );
      console.log(`Updated permissions for collection: ${col.name} (${cid})`);
    } catch (err: any) {
      console.error(`Failed to update ${cid}:`, err.message);
    }
  }
  console.log('All collection permissions updated successfully!');
}

updateAllPermissions();
