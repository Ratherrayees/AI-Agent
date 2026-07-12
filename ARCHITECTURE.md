# StateAI CRM Architecture

This document explains the architectural decisions, folder structures, and data flows of the StateAI CRM.

## 1. Feature-First Directory Structure

We use a domain-driven "Feature-First" folder structure inside `src/features/`.
This keeps related code highly cohesive and scalable.

```
src/
  app/              # Next.js App Router (Pages & Layouts)
  components/       # Global UI components (shadcn/ui, layouts)
  constants/        # Global constants (navigation, roles)
  lib/              # Utility functions, Appwrite client initialization
  providers/        # Global React Context providers (Auth, Query)
  features/         # Domain-driven features
    auth/           # Authentication logic
    leads/          # Lead management (CRUD, Kanban)
    appointments/   # Calendar & scheduling
    campaigns/      # Outbound dialing campaigns
    conversations/  # Call transcripts & audio
    analytics/      # Dashboards & KPI charts
    integrations/   # Webhooks, API keys, 3rd-party apps
    workflows/      # Event-driven automation
    knowledge/      # AI training data catalog
    settings/       # Tenant configuration
```

Inside every feature, you will find a consistent structure:
- `components/`: UI specific to this feature.
- `services/`: Appwrite database interactions.
- `hooks/`: React Query wrappers for the services.
- `validation/`: Zod schemas and TypeScript types.

## 2. Appwrite Data Layer

StateAI CRM uses Appwrite as its BaaS.
- **Client SDK**: Used directly in the Next.js frontend (via `lib/appwrite.ts`) for real-time reads and authenticated user writes.
- **Server SDK**: Used inside Appwrite Functions to securely process Webhooks, validate API Keys, and run scheduled jobs (CRON).
- **Security**: Collections enforce Document-level and Collection-level security based on the User's Auth status.

## 3. The Automation Engine (Workflows & Webhooks)

To keep the frontend stateless and fast:
1. When an event occurs (e.g., `databases.leads.create`), Appwrite triggers an internal Function.
2. The Function checks the `workflows` collection to see if any rules match the event.
3. If a match occurs, it processes the Action (e.g., Send Email, Trigger Outbound Webhook).
4. Errors and executions are logged to the `system_jobs` and `webhook_logs` collections.

## 4. UI / UX Philosophy

- **shadcn/ui**: Used as the base component library. Components are owned by the repository (in `src/components/ui/`) rather than an NPM package, allowing total customization.
- **Client Components**: Because of React Query and heavy interactivity, most feature components use `"use client"`. Server components are reserved for top-level Page layouts for metadata and basic HTML shell rendering.
- **Empty States & Skeletons**: Every list or table implements a loading skeleton and a helpful empty state with a call-to-action to maximize UX.
