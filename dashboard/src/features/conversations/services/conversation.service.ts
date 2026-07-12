import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Conversation, PaginatedResponse, ListParams } from '@/types';
import { ConversationFormData } from '../validation/conversation.schema';

export const conversationService = {
  async getConversations(params: ListParams): Promise<PaginatedResponse<Conversation>> {
    const queries = [];
    
    if (params.sortField && params.sortOrder) {
      if (params.sortOrder === 'asc') {
        queries.push(Query.orderAsc(params.sortField));
      } else {
        queries.push(Query.orderDesc(params.sortField));
      }
    } else {
      // Default to newest first
      queries.push(Query.orderDesc('$createdAt'));
    }

    if (params.page && params.pageSize) {
      queries.push(Query.limit(params.pageSize));
      queries.push(Query.offset((params.page - 1) * params.pageSize));
    }

    // Advanced filtering could be added here based on params

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.CONVERSATIONS,
      queries
    );

    return {
      documents: response.documents as unknown as Conversation[],
      total: response.total,
    };
  },
  
  async getConversationsByLead(leadId: string): Promise<Conversation[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.CONVERSATIONS,
      [
        Query.equal('leadId', leadId),
        Query.orderDesc('$createdAt')
      ]
    );

    return response.documents as unknown as Conversation[];
  },

  async getConversation(id: string): Promise<Conversation> {
    return (await databases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.CONVERSATIONS,
      id
    )) as Conversation;
  },

  // Typically, conversations are created by the AI webhook, but we provide it here just in case
  async createConversation(data: ConversationFormData): Promise<Conversation> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.CONVERSATIONS,
      ID.unique(),
      data as any
    )) as unknown as Conversation;
  },

  async deleteConversation(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.CONVERSATIONS, id);
  },
};
