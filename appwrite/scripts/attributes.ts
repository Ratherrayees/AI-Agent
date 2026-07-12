import { Databases } from 'node-appwrite';

const DATABASE_ID = 'stateai_crm';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createAttribute(
  databases: Databases,
  collectionId: string,
  key: string,
  type: 'string' | 'integer' | 'double' | 'boolean' | 'datetime' | 'enum' | 'email' | 'url',
  size: number = 255,
  required: boolean = false,
  array: boolean = false,
  elements?: string[], // for enums
  defaultVal?: any
) {
  try {
    // Check if exists first (this is hard to do without fetching the collection and parsing attributes,
    // so we just try to create and catch the 409 Conflict)
    switch (type) {
      case 'string':
        await databases.createStringAttribute(DATABASE_ID, collectionId, key, size, required, defaultVal, array);
        break;
      case 'integer':
        await databases.createIntegerAttribute(DATABASE_ID, collectionId, key, required, 0, 9999999999, defaultVal, array);
        break;
      case 'double':
        await databases.createFloatAttribute(DATABASE_ID, collectionId, key, required, 0, 9999999999, defaultVal, array);
        break;
      case 'boolean':
        await databases.createBooleanAttribute(DATABASE_ID, collectionId, key, required, defaultVal, array);
        break;
      case 'datetime':
        await databases.createDatetimeAttribute(DATABASE_ID, collectionId, key, required, defaultVal, array);
        break;
      case 'enum':
        await databases.createEnumAttribute(DATABASE_ID, collectionId, key, elements || [], required, defaultVal, array);
        break;
      case 'email':
        await databases.createEmailAttribute(DATABASE_ID, collectionId, key, required, defaultVal, array);
        break;
      case 'url':
        await databases.createUrlAttribute(DATABASE_ID, collectionId, key, required, defaultVal, array);
        break;
    }
    console.log(`Created attribute [${type}]: ${collectionId}.${key}`);
    // Wait for the attribute to be available before creating the next one
    await sleep(2000); 
  } catch (error: any) {
    if (error.code === 409) {
      console.log(`Attribute already exists: ${collectionId}.${key}`);
    } else {
      console.error(`Failed to create attribute ${collectionId}.${key}:`, error.message);
      throw error;
    }
  }
}

export async function setupLeadAttributes(databases: Databases) {
  const c = 'leads';
  await createAttribute(databases, c, 'firstName', 'string', 100, true);
  await createAttribute(databases, c, 'lastName', 'string', 100, true);
  await createAttribute(databases, c, 'company', 'string', 100, false);
  await createAttribute(databases, c, 'jobTitle', 'string', 100, false);
  await createAttribute(databases, c, 'phone', 'string', 20, true);
  await createAttribute(databases, c, 'email', 'email', 255, false);
  await createAttribute(databases, c, 'website', 'url', 255, false);
  await createAttribute(databases, c, 'address', 'string', 255, false);
  await createAttribute(databases, c, 'city', 'string', 100, false);
  await createAttribute(databases, c, 'state', 'string', 100, false);
  await createAttribute(databases, c, 'country', 'string', 100, false);
  await createAttribute(databases, c, 'postalCode', 'string', 20, false);
  await createAttribute(databases, c, 'leadSource', 'string', 100, false);
  await createAttribute(databases, c, 'leadStatus', 'enum', 0, false, false, 
    ['new', 'contacted', 'interested', 'qualified', 'appointment_scheduled', 'proposal_sent', 'won', 'lost', 'archived'], 'new');
  await createAttribute(databases, c, 'priority', 'enum', 0, false, false, ['low', 'medium', 'high']);
  await createAttribute(databases, c, 'assignedUserId', 'string', 36, false);
  await createAttribute(databases, c, 'description', 'string', 5000, false);
  await createAttribute(databases, c, 'tags', 'string', 36, false, true); // array of tag IDs
  await createAttribute(databases, c, 'appointmentsCount', 'integer', 0, false, false, undefined, 0);
}
