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
    const { 
      location, 
      propertyType, 
      minBedrooms, 
      maxBudget, 
      query 
    } = body;

    // Build Appwrite queries
    const queries = [Query.equal('status', 'available'), Query.limit(10)];

    if (propertyType && typeof propertyType === 'string' && propertyType.trim() !== '') {
      queries.push(Query.equal('type', propertyType.toLowerCase().trim()));
    }

    if (typeof minBedrooms === 'number' && minBedrooms > 0) {
      queries.push(Query.greaterThanEqual('bedrooms', minBedrooms));
    }

    if (typeof maxBudget === 'number' && maxBudget > 0) {
      queries.push(Query.lessThanEqual('price', maxBudget));
    }

    const response = await serverDatabases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.PROPERTIES,
      queries
    );

    let docs = response.documents;

    // In-memory filter for flexible text search on location or query keywords
    if (location && typeof location === 'string' && location.trim() !== '') {
      const locLower = location.toLowerCase().trim();
      const filtered = docs.filter(d => 
        (d.location && d.location.toLowerCase().includes(locLower)) ||
        (d.title && d.title.toLowerCase().includes(locLower)) ||
        (d.description && d.description.toLowerCase().includes(locLower))
      );
      if (filtered.length > 0) docs = filtered;
    }

    if (query && typeof query === 'string' && query.trim() !== '') {
      const qLower = query.toLowerCase().trim();
      const filtered = docs.filter(d => 
        (d.title && d.title.toLowerCase().includes(qLower)) ||
        (d.description && d.description.toLowerCase().includes(qLower)) ||
        (d.location && d.location.toLowerCase().includes(qLower)) ||
        (d.amenities && d.amenities.toLowerCase().includes(qLower))
      );
      if (filtered.length > 0) docs = filtered;
    }

    // Format properties for clear, concise spoken delivery and video link sharing
    const formattedProperties = docs.map(p => ({
      id: p.$id,
      title: p.title,
      type: p.type,
      location: p.location,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      priceFormatted: `$${Number(p.price).toLocaleString('en-US')}`,
      priceRaw: p.price,
      amenities: p.amenities,
      virtualTourUrl: p.virtualTourUrl || null,
      possessionDate: p.possessionDate || 'Ready to move',
      description: p.description
    }));

    return NextResponse.json({
      success: true,
      found: formattedProperties.length > 0,
      count: formattedProperties.length,
      properties: formattedProperties,
      instructions: 'Quote 1 or 2 matching properties to the caller with their price and key amenities. If they express interest or ask to see the property, mention that we have a 3D video walkthrough link (virtualTourUrl) and offer to send it right now to their phone via SMS or WhatsApp using the update_lead or book_appointment tool!'
    });
  } catch (error: any) {
    console.error('search-properties webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search properties' },
      { status: 500 }
    );
  }
}
