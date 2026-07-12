import { Client, Users, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.log('Appwrite credentials not found in dashboard/.env.local. Please ensure Appwrite is configured.');
  process.exit(0);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const users = new Users(client);

async function main() {
  try {
    const list = await users.list();
    console.log(`Found ${list.total} existing user(s) in Appwrite.`);
    for (const u of list.users) {
      console.log(`- User ID: ${u.$id}, Email: ${u.email}, Name: ${u.name}`);
    }

    // Check if admin@stateai.com exists
    const adminUser = list.users.find(u => u.email === 'admin@stateai.com');
    if (!adminUser) {
      console.log('Creating default admin user (admin@stateai.com)...');
      await users.create(ID.unique(), 'admin@stateai.com', undefined, 'admin123456', 'Super Admin');
      console.log('Successfully created admin@stateai.com with password: admin123456');
    } else {
      console.log('Default admin user (admin@stateai.com) already exists!');
      // Update password just in case
      await users.updatePassword(adminUser.$id, 'admin123456');
      console.log('Updated password for admin@stateai.com to: admin123456');
    }
  } catch (error: any) {
    console.error('Error managing admin user:', error.message);
  }
}

main();
