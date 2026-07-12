import { Client, Databases } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { setupLeadAttributes } from './attributes';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY = process.env.APPWRITE_API_KEY!;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function main() {
  console.log('Starting attribute creation...');
  
  await setupLeadAttributes(databases);
  
  console.log('Attribute creation complete.');
}

main().catch(console.error);
