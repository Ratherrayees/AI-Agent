import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_IDS, ID } from '@/lib/appwrite-server';
import { Query } from 'node-appwrite';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_25621b9d870598e8c2e50c29d71c3d3407a9f285934b989a';
const OUTBOUND_SALES_AGENT_ID = 'agent_0801kxfte8gwe8sstnppq2k5mf4z';
const TWILIO_PHONE_NUMBER_ID = 'phnum_9501kxg8xyeaez99kdcw4scqymsk'; // +15715711446

export async function POST(request: NextRequest) {
  try {
    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json({ success: false, error: 'Campaign ID is required to run batch calling engine.' }, { status: 400 });
    }

    // 1. Fetch Campaign configuration
    let campaign: any;
    try {
      campaign = await serverDatabases.getDocument(
        DATABASE_ID,
        COLLECTION_IDS.CAMPAIGNS,
        campaignId
      );
    } catch (err: any) {
      return NextResponse.json({ success: false, error: `Campaign not found: ${err.message}` }, { status: 404 });
    }

    const agentId = campaign.aiAgentId || OUTBOUND_SALES_AGENT_ID;

    // 2. Fetch leads enrolled in this campaign
    // We query by campaignId attribute first, or fallback to querying tags or recent leads
    let leads: any[] = [];
    try {
      const response = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.LEADS,
        [Query.equal('campaignId', campaignId), Query.limit(50)]
      );
      leads = response.documents;
    } catch (queryErr) {
      // Fallback query if campaignId index is propagating or empty
    }

    // If no leads specifically assigned to this campaign yet, for batch demo/testing, find up to 5 uncontacted/new leads or check tags
    if (leads.length === 0) {
      try {
        const fallbackRes = await serverDatabases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.LEADS,
          [Query.limit(10)]
        );
        // Filter any leads that match tag or just pick up to 5 leads that have phone numbers
        leads = fallbackRes.documents.filter(l => l.phone && l.phone.trim().length > 5).slice(0, 5);
      } catch (err) {}
    }

    if (leads.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No leads found in the queue with valid phone numbers to call.'
      }, { status: 400 });
    }

    console.log(`🚀 Executing Batch AI Calling for campaign "${campaign.name}" across ${leads.length} leads...`);

    let initiatedCount = 0;
    let failedCount = 0;
    const results: any[] = [];

    for (const lead of leads) {
      if (!lead.phone) {
        results.push({ leadId: lead.$id, name: `${lead.firstName} ${lead.lastName}`, status: 'skipped_no_phone' });
        continue;
      }

      let formattedPhone = lead.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = `+${formattedPhone.replace(/[^\d]/g, '')}`;
      }

      try {
        // Trigger ElevenLabs Twilio Outbound Call
        const elResponse = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            agent_id: agentId,
            agent_phone_number_id: TWILIO_PHONE_NUMBER_ID,
            to_number: formattedPhone
          })
        });

        const elData = await elResponse.json();

        if (elResponse.ok && elData.success !== false) {
          initiatedCount++;
          results.push({
            leadId: lead.$id,
            name: `${lead.firstName} ${lead.lastName}`,
            phone: formattedPhone,
            status: 'initiated',
            callSid: elData.callSid
          });

          // Log call record into call_history collection linked to this campaign & lead
          await serverDatabases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.CALL_HISTORY,
            ID.unique(),
            {
              conversationId: elData.conversation_id || ID.unique(),
              leadId: lead.$id,
              campaignId: campaign.$id,
              aiAgentId: agentId,
              direction: 'outbound',
              phoneNumber: formattedPhone,
              duration: 0,
              callStatus: 'ringing',
              startedAt: new Date().toISOString()
            }
          );

          // Update lead status to contacted
          try {
            await serverDatabases.updateDocument(
              DATABASE_ID,
              COLLECTION_IDS.LEADS,
              lead.$id,
              { leadStatus: 'contacted', campaignId: campaign.$id }
            );
          } catch (e) {}

          // Log Activity
          await serverDatabases.createDocument(
            DATABASE_ID,
            COLLECTION_IDS.ACTIVITIES,
            ID.unique(),
            {
              leadId: lead.$id,
              type: 'call',
              title: `Campaign Batch Call Initiated (${campaign.name})`,
              description: `Dispatched outbound voice agent (${agentId}) to ${lead.firstName} ${lead.lastName} (${formattedPhone}). Call SID: ${elData.callSid || 'pending'}`,
              metadata: JSON.stringify(elData)
            }
          );
        } else {
          failedCount++;
          results.push({
            leadId: lead.$id,
            name: `${lead.firstName} ${lead.lastName}`,
            phone: formattedPhone,
            status: 'failed',
            error: elData.message || elData.detail || 'ElevenLabs API returned error'
          });
        }
      } catch (callErr: any) {
        failedCount++;
        results.push({
          leadId: lead.$id,
          name: `${lead.firstName} ${lead.lastName}`,
          phone: formattedPhone,
          status: 'error',
          error: callErr.message
        });
      }

      // Add a 600ms delay between batch dispatches to prevent Twilio/ElevenLabs rate limits
      await new Promise(r => setTimeout(r, 600));
    }

    // Update campaign status to running if not already
    if (campaign.status !== 'running') {
      try {
        await serverDatabases.updateDocument(
          DATABASE_ID,
          COLLECTION_IDS.CAMPAIGNS,
          campaign.$id,
          { status: 'running' }
        );
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      message: `Batch calling engine finished: ${initiatedCount} calls initiated, ${failedCount} failed.`,
      initiatedCount,
      failedCount,
      totalProcessed: leads.length,
      results
    });
  } catch (error: any) {
    console.error('Batch engine error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error running batch engine' }, { status: 500 });
  }
}
