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

    // Clean and format transcript / summaries to fit safely within Appwrite attribute limits
    let formattedTranscript = '';
    if (Array.isArray(transcript)) {
      formattedTranscript = transcript.map((t: any) => `${t.role ? t.role.toUpperCase() : 'SPEAKER'}: ${t.message || t.text || ''}`).join('\n');
    } else if (typeof transcript === 'string') {
      formattedTranscript = transcript;
    } else if (transcript) {
      formattedTranscript = JSON.stringify(transcript);
    }
    const safeTranscript = formattedTranscript ? formattedTranscript.slice(0, 3400) : undefined;
    const safeSummary = typeof summary === 'string' ? summary.slice(0, 1400) : summary ? JSON.stringify(summary).slice(0, 1400) : undefined;

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
        summary: safeSummary,
        aiSummary: safeSummary,
        sentiment: typeof sentiment === 'string' ? sentiment.slice(0, 95) : 'neutral',
        outcome: typeof outcome === 'string' ? outcome.slice(0, 250) : 'completed',
        recordingUrl: typeof recordingUrl === 'string' ? recordingUrl.slice(0, 950) : undefined,
        transcript: safeTranscript,
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
