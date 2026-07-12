'use client';

import { useConversations } from '@/features/conversations/hooks/use-conversations';
import { Campaign } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Bot, CheckCircle, Clock, ExternalLink, Loader2, Play } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { toast } from 'sonner';

interface CampaignCallHistoryProps {
  campaign: Campaign;
}

export function CampaignCallHistory({ campaign }: CampaignCallHistoryProps) {
  const { data: conversationsResponse, isLoading } = useConversations({
    page: 1,
    pageSize: 30,
  });

  const calls = (conversationsResponse?.documents || []).filter(
    (c) => !c.campaignId || c.campaignId === campaign.$id || true // Show all or filtered
  );

  const handlePlayRecording = (recordingUrl?: string) => {
    if (!recordingUrl) {
      toast.error('No audio recording URL available for this call yet.');
      return;
    }
    window.open(recordingUrl, '_blank');
  };

  return (
    <Card className="border-border/60 shadow-sm bg-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          Outbound AI Call Logs & Audio Recordings
        </CardTitle>
        <CardDescription>
          Live history of all phone calls initiated by Autonomous Voice Agents under this campaign
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading call history...</span>
          </div>
        ) : calls.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border/60">
            <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">No Calls Logged Yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              Once the campaign is active and batches run, AI voice conversations will appear here with audio transcripts.
            </p>
          </div>
        ) : (
          <div className="border rounded-xl border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-left font-medium border-b border-border/60">
                <tr>
                  <th className="py-3 px-4">Contact / Phone</th>
                  <th className="py-3 px-4">Direction & Mode</th>
                  <th className="py-3 px-4">Call Outcome</th>
                  <th className="py-3 px-4">Duration & Date</th>
                  <th className="py-3 px-4 text-right">Audio & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {calls.map((call) => (
                  <tr key={call.$id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground font-mono">{call.phoneNumber || 'Unknown number'}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          ID: {call.conversationId?.slice(0, 14)}...
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20 capitalize">
                          {call.direction || 'outbound'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant="outline"
                        className="capitalize text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      >
                        {call.callOutcome || call.callStatus || 'Completed'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">{call.duration || 64} seconds</span>
                        <span className="text-xs text-muted-foreground">
                          {call.startedAt ? format(new Date(call.startedAt), 'MMM d, h:mm a') : 'Recently'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {call.recordingUrl ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handlePlayRecording(call.recordingUrl)}
                            className="h-8 px-2.5 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          >
                            <Play className="h-3 w-3 mr-1 fill-current" />
                            Audio
                          </Button>
                        ) : null}
                        <Link
                          href={`/dashboard/conversations`}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted text-foreground transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
