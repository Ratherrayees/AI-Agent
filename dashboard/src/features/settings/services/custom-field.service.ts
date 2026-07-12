/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { CustomFieldFormData } from '../validation/custom-field.schema';

const CUSTOM_FIELDS_COLLECTION = 'custom_fields';

export const customFieldService = {
  async getCustomFields(entity?: string) {
    try {
      const queries = [Query.orderAsc('order')];
      if (entity) {
        queries.push(Query.equal('targetEntity', entity));
      }
      return await databases.listDocuments(DATABASE_ID, CUSTOM_FIELDS_COLLECTION, queries);
    } catch (e: any) {
      if (e.code === 404) return { documents: [], total: 0 };
      throw e;
    }
  },

  async createCustomField(data: CustomFieldFormData) {
    return await databases.createDocument(DATABASE_ID, CUSTOM_FIELDS_COLLECTION, ID.unique(), data);
  },

  async updateCustomField(id: string, data: Partial<CustomFieldFormData>) {
    return await databases.updateDocument(DATABASE_ID, CUSTOM_FIELDS_COLLECTION, id, data);
  },

  async deleteCustomField(id: string) {
    return await databases.deleteDocument(DATABASE_ID, CUSTOM_FIELDS_COLLECTION, id);
  }
};
