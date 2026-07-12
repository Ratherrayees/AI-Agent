import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { WebhookFormData, ApiKeyFormData } from '../validation/integration.schema';

export const integrationService = {
  // Webhooks
  async getWebhooks() {
    return await databases.listDocuments(DATABASE_ID, 'webhooks', [Query.orderDesc('$createdAt')]);
  },
  async createWebhook(data: WebhookFormData) {
    return await databases.createDocument(DATABASE_ID, 'webhooks', ID.unique(), data);
  },
  
  // Webhook Logs
  async getWebhookLogs(webhookId: string) {
    return await databases.listDocuments(DATABASE_ID, 'webhook_logs', [
      Query.equal('webhookId', webhookId),
      Query.orderDesc('$createdAt'),
      Query.limit(50)
    ]);
  },

  // API Keys
  async getApiKeys() {
    return await databases.listDocuments(DATABASE_ID, 'api_keys', [Query.orderDesc('$createdAt')]);
  },
  async createApiKey(data: ApiKeyFormData) {
    // Note: The backend should ideally generate the secret key hash. 
    // For MVP, we mock the secret generation in UI and save metadata here.
    return await databases.createDocument(DATABASE_ID, 'api_keys', ID.unique(), {
      ...data,
      isRevoked: false,
      lastUsedAt: null,
    });
  },
  async revokeApiKey(id: string) {
    return await databases.updateDocument(DATABASE_ID, 'api_keys', id, { isRevoked: true });
  },

  // Jobs
  async getSystemJobs() {
    return await databases.listDocuments(DATABASE_ID, 'system_jobs', [Query.orderDesc('$createdAt'), Query.limit(20)]);
  }
};
