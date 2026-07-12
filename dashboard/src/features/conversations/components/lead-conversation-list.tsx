'use client';

import { useLeadConversations } from '../hooks/use-conversations';
import { Loader2, MessageSquare, PlayCircle, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ConversationStatusBadge, ConversationTypeIcon } from './conversation-badges';
import Link from 'next/link';

interface LeadConversationListProps {
  leadId: string;
}

export function LeadConversationList({ leadId }: LeadConversationListProps) {
  const { data: conversations, isLoading } = useLeadConversations(leadId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Conversation History</h3>
        {/* We generally wouldn't manually create a conversation here, usually handled by ElevenLabs, but could add a "Log Call" button later */}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : conversations && conversations.length > 0 ? (
        <div className="grid gap-4">
          {conversations.map((conv) => (
            <div key={conv.$id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full shrink-0">
                    <ConversationTypeIcon type={conv.type} direction={conv.direction} />
                  </div>
                  <div>
                    <h4 className="font-medium capitalize">
                      {conv.type.replace('_', ' ')}
                      {conv.agentId && (
                        <span className="ml-2 inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          <Bot className="h-3 w-3 mr-1" />
                          AI Agent
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(conv.$createdAt), 'MMM d, yyyy h:mm a')}
                      {conv.durationSeconds ? ` • ${Math.floor(conv.durationSeconds / 60)}m ${conv.durationSeconds % 60}s` : ''}
                    </p>
                  </div>
                </div>
                <ConversationStatusBadge status={conv.status} />
              </div>

              {conv.aiSummary && (
                <div className="mt-2 text-sm bg-muted/50 p-3 rounded border border-border/50">
                  <span className="font-medium mb-1 block">AI Summary</span>
                  {conv.aiSummary}
                </div>
              )}

              <div className="flex gap-2 mt-2">
                {conv.recordingUrl && (
                  <a href={conv.recordingUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                    <Button variant="secondary" size="sm" className="w-full h-full">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Play Recording
                    </Button>
                  </a>
                )}
                {conv.transcript && (
                  <Link href={`/dashboard/conversations/${conv.$id}`} className="w-full h-full">
                    <Button variant="secondary" size="sm" className="w-full h-full">
                      View details
                    </Button>
                  </Link>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed flex flex-col items-center justify-center">
          <MessageSquare className="h-8 w-8 mb-4 text-muted-foreground/50" />
          <p className="font-medium">No conversations recorded yet</p>
          <p className="text-sm">Calls handled by the AI agent will appear here automatically.</p>
        </div>
      )}
    </div>
  );
}
