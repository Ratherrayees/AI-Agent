import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_IDS, ID } from '@/lib/appwrite-server';
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
    const { leadId, leadStatus, priority, description } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (leadStatus) updates.leadStatus = leadStatus;
    if (priority) updates.priority = priority;
    if (description) updates.description = description;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true, updatedFields: [] });
    }

    await serverDatabases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      leadId,
      updates
    );

    // Log the activity
    await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.ACTIVITIES,
      ID.unique(),
      {
        type: 'lead_updated',
        title: 'Lead Updated via AI',
        description: `AI Agent updated lead status/notes.`,
        leadId,
        metadata: JSON.stringify({ updatedFields: Object.keys(updates) })
      }
    );

    return NextResponse.json({
      success: true,
      updatedFields: Object.keys(updates),
    });
  } catch (error: any) {
    console.error('Update lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lead' },
      { status: 500 }
    );
  }
}
