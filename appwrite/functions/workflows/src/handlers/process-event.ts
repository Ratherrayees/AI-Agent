import { Query } from 'node-appwrite';
import { WorkflowContext } from '../types.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'stateai-crm';
const WORKFLOWS_COLLECTION = 'workflows';
const LEADS_COLLECTION = 'leads';

export async function processEventHandler(payload: any, context: WorkflowContext) {
  const { databases, log } = context;
  const eventName = payload?.event || payload?.triggerEvent || 'custom_event';
  const eventData = payload?.data || payload?.document || {};

  log(`Processing Workflow Event: ${eventName}`);

  // 1. Fetch active workflows matching this event trigger
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      WORKFLOWS_COLLECTION,
      [
        Query.equal('isActive', true),
        Query.equal('triggerType', eventName),
        Query.limit(20)
      ]
    );

    const activeWorkflows = response.documents;
    log(`Found ${activeWorkflows.length} active workflows matching trigger '${eventName}'`);

    const executedActions: any[] = [];

    for (const workflow of activeWorkflows) {
      log(`Running workflow: ${workflow.name} (${workflow.$id})`);

      // Evaluate condition if present
      if (workflow.triggerCondition) {
        let conditionMet = true;
        try {
          // Check simple JSON conditions like { "leadStatus": "New" }
          const conditions = typeof workflow.triggerCondition === 'string'
            ? JSON.parse(workflow.triggerCondition)
            : workflow.triggerCondition;

          for (const [key, expectedVal] of Object.entries(conditions)) {
            if (eventData[key] !== expectedVal) {
              conditionMet = false;
              break;
            }
          }
        } catch (e) {
          log(`Condition parsing skipped or invalid for workflow ${workflow.$id}`);
        }

        if (!conditionMet) {
          log(`Workflow condition not met for ${workflow.name}. Skipping.`);
          continue;
        }
      }

      // Execute Action
      const actionType = workflow.actionType;
      const actionConfig = typeof workflow.actionConfig === 'string'
        ? JSON.parse(workflow.actionConfig)
        : workflow.actionConfig || {};

      log(`Executing action ${actionType} for workflow ${workflow.name}`);

      if (actionType === 'send_notification' || actionType === 'send_email' || actionType === 'send_sms') {
        executedActions.push({
          workflowId: workflow.$id,
          action: actionType,
          status: 'dispatched',
          recipient: actionConfig.recipient || eventData.email || eventData.phone
        });
      } else if (actionType === 'update_lead_status' && eventData.$id) {
        await databases.updateDocument(
          DATABASE_ID,
          LEADS_COLLECTION,
          eventData.$id,
          { leadStatus: actionConfig.targetStatus || 'Contacted' }
        );
        executedActions.push({
          workflowId: workflow.$id,
          action: 'update_lead_status',
          status: 'completed',
          leadId: eventData.$id
        });
      }
    }

    return {
      event: eventName,
      processedCount: activeWorkflows.length,
      actionsExecuted: executedActions
    };
  } catch (err: any) {
    log(`Error processing event workflows: ${err.message}`);
    throw err;
  }
}
