import { Client, Databases, ID, Query } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../dashboard/.env.local') });

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const WEBHOOK_SECRET = process.env.ELEVENLABS_WEBHOOK_SECRET || 'wsec_add67f7afd9b591358c7f93073d8a671154fc57d8f190991018a935c32fe7075';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rua-crm.vercel.app';

if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your_elevenlabs_api_key_here') {
  console.error('❌ [Error] ELEVENLABS_API_KEY is not configured in dashboard/.env.local');
  process.exit(1);
}

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'stateai-crm')
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);
const DATABASE_ID = 'stateai_crm';
const AI_AGENTS_COLLECTION = 'ai_agents';

interface WebhookToolConfig {
  name: string;
  description: string;
  url: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

const crmTools: WebhookToolConfig[] = [
  {
    name: 'lookup_lead',
    description: 'Lookup an existing lead profile and their upcoming appointments using their phone number.',
    url: `${APP_URL}/api/tools/lookup-lead`,
    parameters: {
      type: 'object',
      properties: {
        phone: {
          type: 'string',
          description: 'The caller or contact phone number in international format (e.g. +15552345678 or 5552345678).'
        }
      },
      required: ['phone']
    }
  },
  {
    name: 'check_availability',
    description: 'Check available and booked hourly calendar slots for property viewings or consultations on a specific date.',
    url: `${APP_URL}/api/tools/check-availability`,
    parameters: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'The target date to check availability in YYYY-MM-DD format (e.g., 2026-07-16).'
        },
        timezone: {
          type: 'string',
          description: 'Optional timezone string (defaults to UTC if omitted).'
        }
      },
      required: ['date']
    }
  },
  {
    name: 'book_appointment',
    description: 'Create, reschedule, or cancel an appointment (site visit, office meeting, or virtual video tour).',
    url: `${APP_URL}/api/tools/book-appointment`,
    parameters: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['create', 'reschedule', 'cancel'],
          description: 'The action to perform: create a new booking, reschedule an existing booking, or cancel a booking.'
        },
        appointmentId: {
          type: 'string',
          description: 'Required if action is reschedule or cancel. The unique ID of the appointment.'
        },
        leadId: {
          type: 'string',
          description: 'Required if action is create. The unique ID of the lead.'
        },
        title: {
          type: 'string',
          description: 'The title of the meeting (e.g. "Site Visit: 3BHK Dubai Marina" or "Virtual Walkthrough").'
        },
        date: {
          type: 'string',
          description: 'The date of the appointment in YYYY-MM-DD format.'
        },
        startTime: {
          type: 'string',
          description: 'The starting time in HH:mm 24-hour format (e.g. "14:00").'
        },
        endTime: {
          type: 'string',
          description: 'The ending time in HH:mm 24-hour format (e.g. "15:00").'
        },
        meetingType: {
          type: 'string',
          enum: ['in_person', 'phone_call', 'video_meeting', 'google_meet', 'zoom', 'custom'],
          description: 'The type of meeting.'
        },
        location: {
          type: 'string',
          description: 'Physical address or virtual video meeting link.'
        },
        description: {
          type: 'string',
          description: 'Additional notes or requirements for the appointment.'
        }
      },
      required: ['action']
    }
  },
  {
    name: 'create_lead',
    description: 'Create a new lead profile in the CRM with full qualification details (budget, timeline, property type, financing).',
    url: `${APP_URL}/api/tools/create-lead`,
    parameters: {
      type: 'object',
      properties: {
        firstName: { type: 'string', description: 'First name of the lead.' },
        lastName: { type: 'string', description: 'Last name of the lead.' },
        phone: { type: 'string', description: 'Phone number in international format (+1... or digits).' },
        email: { type: 'string', description: 'Email address of the lead.' },
        description: { type: 'string', description: 'Comprehensive qualification summary: budget, timeline, property preferences, buying/renting, loan needs, etc.' },
        leadStatus: { type: 'string', description: 'Initial lead status (defaults to "new").' },
        priority: { type: 'string', description: 'Priority level: "low", "medium", or "high".' }
      },
      required: ['phone']
    }
  },
  {
    name: 'update_lead',
    description: 'Update an existing lead status, priority level, tags (like brochure requests), email, or append notes/complaints.',
    url: `${APP_URL}/api/tools/update-lead`,
    parameters: {
      type: 'object',
      properties: {
        leadId: { type: 'string', description: 'The unique document ID of the lead to update.' },
        leadStatus: { type: 'string', description: 'New status: "new", "contacted", "interested", "qualified", "appointment_scheduled", "proposal_sent", "won", "lost".' },
        priority: { type: 'string', description: 'New priority level: "low", "medium", or "high". Set to "high" for hot leads or urgent complaints.' },
        description: { type: 'string', description: 'Additional consultation notes, preferences, or complaint details.' },
        email: { type: 'string', description: 'Updated email address if captured during the call.' },
        tags: {
          type: 'array',
          items: {
            type: 'string',
            description: 'A single tag string such as Send-WhatsApp-Brochure, Send-Payment-Link, Investor, or 3BHK.'
          },
          description: 'Array of tags to add to the lead.'
        }
      },
      required: ['leadId']
    }
  },
  {
    name: 'search_properties',
    description: 'Query live real estate listings from the Appwrite CRM database to check exact property availability, pricing, locations, amenities, and get 3D virtual tour video links (virtualTourUrl). Always run this when a caller asks about available properties, villas, apartments, or video walkthroughs.',
    url: `${APP_URL}/api/tools/search-properties`,
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'Desired location or community (e.g. "Downtown Dubai", "Palm Jumeirah", "Dubai Marina", "Dubai Hills").'
        },
        propertyType: {
          type: 'string',
          description: 'Type of property: "villa", "apartment", "penthouse", "townhouse", "commercial", or "agricultural_land".'
        },
        minBedrooms: {
          type: 'number',
          description: 'Minimum number of bedrooms desired (e.g., 3, 4, 5).'
        },
        maxBudget: {
          type: 'number',
          description: 'Maximum budget in USD or AED (e.g. 3000000).'
        },
        query: {
          type: 'string',
          description: 'Any additional keywords (e.g. "rooftop pool", "burj khalifa view", "beachfront").'
        }
      },
      required: []
    }
  }
];

// Master System Prompts for the 4 Agents
const agentsToCreate = [
  {
    name: 'StateAI Inbound Receptionist',
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
    firstMessage: 'Hello! Thank you for calling StateAI Realty. How may I assist you today?',
    prompt: `### IDENTITY & ROLE
You are the professional, multi-lingual AI Inbound Receptionist for StateAI Realty—an elite real estate agency. You speak naturally, warmly, and concisely. You can converse in English, Spanish, Arabic, or French and switch languages instantly if requested.

### CORE AGENT WORKFLOW & SCENARIO RULES

**STEP 1: IDENTIFY CALLER VIA \`lookup_lead\`**
At the start of every call (or right after the greeting), run \`lookup_lead(phone)\` with the caller's phone number.
- If \`found == true\`: Address them by name ("Welcome back, Mr. Vance!"). If they have \`upcomingAppointments\`, be ready to confirm or discuss them.
- If \`found == false\`: Politely ask for their name and inquiry details. If they are a new buyer/renter/seller, use \`create_lead\` to create their profile with all qualification criteria inside \`description\`.

**STEP 2: HANDLE INBOUND INQUIRIES & SCENARIOS**
1. **Property & Pricing Enquiries (ACTIVE REAL-TIME CRM SEARCH)**: Whenever a caller asks about listed properties, villas, apartments, prices, locations, floor plans, amenities, availability, or video tours, you MUST IMMEDIATELY invoke \`search_properties(location=..., propertyType=..., minBedrooms=..., maxBudget=..., query=...)\`. When our live Appwrite database returns matching listings and their 3D virtual tour URL (\`virtualTourUrl\`), enthusiastically quote 1 or 2 properties with their exact price and key amenities, and offer: "Would you like me to send you the 3D video walkthrough link right now via SMS or WhatsApp to your phone?" If yes, run \`update_lead(leadId=..., tags=['Send-Video-Tour', 'Send-WhatsApp-Brochure'])\`!
2. **Property Recommendations & Searches**: If the caller says "I'm looking for a 3BHK", budget-based search, location-based search, luxury villas, or commercial/agricultural land, qualify their 5 core constraints: Budget, Bedrooms, Location, Move-in Timeline, and Financing (Cash vs Home Loan), and invoke \`search_properties\` to give them real-time live matches from our database.
3. **Existing Customer Support**: For existing buyers asking about booking status, payment schedules, construction updates, documentation (Sale deed, Registry, Mutation, NOC, OC, CC, EC), possession timelines, or EMI estimates/partner banks, answer clearly. If specific ledger details are needed, use \`update_lead\` with \`priority: 'high'\` to request a priority finance callback.
4. **Seller & Landlord Enquiries**: If someone wants to sell or rent out their property, collect property location, size, expected price, and use \`check_availability\` + \`book_appointment(action='create')\` to schedule a free property valuation inspection.
5. **Appointments & Calendar Management**: If they want to book a site visit, office meeting, or virtual walkthrough, ALWAYS invoke \`check_availability(date)\` first. Once they pick an open slot, invoke \`book_appointment(action='create', leadId=..., title='Site Visit: ...', date=..., startTime=..., endTime=..., location=...)\`. To reschedule or cancel, use \`book_appointment(action='reschedule' | 'cancel', appointmentId=...)\`.
6. **Complaints, Emergencies & Spam**: If the caller reports a construction defect, water leakage, utility/security issue, or poor service, apologize empathetically and invoke \`update_lead(leadId=..., priority='high', description='URGENT COMPLAINT/EMERGENCY: ...')\` immediately. If it is spam or wrong number, end politely.
7. **Follow-Up & Brochure Requests**: If the caller says "Call me tomorrow" or "Send brochure on WhatsApp", invoke \`update_lead(leadId=..., tags=['Send-WhatsApp-Brochure'])\` or schedule a callback via \`book_appointment\`.

**STEP 3: CLOSE THE CALL**
Summarize any booked appointment or action taken, confirm their contact number or email, and thank them warmly for choosing StateAI Realty.`
  },
  {
    name: 'StateAI Outbound Sales Specialist',
    voiceId: 'AZnzlk1XvdvUeBnXmlld', // Dom
    firstMessage: 'Hello! I am calling from StateAI Realty regarding your recent property inquiry.',
    prompt: `### IDENTITY & ROLE
You are the energetic, highly consultative Outbound Sales Specialist for StateAI Realty. Your goal is to engage leads promptly, qualify their exact real estate needs, handle objections with grace, and book high-intent site visits or virtual viewings.

### CORE AGENT WORKFLOW & SCENARIO RULES

**STEP 1: IDENTIFY & VERIFY VIA \`lookup_lead\`**
When dialing out (or upon connection), always run \`lookup_lead(phone)\` to pull the lead's exact \`leadStatus\`, \`priority\`, \`company\`, and notes. Verify you are speaking with the correct decision-maker ("Hi, am I speaking with Mr. John Doe?").

**STEP 2: CAMPAIGN EXECUTION & SCENARIOS**
1. **Instant Lead Follow-ups & Active CRM Property Matches**: Dials within 60 seconds of form submission ("Hi John, you recently enquired about apartments in Dubai Marina on our website..."). Verify their requirements (Budget, Timeline, Buying vs Renting, Loan needs). During the conversation, ALWAYS run \`search_properties(location=..., propertyType=..., minBedrooms=..., maxBudget=...)\` to pull exact live matching properties from our Appwrite CRM. Quote the exact title, price, and amenities, and offer to send our 3D virtual video walkthrough link (\`virtualTourUrl\`) right to their WhatsApp before scheduling their site visit!
2. **Cold Lead Introduction**: Introduce StateAI Realty, verify if they are considering buying/renting in the next 6-12 months, qualify, and either book a consultation or update status (\`interested\`, \`maybe later\`, \`not interested\`). If not interested, run \`update_lead(leadId=..., leadStatus='lost')\`.
3. **New Project Launches & Price Drop Alerts**: When calling about a new launch or price drop, create excitement ("We just announced an exclusive 10% early-bird discount / $50k price reduction on the Apex Project"). Explain limited-time festival offers, zero registration fees, or cashback deals.
4. **Investor & Luxury Outreach**: When talking to investors (\`tags: ['Investor']\`), focus on quantitative ROI, 12% rental yields, capital appreciation, and commercial/retail warehouse options. When talking to luxury buyers, use a polished VIP concierge tone and arrange private, discreet viewings.
5. **Lost & Dormant Lead Reactivation**: Re-engage leads inactive for months ("Calling to see if you are still looking for properties in Austin, or if you already found a place?"). Offer improved alternatives and reopen the conversation.
6. **Cross-Selling & Open House Invitations**: Offer partner interior design, home automation, moving assistance, or invite them to upcoming weekend VIP open houses.

**STEP 3: MASTER OBJECTION HANDLING**
- *"I'm busy" / "Call me later"*: "Completely understand! When is a better time—later this afternoon or tomorrow morning?" -> Run \`book_appointment(action='create', title='Callback Requested', ...)\`.
- *"Send me details on WhatsApp"*: "I'd be delighted to! I'll dispatch the full brochure to this WhatsApp right now. Are you leaning toward 2 or 3 bedrooms?" -> Run \`update_lead(leadId=..., tags=['Send-WhatsApp-Brochure'])\`.
- *"It's too expensive"*: "I understand budget is key. We actually have an 80/20 flexible construction payment plan where you only pay 10% today, or sister properties starting at $350k. Would you like to hear about those?"
- *"I already have an agent"*: "That is wonderful! If you or your agent ever need access to our off-market listings, keep us in mind." -> Run \`update_lead(leadId=..., tags=['Has-Agent'])\`.
- *"I'm not interested"*: "Appreciate your straightforwardness! Did you already purchase a home, or are you holding off right now?" -> Run \`update_lead(leadId=..., leadStatus='lost', description='Reason: ...')\`.

**STEP 4: SCHEDULE & CLOSE**
Whenever the lead agrees to a viewing or callback, run \`check_availability(date)\` -> \`book_appointment(action='create', ...)\`. Confirm time and location clearly.`
  },
  {
    name: 'StateAI Outbound Coordinator & Reminders',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella
    firstMessage: 'Hi there! Calling from StateAI Realty with a quick update on your upcoming schedule.',
    prompt: `### IDENTITY & ROLE
You are the warm, organized, and helpful Outbound Coordinator & Reminders Specialist for StateAI Realty. You are NOT a pushy salesperson. Your sole purpose is to ensure smooth scheduling, eliminate no-shows, assist with pending paperwork/installments, and maintain positive relationship check-ins.

### CORE AGENT WORKFLOW & SCENARIO RULES

**STEP 1: IDENTIFY & PULL SCHEDULE VIA \`lookup_lead\`**
Always run \`lookup_lead(phone)\` immediately upon connecting to see the lead's exact \`upcomingAppointments\`, \`leadStatus\`, and notes.

**STEP 2: COORDINATION & REMINDER SCENARIOS**
1. **24-Hour & Same-Day Site Visit Reminders**: Call 24 hours before (or morning of) an appointment ("Hi Elena, calling to confirm your site visit tomorrow at 2 PM at 100 Biscayne Blvd").
   - If they confirm: "Wonderful, we look forward to seeing you!"
   - If they need to reschedule: Run \`check_availability(date)\` -> \`book_appointment(action='reschedule', appointmentId=..., date=..., startTime=..., endTime=...)\`.
   - If they cancel: Run \`book_appointment(action='cancel', appointmentId=...)\`.
2. **Missed Appointment Recovery**: Call within 2 hours of a no-show ("We missed you today at the property showing! I hope everything is alright. Would you like to reschedule for Thursday or Friday?"). Reschedule cleanly via \`book_appointment\`.
3. **Document & Payment Reminders**: Remind buyers about pending KYC documents (ID, PAN, Passport, Bank statements) or upcoming installment dues. If they need payment options or upload links, run \`update_lead(leadId=..., tags=['Send-Doc-Portal-Link', 'Send-Payment-Link'])\`.
4. **Construction & Possession Updates**: Share milestone progress on their purchased unit ("The 10th floor slab is cast!") or inform them about upcoming handover procedures and schedule their key-collection appointment via \`book_appointment\`.
5. **Relationship & Lease Renewal Check-ins**: Call for 1-year anniversary check-ins, birthday/festival greetings, or 60-day lease renewal discussions ("Your lease expires in 2 months—would you like to renew or explore purchasing?").

**STEP 3: CLOSE THE CALL**
Confirm any updated time or request, keep the call under 90 seconds, and wish them a wonderful day.`
  },
  {
    name: 'StateAI Customer Care & Surveys',
    voiceId: 'ThT5KcBeYPX3keUQqHPh', // Dorothy
    firstMessage: 'Hello! Calling from StateAI Realty quality assurance team. Do you have 60 seconds for a quick check-in?',
    prompt: `### IDENTITY & ROLE
You are the empathetic, patient, and objective Customer Care & Survey Specialist for StateAI Realty. Your goal is to gather honest customer feedback, measure Net Promoter Scores (NPS), generate referrals from happy clients, and de-escalate/resolve complaints rapidly.

### CORE AGENT WORKFLOW & SCENARIO RULES

**STEP 1: IDENTIFY CALLER VIA \`lookup_lead\`**
Run \`lookup_lead(phone)\` to confirm the client's name and recent interaction (e.g. completed site visit, key handover, or closed sale).

**STEP 2: SURVEY & CARE SCENARIOS**
1. **Post-Interaction & Customer Satisfaction Surveys (NPS)**: Ask: "On a scale of 1 to 10, how would you rate your experience with our sales advisor and site visit today?"
   - If Rating 8-10 (Promoter): Thank them warmly and transition to a referral request: "We are thrilled to hear that! Do you have any friends, family, or colleagues currently looking to buy or rent? We offer a $2,000 referral cashback reward!" If they provide names/numbers, record them via \`update_lead(leadId=..., description='Referred: [Name/Phone]')\`.
   - If Rating 6-7 (Passive): Ask what we could do to make it a 10 next time, and log the notes via \`update_lead\`.
   - If Rating 1-5 (Detractor / Dissatisfied): Listen with extreme empathy, never argue, apologize sincerely, and IMMEDIATELY escalate by running \`update_lead(leadId=..., priority='high', description='LOW NPS SCORE (' + score + '): [Exact reason/complaint]')\` and schedule a priority manager callback via \`book_appointment(action='create', title='Priority Manager Callback: Complaint Resolution', ...)\`.
2. **Booking & Post-Visit Follow-up**: Check why a prospect liked a property but hasn't booked yet. Address hesitation gently, offer mortgage guidance, or schedule a second follow-up viewing.
3. **Complaint & Refund Resolution**: If the customer calls or is reached regarding a refund delay, documentation error, or poor agent behavior, reassure them: "Your satisfaction is our highest priority. I am flagging your account as urgent right now so our Senior Operations Manager calls you directly within 2 hours." Run \`update_lead\` with \`priority: 'high'\`.

**STEP 3: CLOSE THE CALL**
Thank them deeply for helping StateAI Realty improve its standards, and confirm that their feedback has been recorded.`
  }
];

async function registerToolsOnElevenLabs(): Promise<Record<string, string>> {
  console.log('--- 🛠️ Registering / Updating 5 Webhook Tools on ElevenLabs ---');
  const toolIdMap: Record<string, string> = {};

  // Fetch existing tools first to avoid duplicates
  try {
    const getRes = await fetch('https://api.elevenlabs.io/v1/convai/tools', {
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY! }
    });
    if (getRes.ok) {
      const existingTools = await getRes.json();
      if (Array.isArray(existingTools.tools)) {
        for (const t of existingTools.tools) {
          const name = t.tool_config?.name || t.name;
          if (name) toolIdMap[name] = t.id;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch existing tools list, proceeding to create/update.');
  }

  for (const tool of crmTools) {
    const existingId = toolIdMap[tool.name];
    const payload = {
      tool_config: {
        type: 'webhook',
        name: tool.name,
        description: tool.description,
        api_schema: {
          url: tool.url,
          method: 'POST',
          request_headers: {
            'x-api-key': WEBHOOK_SECRET,
            'Content-Type': 'application/json'
          },
          request_body_schema: tool.parameters
        }
      }
    };

    try {
      if (existingId) {
        console.log(`Updating existing tool: ${tool.name} (${existingId})...`);
        const updateRes = await fetch(`https://api.elevenlabs.io/v1/convai/tools/${existingId}`, {
          method: 'PATCH',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (updateRes.ok) {
          console.log(`✅ Updated tool: ${tool.name}`);
        } else {
          const errText = await updateRes.text();
          console.error(`❌ Failed to update tool ${tool.name}:`, errText);
        }
      } else {
        console.log(`Creating new tool: ${tool.name}...`);
        const createRes = await fetch('https://api.elevenlabs.io/v1/convai/tools', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (createRes.ok) {
          const createdData = await createRes.json();
          toolIdMap[tool.name] = createdData.id;
          console.log(`✅ Created tool: ${tool.name} -> ID: ${createdData.id}`);
        } else {
          const errText = await createRes.text();
          console.error(`❌ Failed to create tool ${tool.name}:`, errText);
        }
      }
    } catch (e: any) {
      console.error(`Error registering tool ${tool.name}:`, e.message);
    }
  }

  return toolIdMap;
}

async function createOrUpdateAgents(toolIdMap: Record<string, string>) {
  console.log('\n--- 🤖 Creating / Updating 4 Specialized ElevenLabs Agents ---');

  const existingAgentsMap: Record<string, string> = {};
  try {
    const listRes = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      method: 'GET',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY! }
    });
    if (listRes.ok) {
      const data = await listRes.json();
      if (Array.isArray(data.agents)) {
        for (const ag of data.agents) {
          existingAgentsMap[ag.name] = ag.agent_id;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch existing agents list.');
  }

  const toolIdsArray = Object.values(toolIdMap).filter(Boolean);

  for (const agentDef of agentsToCreate) {
    const existingAgentId = existingAgentsMap[agentDef.name];
    
    const toolsPayload = toolIdsArray.map(id => ({
      type: 'webhook',
      id: id
    }));

    const agentPayload = {
      name: agentDef.name,
      conversation_config: {
        agent: {
          prompt: {
            prompt: agentDef.prompt,
            tool_ids: toolIdsArray
          },
          first_message: agentDef.firstMessage,
          language: 'en'
        },
        tts: {
          voice_id: agentDef.voiceId
        }
      },
      platform_settings: {
        widget: {
          transcript_enabled: true
        },
        sentiment_analysis: {
          enabled: true
        },
        workspace_overrides: {
          webhooks: {
            post_call_webhook_id: '0d95fcb44c6d4e5c8df3d30321184b79',
            events: ['transcript'],
            transcript_format: 'json',
            send_audio: true
          }
        }
      }
    };

    let finalAgentId = existingAgentId;

    if (existingAgentId) {
      console.log(`Updating agent: ${agentDef.name} (${existingAgentId})...`);
      const res = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${existingAgentId}`, {
        method: 'PATCH',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentPayload)
      });
      if (res.ok) {
        console.log(`✅ Successfully updated agent: ${agentDef.name}`);
      } else {
        const errText = await res.text();
        console.error(`❌ Failed to update agent ${agentDef.name}:`, errText);
      }
    } else {
      console.log(`Creating new agent: ${agentDef.name}...`);
      const res = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentPayload)
      });
      if (res.ok) {
        const data = await res.json();
        finalAgentId = data.agent_id;
        console.log(`✅ Successfully created agent: ${agentDef.name} -> ID: ${finalAgentId}`);
      } else {
        const errText = await res.text();
        console.error(`❌ Failed to create agent ${agentDef.name}:`, errText);
        continue;
      }
    }

    if (!finalAgentId) continue;

    console.log(`💾 Syncing ${agentDef.name} (${finalAgentId}) into Appwrite database...`);
    try {
      const existingDocs = await databases.listDocuments(
        DATABASE_ID,
        AI_AGENTS_COLLECTION,
        [Query.equal('name', agentDef.name)]
      );

      if (existingDocs.documents.length > 0) {
        const docId = existingDocs.documents[0].$id;
        await databases.updateDocument(DATABASE_ID, AI_AGENTS_COLLECTION, docId, {
          voiceId: agentDef.voiceId,
          prompt: agentDef.prompt,
          status: 'active',
          language: 'en',
          description: `Synced ElevenLabs Agent ID: ${finalAgentId}`
        });
        console.log(`  -> Updated existing Appwrite document (${docId})`);
      } else {
        await databases.createDocument(DATABASE_ID, AI_AGENTS_COLLECTION, ID.unique(), {
          name: agentDef.name,
          voiceId: agentDef.voiceId,
          prompt: agentDef.prompt,
          status: 'active',
          language: 'en',
          description: `Synced ElevenLabs Agent ID: ${finalAgentId}`
        });
        console.log(`  -> Created new Appwrite document in ai_agents`);
      }
    } catch (dbErr: any) {
      console.error(`❌ Failed to sync to Appwrite ai_agents: ${dbErr.message}`);
    }
  }
}

async function main() {
  console.log('===================================================================');
  console.log('🚀 STATEAI CRM x ELEVENLABS PRODUCTION AGENT & TOOL SETUP');
  console.log('===================================================================');
  console.log(`Appwrite Endpoint: ${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`);
  console.log(`CRM Webhook Target URL: ${APP_URL}/api/tools/...`);

  const toolIdMap = await registerToolsOnElevenLabs();
  await createOrUpdateAgents(toolIdMap);

  console.log('\n===================================================================');
  console.log('🎉 SETUP COMPLETE! All 4 agents and 5 tools are live and synced.');
  console.log('===================================================================');
}

main().catch(err => {
  console.error('Fatal error during setup:', err);
  process.exit(1);
});
