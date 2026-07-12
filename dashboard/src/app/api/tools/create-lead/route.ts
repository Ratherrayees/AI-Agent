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
    const { firstName, lastName, phone, email, description, leadStatus = 'new', priority = 'medium' } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required to create a lead' },
        { status: 400 }
      );
    }

    // Format phone number
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Check if lead with this phone already exists first
    const existingLeads = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      [Query.equal('phone', cleanPhone), Query.limit(1)]
    );

    if (existingLeads.documents.length > 0) {
      const existing = existingLeads.documents[0];
      return NextResponse.json({
        success: true,
        created: false,
        message: 'Lead with this phone number already exists',
        lead: {
          id: existing.$id,
          firstName: existing.firstName,
          lastName: existing.lastName,
          phone: existing.phone,
          leadStatus: existing.leadStatus,
        },
      });
    }

    // Create the brand new lead in Appwrite
    const newLead = await serverDatabases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.LEADS,
      ID.unique(),
      {
        firstName: firstName || 'New',
        lastName: lastName || 'Lead',
        phone: cleanPhone,
        email: email || '',
        leadStatus,
        priority,
        description: description || 'Created dynamically by ElevenLabs AI Voice Agent during phone call.',
      }
    );

    return NextResponse.json({
      success: true,
      created: true,
      lead: {
        id: newLead.$id,
        firstName: newLead.firstName,
        lastName: newLead.lastName,
        phone: newLead.phone,
        leadStatus: newLead.leadStatus,
      },
    });
  } catch (error: any) {
    console.error('Create lead error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create lead' },
      { status: 500 }
    );
  }
}
