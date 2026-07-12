import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_IDS, ID, Query } from '@/lib/appwrite-server';
import { verifyElevenLabsWebhook } from '@/lib/webhook-auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyElevenLabsWebhook(request);
    if (!authResult.authorized) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized' },
        { status: authResult.status || 401 }
      );
    }

    const body = await request.json();
    const { 
      leadId, 
      agentId, 
      direction = 'inbound', 
      duration, 
      summary, 
      transcript, 
      sentiment, 
      outcome, 
      recordingUrl, 
      phoneNumber 
    } = body;

    let targetLeadId = leadId;

    // Try to find lead by phone if no leadId provided
    if (!targetLeadId && phoneNumber) {
       const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
       const leads = await serverDatabases.listDocuments(
         DATABASE_ID,
         COLLECTION_IDS.LEADS,
         [Query.equal('phone', cleanPhone), Query.limit(1)]
       );
       if (leads.documents.length > 0) {
         targetLeadId = leads.documents[0].$id;
       }
    }

    if (!targetLeadId) {
      // If we still don't have a lead, we might want to create a generic one or just log the call without a lead.
      // For now, let's create a generic "Unknown Lead"
      const newLead = await serverDatabases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.LEADS,
        ID.unique(),
        {
          firstName: 'Unknown',
          lastName: 'Caller',
          phone: phoneNumber || 'unknown',
          leadStatus: 'new',
          description: 'Created automatically from inbound call',
        }
      );
      targetLeadId = newLead.$id;
    }

    const now = new Date().toISOString();

    // 1. Create Conversation record
    const conversation = await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.CONVERSATIONS,
      ID.unique(),
      {
        leadId: targetLeadId,
        type: 'voice_call',
        status: 'completed',
        direction,
        aiAgentId: agentId,
        startedAt: new Date(Date.now() - (duration * 1000)).toISOString(),
        endedAt: now,
        durationSeconds: duration,
        summary,
        aiSummary: summary,
        sentiment,
        outcome,
        recordingUrl,
        transcript,
      }
    );

    // 2. Create Call History record
    const callHistory = await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.CALL_HISTORY,
      ID.unique(),
      {
        conversationId: conversation.$id,
        direction,
        phoneNumber: phoneNumber || 'unknown',
        duration,
        recordingUrl,
        callStatus: 'completed',
        callOutcome: outcome,
        summary,
        aiAgentId: agentId,
        startedAt: conversation.startedAt,
        endedAt: now,
      }
    );

    // 3. Log Activity
    await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.ACTIVITIES,
      ID.unique(),
      {
        type: 'call_completed',
        title: 'AI Call Completed',
        description: `Call with AI Agent finished. Duration: ${Math.floor(duration/60)}m ${duration%60}s.`,
        leadId: targetLeadId,
        metadata: JSON.stringify({ 
          conversationId: conversation.$id,
          callOutcome: outcome 
        })
      }
    );

    return NextResponse.json({
      success: true,
      conversationId: conversation.$id,
      callHistoryId: callHistory.$id,
    });
  } catch (error: any) {
    console.error('Call completed webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
