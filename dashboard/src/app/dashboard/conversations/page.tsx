import { Metadata } from 'next';
import { ConversationTable } from '@/features/conversations/components/conversation-list/conversation-table';

export const metadata: Metadata = {
  title: 'Conversation Center - StateAI CRM',
  description: 'Unified inbox for all calls, emails, and SMS interactions',
};

export default function ConversationsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversation Center</h1>
        <p className="text-muted-foreground">
          View all interactions, including AI agent calls, transcripts, and recordings.
        </p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <ConversationTable />
      </div>
    </div>
  );
}
