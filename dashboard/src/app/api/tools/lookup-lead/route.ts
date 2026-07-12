import { NextRequest, NextResponse } from 'next/server';
import { serverDatabases, DATABASE_ID, COLLECTION_IDS, Query } from '@/lib/appwrite-server';
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
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number to ensure consistent querying (basic cleanup)
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      [Query.equal('phone', cleanPhone), Query.limit(1)]
    );

    if (response.documents.length === 0) {
      return NextResponse.json({ found: false, lead: null });
    }

    const lead = response.documents[0];

    // Query any existing or upcoming appointments for this specific lead
    let upcomingAppointments: any[] = [];
    try {
      const appointmentsResponse = await serverDatabases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.APPOINTMENTS,
        [
          Query.equal('leadId', lead.$id),
          Query.orderAsc('date'),
          Query.limit(5)
        ]
      );
      upcomingAppointments = appointmentsResponse.documents.map((app: any) => ({
        id: app.$id,
        title: app.title,
        date: app.date,
        startTime: app.startTime,
        endTime: app.endTime,
        meetingType: app.meetingType,
        status: app.status,
      }));
    } catch (err) {
      console.warn('Could not fetch appointments for lead during lookup:', err);
    }

    // Return the lead data + full appointment schedule formatted for ElevenLabs context
    return NextResponse.json({
      found: true,
      lead: {
        id: lead.$id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        phone: lead.phone,
        email: lead.email,
        leadStatus: lead.leadStatus,
        priority: lead.priority,
        company: lead.company,
        appointmentsCount: lead.appointmentsCount,
        upcomingAppointments,
      },
    });
  } catch (error: any) {
    console.error('Lookup lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to lookup lead' },
      { status: 500 }
    );
  }
}
