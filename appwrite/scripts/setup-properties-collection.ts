import { Client, Databases, Permission, Role, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local from dashboard
dotenv.config({ path: path.resolve(__dirname, '../../dashboard/.env.local') });

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'stateai-crm';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('❌ APPWRITE_API_KEY is required in dashboard/.env.local');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

const DATABASE_ID = 'stateai_crm';
const COLLECTION_ID = 'properties';

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createAttributeSafe(createFn: () => Promise<any>, name: string) {
  try {
    await createFn();
    console.log(`✅ Attribute created: ${name}`);
    await sleep(400);
  } catch (error: any) {
    if (error?.code === 409 || error?.message?.includes('already exists')) {
      console.log(`ℹ️ Attribute already exists: ${name}`);
    } else {
      console.error(`⚠️ Error creating attribute ${name}:`, error.message || error);
    }
  }
}

async function setupProperties() {
  console.log('--- 🏠 Setting up "properties" collection in Appwrite ---');

  // 1. Check or create collection
  try {
    await databases.getCollection(DATABASE_ID, COLLECTION_ID);
    console.log('✅ Collection "properties" already exists.');
  } catch (error: any) {
    if (error?.code === 404) {
      console.log('Creating "properties" collection...');
      await databases.createCollection(
        DATABASE_ID,
        COLLECTION_ID,
        'Properties & Listings',
        [
          Permission.read(Role.any()),
          Permission.create(Role.users()),
          Permission.update(Role.users()),
          Permission.delete(Role.users()),
        ]
      );
      console.log('✅ Collection "properties" created successfully.');
      await sleep(1000);
    } else {
      throw error;
    }
  }

  // 2. Create Attributes
  console.log('Creating attributes for properties...');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'title', 255, true), 'title');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'type', 100, true), 'type');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'location', 255, true), 'location');
  await createAttributeSafe(() => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'bedrooms', false), 'bedrooms');
  await createAttributeSafe(() => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'bathrooms', false), 'bathrooms');
  await createAttributeSafe(() => databases.createIntegerAttribute(DATABASE_ID, COLLECTION_ID, 'price', true), 'price');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'status', 100, true), 'status');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'description', 2000, false), 'description');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'amenities', 1000, false), 'amenities');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'virtualTourUrl', 1000, false), 'virtualTourUrl');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'builder', 255, false), 'builder');
  await createAttributeSafe(() => databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'possessionDate', 255, false), 'possessionDate');

  console.log('⏳ Waiting 5 seconds for Appwrite attribute provisioning to settle...');
  await sleep(5000);

  // 3. Seed Sample Luxury Properties
  console.log('--- 🌱 Seeding 6 Luxury Dubai Properties ---');

  const sampleProperties = [
    {
      title: 'Burj Crown 3BHK Luxury Penthouse',
      type: 'penthouse',
      location: 'Downtown Dubai',
      bedrooms: 3,
      bathrooms: 4,
      price: 2850000,
      status: 'available',
      description: 'Stunning panoramic Burj Khalifa and Dubai Fountain views. Includes private elevator access, custom marble flooring, and smart home automation.',
      amenities: 'Private Pool, Rooftop Gym, 24/7 Concierge, Private Elevator, Smart Home',
      virtualTourUrl: 'https://www.youtube.com/watch?v=5qanlhqt-uQ',
      builder: 'Emaar Properties',
      possessionDate: 'Ready to move'
    },
    {
      title: 'Palm Jumeirah Signature Beachfront Villa',
      type: 'villa',
      location: 'Palm Jumeirah',
      bedrooms: 5,
      bathrooms: 6,
      price: 14500000,
      status: 'available',
      description: 'Ultra-luxury signature beachfront villa located on Frond G with direct private beach access, infinity swimming pool, landscaped garden, and driver quarters.',
      amenities: 'Private Beach, Infinity Pool, Cinema Room, Staff Quarters, BBQ Deck',
      virtualTourUrl: 'https://www.youtube.com/watch?v=K4TOrB7at0Y',
      builder: 'Nakheel',
      possessionDate: 'Ready to move'
    },
    {
      title: 'Dubai Hills Estate 4BHK Golf Park Villa',
      type: 'villa',
      location: 'Dubai Hills Estate',
      bedrooms: 4,
      bathrooms: 5,
      price: 4900000,
      status: 'available',
      description: 'Overlooking the championship golf course with expansive floor-to-ceiling glass windows, contemporary architecture, and lush private gardens.',
      amenities: 'Championship Golf Course View, Private Pool, Clubhouse Access, Park, Tennis Courts',
      virtualTourUrl: 'https://www.youtube.com/watch?v=Cq21sS6d3nI',
      builder: 'Emaar Properties',
      possessionDate: 'Q4 2026'
    },
    {
      title: 'Marina Gate 2BHK Waterfront Apartment',
      type: 'apartment',
      location: 'Dubai Marina',
      bedrooms: 2,
      bathrooms: 3,
      price: 1850000,
      status: 'available',
      description: 'High-floor waterfront apartment overlooking Dubai Marina yacht club with ultra-modern finishings and direct access to Marina Walk.',
      amenities: 'Infinity Pool Overlooking Marina, State-of-the-art Gym, Steam Room, Covered Parking',
      virtualTourUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      builder: 'Select Group',
      possessionDate: 'Ready to move'
    },
    {
      title: 'Arabian Ranches III Modern 3BHK Townhouse',
      type: 'townhouse',
      location: 'Arabian Ranches III',
      bedrooms: 3,
      bathrooms: 4,
      price: 2150000,
      status: 'available',
      description: 'Family-friendly gated community living featuring modern minimalist design, private backyard, and community clubhouse access.',
      amenities: 'Lazy River, Splash Park, Clubhouse, Kids Play Area, BBQ Stations',
      virtualTourUrl: 'https://www.youtube.com/watch?v=5qanlhqt-uQ',
      builder: 'Emaar Properties',
      possessionDate: 'Q2 2026'
    },
    {
      title: 'Business Bay Commercial Tower Office Floor',
      type: 'commercial',
      location: 'Business Bay',
      bedrooms: 0,
      bathrooms: 4,
      price: 6500000,
      status: 'available',
      description: 'Full-floor grade-A commercial office space overlooking Dubai Canal with 12 dedicated VIP parking spaces and fitted executive boardroom.',
      amenities: 'Grade-A Fitted, Canal View, 12 Parking Spaces, High Speed Elevators, 24/7 Security',
      virtualTourUrl: 'https://www.youtube.com/watch?v=Cq21sS6d3nI',
      builder: 'Omniyat',
      possessionDate: 'Ready to move'
    }
  ];

  // Check existing properties to avoid duplicate seeding
  const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
  const existingTitles = new Set(existing.documents.map(d => d.title));

  for (const prop of sampleProperties) {
    if (existingTitles.has(prop.title)) {
      console.log(`ℹ️ Property already exists: ${prop.title}`);
      continue;
    }
    console.log(`Creating property: ${prop.title}...`);
    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      prop
    );
    console.log(`✅ Seeded: ${prop.title}`);
  }

  console.log('🎉 Properties setup & seeding complete!');
}

setupProperties().catch(err => {
  console.error('❌ Error setting up properties collection:', err);
  process.exit(1);
});
