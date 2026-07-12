/* eslint-disable @typescript-eslint/no-explicit-any */
import { databases, DATABASE_ID } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { WorkflowFormData } from '../validation/workflow.schema';

const WORKFLOWS_COLLECTION = 'workflows';

export const workflowService = {
  async getWorkflows() {
    try {
      return await databases.listDocuments(DATABASE_ID, WORKFLOWS_COLLECTION, [
        Query.orderDesc('$createdAt')
      ]);
    } catch (e: any) {
      if (e.code === 404) return { documents: [], total: 0 };
      throw e;
    }
  },

  async createWorkflow(data: WorkflowFormData) {
    // Stringify nested JSON objects for Appwrite storage
    const payload = {
      name: data.name,
      description: data.description,
      status: data.status,
      triggerJson: JSON.stringify(data.trigger),
      actionsJson: JSON.stringify(data.actions),
    };
    return await databases.createDocument(DATABASE_ID, WORKFLOWS_COLLECTION, ID.unique(), payload);
  },

  async updateWorkflow(id: string, data: Partial<WorkflowFormData>) {
    const payload: any = { ...data };
    if (data.trigger) payload.triggerJson = JSON.stringify(data.trigger);
    if (data.actions) payload.actionsJson = JSON.stringify(data.actions);
    delete payload.trigger;
    delete payload.actions;

    return await databases.updateDocument(DATABASE_ID, WORKFLOWS_COLLECTION, id, payload);
  },

  async deleteWorkflow(id: string) {
    return await databases.deleteDocument(DATABASE_ID, WORKFLOWS_COLLECTION, id);
  }
};
