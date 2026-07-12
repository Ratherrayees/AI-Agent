import { Query } from 'node-appwrite';
import { WorkflowContext } from '../types.js';

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'stateai-crm';
const LEADS_COLLECTION = 'leads';
const APPOINTMENTS_COLLECTION = 'appointments';

export async function runJobHandler(payload: any, context: WorkflowContext) {
  const { databases, log } = context;
  const jobType = payload?.jobType || payload?.job || 'stale_lead_check';

  log(`Running Scheduled Job: ${jobType}`);

  if (jobType === 'stale_lead_check') {
    // Find leads who haven't been updated in over 7 days and are still in 'Contacted' state
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        LEADS_COLLECTION,
        [
          Query.equal('leadStatus', 'Contacted'),
          Query.lessThan('updatedAt', sevenDaysAgo),
          Query.limit(50)
        ]
      );

      const staleLeads = response.documents;
      log(`Found ${staleLeads.length} stale leads to flag for follow-up.`);

      let flaggedCount = 0;
      for (const lead of staleLeads) {
        await databases.updateDocument(
          DATABASE_ID,
          LEADS_COLLECTION,
          lead.$id,
          {
            priority: 'High',
            notes: (lead.notes || '') + '\n[System Flag]: Stale lead (no contact >7 days). Scheduled for automated follow-up.'
          }
        );
        flaggedCount++;
      }

      return {
        jobType,
        checkedCount: staleLeads.length,
        flaggedCount,
        status: 'completed'
      };
    } catch (err: any) {
      log(`Error running stale_lead_check: ${err.message}`);
      throw err;
    }
  } else if (jobType === 'appointment_reminders') {
    // Check appointments scheduled in the next 24 hours
    const now = new Date().toISOString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const response = await databases.listDocuments(
      DATABASE_ID,
      APPOINTMENTS_COLLECTION,
      [
        Query.greaterThan('startTime', now),
        Query.lessThan('startTime', tomorrow),
        Query.equal('status', 'scheduled'),
        Query.limit(50)
      ]
    );

    const upcoming = response.documents;
    log(`Found ${upcoming.length} upcoming appointments in next 24 hours.`);

    return {
      jobType,
      upcomingCount: upcoming.length,
      status: 'completed'
    };
  }

  return {
    jobType,
    status: 'skipped_unknown_job'
  };
}
