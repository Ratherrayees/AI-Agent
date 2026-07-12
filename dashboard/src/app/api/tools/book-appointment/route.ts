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
    const { leadId, title, date, startTime, endTime, meetingType = 'in_person', location, description } = body;

    if (!leadId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'leadId, date, startTime, and endTime are required' },
        { status: 400 }
      );
    }

    // 1. Get the lead to ensure it exists and get assignedUserId
    const lead = await serverDatabases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      leadId
    );

    // 2. Create the appointment
    const appointmentId = ID.unique();
    const appointment = await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      appointmentId,
      {
        title: title || `Showing for ${lead.firstName} ${lead.lastName}`,
        description,
        leadId,
        assignedUserId: lead.assignedUserId || 'unassigned', // Fallback
        meetingType,
        status: 'scheduled',
        date,
        startTime,
        endTime,
        timezone: 'UTC', // Could pass this from the agent
        location,
        createdById: 'ai_agent',
      }
    );

    // 3. Update lead status if necessary
    if (lead.leadStatus === 'new' || lead.leadStatus === 'contacted' || lead.leadStatus === 'interested') {
      await serverDatabases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.LEADS,
        leadId,
        {
          leadStatus: 'appointment_scheduled',
          appointmentsCount: (lead.appointmentsCount || 0) + 1
        }
      );
    }

    // 4. Log the activity
    await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.ACTIVITIES,
      ID.unique(),
      {
        type: 'appointment_scheduled',
        title: 'Appointment Booked via AI',
        description: `AI Agent scheduled an appointment for ${date} at ${startTime}.`,
        leadId,
        metadata: JSON.stringify({ appointmentId })
      }
    );

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.$id,
        title: appointment.title,
        date: appointment.date,
        startTime: appointment.startTime,
        confirmationMessage: `Your appointment is confirmed for ${date} at ${startTime}.`,
      },
    });
  } catch (error: any) {
    console.error('Book appointment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to book appointment' },
      { status: 500 }
    );
  }
}
