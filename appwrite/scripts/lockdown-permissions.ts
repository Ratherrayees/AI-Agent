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

/**
 * Production Security Lockdown Script
 * 
 * Removes all `Role.any()` unauthenticated permissions across all 16 CRM collections.
 * Restricts read/create/update/delete strictly to authenticated users (`Role.users()`).
 * Note: Server-side API endpoints (`appwrite-server.ts` & ElevenLabs webhooks) bypass collection
 * permissions via `APPWRITE_API_KEY`, so AI tools and automated jobs will continue to work normally.
 */
async function lockdownAllPermissions() {
  console.log('🛡️ Starting production security lockdown across all Appwrite collections...');
  console.log('🚫 Removing Role.any() (unauthenticated public access)...');
  console.log('🔒 Restricting access strictly to Role.users() (authenticated accounts)...');

  let successCount = 0;
  let failCount = 0;

  for (const cid of COLLECTION_IDS) {
    try {
      const col = await databases.getCollection(DATABASE_ID, cid);
      
      await databases.updateCollection(
        DATABASE_ID,
        cid,
        col.name,
        [
          Permission.read(Role.users()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ],
        col.documentSecurity
      );
      console.log(`✅ Locked down collection: ${col.name} (${cid}) -> [Role.users() ONLY]`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ Failed to lock down collection ${cid}:`, err.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Lockdown Complete: ${successCount} collections secured (${failCount} errors).`);
}

lockdownAllPermissions().catch((err) => {
  console.error('Fatal error during lockdown:', err);
  process.exit(1);
});
