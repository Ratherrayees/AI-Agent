/**
 * Appwrite Client (Browser-side)
 * Used in React components and client-side hooks.
 */
import { Client, Account, Databases, Storage } from 'appwrite';
import { APPWRITE_CONFIG } from './config';

const client = new Client()
  .setEndpoint(APPWRITE_CONFIG.endpoint)
  .setProject(APPWRITE_CONFIG.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };
export default client;
