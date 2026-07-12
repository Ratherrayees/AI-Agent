import { Client, Databases, Users, Permission, Role, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;
const DATABASE_ID = 'stateai_crm';
const COLLECTION_ID = 'users';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const appwriteUsers = new Users(client);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function setupUsersAndTeam() {
  console.log('Setting up Users collection schema and creating Auth accounts...');

  // 1. Ensure collection exists with full open permissions for demo/dev
  try {
    await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log('Users collection already exists.');
  } catch (err: any) {
    if (err.code === 404) {
      await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'Users', [
        Permission.read(Role.any()),
        Permission.create(Role.any()),
        Permission.update(Role.any()),
        Permission.delete(Role.any()),
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]);
      console.log('Created Users collection.');
      await sleep(1000);
    } else {
      throw err;
    }
  }

  // 2. Create attributes
  const attributes = [
    { key: 'userId', type: 'string', size: 100 },
    { key: 'name', type: 'string', size: 255 },
    { key: 'email', type: 'string', size: 255 },
    { key: 'role', type: 'string', size: 100 },
    { key: 'status', type: 'string', size: 50 },
    { key: 'lastActive', type: 'string', size: 100 },
    { key: 'leadsCount', type: 'integer' },
  ];

  for (const attr of attributes) {
    try {
      if (attr.type === 'string') {
        await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.size!, false);
      } else if (attr.type === 'integer') {
        await databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, attr.key, false, 0, 999999);
      }
      console.log(`+ Created attribute: users.${attr.key}`);
      await sleep(800);
    } catch (e: any) {
      if (e.code !== 409) {
        console.error(`Failed attribute ${attr.key}:`, e.message);
      }
    }
  }

  console.log('Waiting for attribute processing...');
  await sleep(2500);

  // 3. Create sample team members in Appwrite Auth + Users collection
  const teamList = [
    {
      email: 'admin@stateai.com',
      password: 'adminPassword123!',
      name: 'StateAI Admin (You)',
      role: 'admin',
      status: 'active',
      lastActive: 'Online now',
      leadsCount: 18,
    },
    {
      email: 'sarah.j@stateai.com',
      password: 'agentPassword123!',
      name: 'Sarah Jenkins',
      role: 'agent',
      status: 'active',
      lastActive: '12m ago',
      leadsCount: 24,
    },
    {
      email: 'david.c@stateai.com',
      password: 'managerPassword123!',
      name: 'David Chen',
      role: 'manager',
      status: 'active',
      lastActive: '2h ago',
      leadsCount: 8,
    },
    {
      email: 'elena.r@stateai.com',
      password: 'agentPassword123!',
      name: 'Elena Rostova',
      role: 'agent',
      status: 'invited',
      lastActive: 'Pending invite',
      leadsCount: 0,
    },
  ];

  for (const member of teamList) {
    let authId = ID.unique();
    try {
      // Check if user already exists in Appwrite Auth
      const existingAuth = await appwriteUsers.list([/* search or fetch all */]);
      const found = existingAuth.users.find((u) => u.email === member.email);
      if (found) {
        authId = found.$id;
        console.log(`Auth user ${member.email} already exists (${authId}). Updating password...`);
        await appwriteUsers.updatePassword(authId, member.password);
      } else {
        const created = await appwriteUsers.create(authId, member.email, undefined, member.password, member.name);
        authId = created.$id;
        console.log(`Created new Auth account: ${member.email} (password: ${member.password})`);
      }
    } catch (err: any) {
      console.log(`Auth sync note for ${member.email}:`, err.message);
    }

    // Now upsert in 'users' collection
    try {
      const existingDocs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      const docFound = existingDocs.documents.find((d) => d.email === member.email);
      const payload = {
        userId: authId,
        name: member.name,
        email: member.email,
        role: member.role,
        status: member.status,
        lastActive: member.lastActive,
        leadsCount: member.leadsCount,
      };

      if (docFound) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docFound.$id, payload);
        console.log(`Updated profile doc for ${member.name}`);
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
        console.log(`Created profile doc for ${member.name}`);
      }
    } catch (err: any) {
      console.error(`Database doc error for ${member.name}:`, err.message);
    }
  }

  console.log('\n✅ All Team accounts created across Appwrite Auth and Users collection!');
}

setupUsersAndTeam();
