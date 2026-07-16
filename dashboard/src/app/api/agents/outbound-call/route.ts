import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_IDS, ID } from '@/lib/appwrite-server';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || 'sk_25621b9d870598e8c2e50c29d71c3d3407a9f285934b989a';
const OUTBOUND_SALES_AGENT_ID = 'agent_0801kxfte8gwe8sstnppq2k5mf4z'; // StateAI Outbound Sales Specialist
const TWILIO_PHONE_NUMBER_ID = 'phnum_9501kxg8xyeaez99kdcw4scqymsk'; // +15715711446 (twilio trail)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, leadId, agentId, clientName, campaignId } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number (`phone`) is required to initiate an outbound call.' },
        { status: 400 }
      );
    }

    // Ensure phone number starts with + for Twilio E.164 compliance
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
      // If digits only, prefix with + or assume US/International format if needed
      formattedPhone = `+${formattedPhone.replace(/[^\d]/g, '')}`;
    }

    const targetAgentId = agentId || OUTBOUND_SALES_AGENT_ID;

    console.log(`📞 Triggering ElevenLabs Twilio Outbound Call to ${formattedPhone} using agent ${targetAgentId}...`);

    const elResponse = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: targetAgentId,
        agent_phone_number_id: TWILIO_PHONE_NUMBER_ID,
        to_number: formattedPhone
      })
    });

    const elData = await elResponse.json();

    if (!elResponse.ok || elData.success === false) {
      console.error('❌ ElevenLabs Twilio outbound call failed:', elData);
      return NextResponse.json(
        { 
          success: false, 
          error: elData.message || elData.detail || 'Failed to initiate Twilio outbound call via ElevenLabs',
          data: elData 
        },
        { status: elResponse.status || 400 }
      );
    }

    console.log('✅ Outbound call initiated successfully:', elData);

    // If leadId is provided, record the call initiation in Appwrite call_history and activities
    if (leadId && typeof leadId === 'string') {
      try {
        await serverDatabases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.CALL_HISTORY,
          ID.unique(),
          {
            conversationId: elData.conversation_id || ID.unique(),
            leadId: leadId,
            campaignId: campaignId || '',
            aiAgentId: targetAgentId,
            direction: 'outbound',
            phoneNumber: formattedPhone,
            duration: 0,
            callStatus: 'ringing',
            startedAt: new Date().toISOString(),
          }
        );

        await serverDatabases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.ACTIVITIES,
          ID.unique(),
          {
            leadId: leadId,
            type: 'call',
            title: `AI Outbound Call Initiated (${clientName || formattedPhone})`,
            description: `Triggered outbound voice agent call via Twilio (+15715711446) to ${formattedPhone}. Call SID: ${elData.callSid || 'pending'}`,
            metadata: JSON.stringify(elData)
          }
        );

        try {
          await serverDatabases.updateDocument(
            DATABASE_ID,
            COLLECTION_IDS.LEADS,
            leadId,
            { leadStatus: 'contacted' }
          );
        } catch (leadUpdateErr) {}
      } catch (dbErr) {
        console.warn('Could not log outbound call activity to Appwrite:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Outbound AI call initiated to ${formattedPhone}!`,
      conversationId: elData.conversation_id,
      callSid: elData.callSid,
      data: elData
    });
  } catch (error: any) {
    console.error('Outbound call API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error triggering call' },
      { status: 500 }
    );
  }
}
