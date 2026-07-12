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
    const { date, timezone = 'UTC' } = body; // date should be YYYY-MM-DD

    if (!date) {
      return NextResponse.json(
        { error: 'date is required (YYYY-MM-DD)' },
        { status: 400 }
      );
    }

    // 1. Get existing appointments for that date
    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      [Query.equal('date', date)]
    );

    const bookedSlots = response.documents.map((doc) => ({
      startTime: doc.startTime,
      endTime: doc.endTime,
      title: doc.title,
    }));

    // 2. Generate available slots (simple 9-5 logic for now)
    const businessHours = [
      { start: '09:00', end: '10:00' },
      { start: '10:00', end: '11:00' },
      { start: '11:00', end: '12:00' },
      { start: '13:00', end: '14:00' },
      { start: '14:00', end: '15:00' },
      { start: '15:00', end: '16:00' },
      { start: '16:00', end: '17:00' },
    ];

    // Filter out booked slots
    const availableSlots = businessHours.filter((slot) => {
      // Check if this slot overlaps with any booked slot
      const isBooked = bookedSlots.some((booked) => {
        return (slot.start >= booked.startTime && slot.start < booked.endTime) ||
               (slot.end > booked.startTime && slot.end <= booked.endTime) ||
               (slot.start <= booked.startTime && slot.end >= booked.endTime);
      });
      return !isBooked;
    });

    return NextResponse.json({
      date,
      timezone,
      availableSlots,
      bookedSlots,
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check availability' },
      { status: 500 }
    );
  }
}
