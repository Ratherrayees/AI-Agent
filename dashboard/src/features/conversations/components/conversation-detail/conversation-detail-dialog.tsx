'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Conversation } from '@/types';
import { format } from 'date-fns';
import { ConversationStatusBadge, ConversationTypeIcon } from '../conversation-badges';
import { PlayCircle, Download, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ConversationDetailDialogProps {
  conversation: Conversation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConversationDetailDialog({
  conversation,
  open,
  onOpenChange,
}: ConversationDetailDialogProps) {
  if (!conversation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-muted rounded-full">
              <ConversationTypeIcon type={conversation.type} direction={conversation.direction} />
            </div>
            <div>
              <DialogTitle className="text-xl capitalize flex items-center gap-2">
                {conversation.type.replace('_', ' ')}
                {conversation.agentId && (
                  <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Handled
                  </span>
                )}
              </DialogTitle>
              <DialogDescription>
                {format(new Date(conversation.$createdAt), 'EEEE, MMMM d, yyyy • h:mm a')}
              </DialogDescription>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ConversationStatusBadge status={conversation.status} />
              <Link href={`/dashboard/leads/${conversation.leadId}`}>
                <Button variant="outline" size="sm">
                  View Lead
                </Button>
              </Link>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 py-4">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 p-4 rounded-lg">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Direction</div>
              <div className="font-medium capitalize">{conversation.direction}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Duration</div>
              <div className="font-medium">
                {conversation.durationSeconds 
                  ? `${Math.floor(conversation.durationSeconds / 60)}m ${conversation.durationSeconds % 60}s` 
                  : '-'}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Sentiment</div>
              <div className="font-medium capitalize">{conversation.sentiment || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Agent ID</div>
              <div className="font-medium text-sm truncate" title={conversation.agentId}>
                {conversation.agentId || 'Human'}
              </div>
            </div>
          </div>

          {conversation.aiSummary && (
            <div>
              <h3 className="text-sm font-semibold mb-2">AI Summary</h3>
              <div className="bg-card border rounded-lg p-4 text-sm leading-relaxed">
                {conversation.aiSummary}
              </div>
            </div>
          )}

          {conversation.recordingUrl && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Recording</h3>
              <div className="bg-card border rounded-lg p-4 flex items-center justify-between gap-4">
                <audio controls className="w-full max-w-md">
                  <source src={conversation.recordingUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <a href={conversation.recordingUrl} download className="w-full h-full">
                  <Button variant="secondary" size="sm" className="w-full h-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </div>
          )}

          {conversation.transcript && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Transcript</h3>
              <div className="bg-card border rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {conversation.transcript}
              </div>
            </div>
          )}

          {!conversation.transcript && !conversation.recordingUrl && !conversation.aiSummary && (
            <div className="text-center py-8 text-muted-foreground">
              No detailed data available for this conversation.
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
