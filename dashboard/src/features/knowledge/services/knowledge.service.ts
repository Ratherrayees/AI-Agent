import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { KnowledgeSourceFormData } from '../validation/knowledge.schema';

const KNOWLEDGE_COLLECTION = 'knowledge_sources'; // Assuming this exists or will be created

export const knowledgeService = {
  async getKnowledgeSources() {
    try {
      return await databases.listDocuments(DATABASE_ID, KNOWLEDGE_COLLECTION, [
        Query.orderDesc('$createdAt')
      ]);
    } catch (error: any) {
      // Return empty if collection doesn't exist yet
      if (error.code === 404) return { documents: [], total: 0 };
      throw error;
    }
  },

  async createKnowledgeSource(data: KnowledgeSourceFormData) {
    return await databases.createDocument(DATABASE_ID, KNOWLEDGE_COLLECTION, ID.unique(), data);
  },

  async deleteKnowledgeSource(id: string) {
    return await databases.deleteDocument(DATABASE_ID, KNOWLEDGE_COLLECTION, id);
  }
};
