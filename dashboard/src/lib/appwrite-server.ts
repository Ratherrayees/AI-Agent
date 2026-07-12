import { Client, Databases, Users } from 'node-appwrite';
import { APPWRITE_CONFIG } from './appwrite/config';

// Initialize the Appwrite server client
const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

// Use the secret API key for server-side operations
if (process.env.APPWRITE_API_KEY) {
  client.setKey(process.env.APPWRITE_API_KEY);
} else {
  console.warn('APPWRITE_API_KEY is not set. Server-side Appwrite operations will fail.');
}

export const serverDatabases = new Databases(client);
export const serverUsers = new Users(client);
export { ID, Query } from 'node-appwrite';
export { DATABASE_ID, COLLECTION_IDS } from './appwrite/config';
