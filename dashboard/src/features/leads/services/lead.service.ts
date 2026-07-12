import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Lead, PaginatedResponse, ListParams } from '@/types';
import { LeadFormData, UpdateLeadFormData } from '../validation/lead.schema';

export const leadService = {
  async getLeads(params: ListParams): Promise<PaginatedResponse<Lead>> {
    const queries = [];
    
    if (params.search) {
      // Basic search on name or phone
      // Note: Appwrite requires specific indexes for search
      queries.push(Query.search('firstName', params.search));
    }
    
    if (params.sortField && params.sortOrder) {
      if (params.sortOrder === 'asc') {
        queries.push(Query.orderAsc(params.sortField));
      } else {
        queries.push(Query.orderDesc(params.sortField));
      }
    } else {
      queries.push(Query.orderDesc('$createdAt'));
    }

    if (params.page && params.pageSize) {
      queries.push(Query.limit(params.pageSize));
      queries.push(Query.offset((params.page - 1) * params.pageSize));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      queries
    );

    return {
      documents: response.documents as unknown as Lead[],
      total: response.total,
    };
  },

  async getLead(id: string): Promise<Lead> {
    return (await databases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      id
    )) as Lead;
  },

  async createLead(data: LeadFormData): Promise<Lead> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      ID.unique(),
      data as any
    )) as unknown as Lead;
  },

  async updateLead(id: string, data: UpdateLeadFormData): Promise<Lead> {
    return (await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      id,
      data as any
    )) as unknown as Lead;
  },

  async deleteLead(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.LEADS, id);
  },

  // Example of a bulk action
  async deleteLeads(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.LEADS, id)
      )
    );
  },
};
