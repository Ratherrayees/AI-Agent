import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Activity } from '@/types';
import { ActivityFormData } from '../validation/activity.schema';

export const activityService = {
  async getActivitiesByLead(leadId: string): Promise<Activity[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.ACTIVITIES,
      [
        Query.equal('leadId', leadId),
        Query.orderDesc('$createdAt'),
        Query.limit(100),
      ]
    );

    return response.documents as unknown as Activity[];
  },

  async createActivity(data: ActivityFormData): Promise<Activity> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.ACTIVITIES,
      ID.unique(),
      data
    )) as Activity;
  },
};
