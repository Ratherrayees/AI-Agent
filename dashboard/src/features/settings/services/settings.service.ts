/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { CompanySettingsFormData, BusinessHoursFormData } from '../validation/settings.schema';

export const settingsService = {
  // We assume a single settings document for the entire CRM
  // In a multi-tenant app, this would be scoped by tenantId
  async getCompanySettings(): Promise<any> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.COMPANY_SETTINGS,
      [Query.limit(1)]
    );
    
    if (response.total === 0) {
      return null;
    }
    
    return response.documents[0];
  },

  async updateCompanySettings(id: string | null, data: CompanySettingsFormData): Promise<any> {
    if (!id) {
      // Create new
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.COMPANY_SETTINGS,
        ID.unique(),
        data
      );
    }
    
    // Update existing
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.COMPANY_SETTINGS,
      id,
      data
    );
  },

  async getBusinessHours(): Promise<any> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.BUSINESS_HOURS,
      [Query.limit(1)]
    );
    
    if (response.total === 0) {
      return null;
    }
    
    return response.documents[0];
  },

  async updateBusinessHours(id: string | null, data: BusinessHoursFormData): Promise<any> {
    // Appwrite expects flat properties, so we stringify the JSON object
    const payload = {
      scheduleJson: JSON.stringify(data)
    };

    if (!id) {
      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.BUSINESS_HOURS,
        ID.unique(),
        payload
      );
    }
    
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.BUSINESS_HOURS,
      id,
      payload
    );
  },
};
