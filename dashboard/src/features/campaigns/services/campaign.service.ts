import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Campaign, PaginatedResponse, ListParams } from '@/types';
import { CampaignFormData, UpdateCampaignFormData } from '../validation/campaign.schema';

export const campaignService = {
  async getCampaigns(params: ListParams): Promise<PaginatedResponse<Campaign>> {
    const queries = [];
    
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
      COLLECTION_IDS.CAMPAIGNS,
      queries
    );

    return {
      documents: response.documents as unknown as Campaign[],
      total: response.total,
    };
  },

  async getCampaign(id: string): Promise<Campaign> {
    return (await databases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.CAMPAIGNS,
      id
    )) as Campaign;
  },

  async createCampaign(data: CampaignFormData): Promise<Campaign> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.CAMPAIGNS,
      ID.unique(),
      data as any
    )) as unknown as Campaign;
  },

  async updateCampaign(id: string, data: UpdateCampaignFormData): Promise<Campaign> {
    return (await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.CAMPAIGNS,
      id,
      data as any
    )) as unknown as Campaign;
  },

  async deleteCampaign(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.CAMPAIGNS, id);
  },
};
