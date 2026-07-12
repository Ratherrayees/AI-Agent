# StateAI CRM

StateAI CRM is an enterprise-grade Customer Relationship Management system built explicitly to integrate seamlessly with AI agents (specifically ElevenLabs Voice AI). 

It features an event-driven architecture, modular Feature-First design, and robust role-based access control.

## 🚀 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Styling**: Tailwind CSS, `shadcn/ui`, Radix UI
- **State Management**: TanStack Query (React Query)
- **Backend & DB**: Appwrite (BaaS)
- **Authentication**: Appwrite Auth (Email/Password, OAuth ready)
- **Data Visualization**: Recharts
- **Validation**: Zod & React Hook Form

## 📁 Architecture Overview

The application follows a **Feature-First Architecture**. Instead of grouping by technical concern (e.g., all components in one folder, all hooks in another), code is grouped by feature domain.

For a deeper dive, please read the [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- Appwrite Instance (Local or Cloud)

### Environment Variables
Create a `.env.local` file in the `dashboard/` directory:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=stateai_crm
```

### Installation
```bash
cd dashboard
npm install
npm run dev
```

## 🤖 AI Agent Integration
This CRM is built so AI Agents can operate it autonomously via standard HTTP tool endpoints.
1. Generate an API Key via `/dashboard/integrations/api`.
2. Configure your ElevenLabs Agent to use HTTP tools pointing to the CRM's Appwrite Functions.
3. The Agent can automatically fetch Leads, book Appointments, and read Campaign scripts.

## 🔒 Security
- **RBAC**: Handled dynamically at the UI level in `navigation.ts` and enforced securely via Appwrite Collection-level permissions.
- **Strict Headers**: `next.config.ts` forces HSTS, X-Frame-Options, and disables DNS prefetching.
