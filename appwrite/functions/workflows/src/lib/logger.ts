import { Databases, ID } from 'node-appwrite';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'stateai-crm';
const ACTIVITY_COLLECTION = 'activities';

export async function logWorkflowExecution(
  databases: Databases,
  workflowName: string,
  payload: any,
  result: any,
  status: 'success' | 'error',
  executionTimeMs: number
) {
  try {
    await databases.createDocument(
      DATABASE_ID,
      ACTIVITY_COLLECTION,
      ID.unique(),
      {
        type: 'workflow',
        title: `Workflow Executed: ${workflowName}`,
        description: `Status: ${status} in ${executionTimeMs}ms`,
        metadata: JSON.stringify({
          workflowName,
          payload,
          result: status === 'error' ? result : 'Success',
          executionTimeMs
        })
      }
    );
  } catch (error) {
    console.error('Failed to log workflow execution:', error);
  }
}
