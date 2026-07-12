import { Databases, ID } from 'node-appwrite';

const DATABASE_ID = 'stateai_crm';
const ACTIVITY_COLLECTION = 'activities';

export async function logToolExecution(
  databases: Databases,
  toolName: string,
  args: any,
  response: any,
  status: 'success' | 'error',
  executionTimeMs: number
) {
  try {
    // We log this in the general activities collection
    // In a full production scenario, you might have a dedicated "tool_executions" collection
    
    await databases.createDocument(
      DATABASE_ID,
      ACTIVITY_COLLECTION,
      ID.unique(),
      {
        type: 'custom',
        title: `AI Tool Executed: ${toolName}`,
        description: `Status: ${status} in ${executionTimeMs}ms`,
        metadata: JSON.stringify({
          toolName,
          args,
          response: status === 'error' ? response : 'Success',
          executionTimeMs
        })
      }
    );
  } catch (error) {
    console.error('Failed to log tool execution:', error);
    // We don't throw here to avoid failing the actual tool request
  }
}
