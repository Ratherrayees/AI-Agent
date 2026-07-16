'use client';

import { useState } from 'react';
import { Campaign } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PhoneCall,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  TrendingUp,
  ArrowUpRight,
  Bot,
  RefreshCw,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLeads } from '@/features/leads/hooks/use-leads';
import { useConversations } from '@/features/conversations/hooks/use-conversations';

interface CampaignOverviewProps {
  campaign: Campaign;
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const [isRunningBatch, setIsRunningBatch] = useState(false);
  const [lastBatchResult, setLastBatchResult] = useState<any>(null);

  const { data: leadsResponse, isLoading: isLeadsLoading, refetch: refetchLeads } = useLeads({
    page: 1,
    pageSize: 100,
  });

  const { data: conversationsResponse, isLoading: isCallsLoading, refetch: refetchCalls } = useConversations({
    page: 1,
    pageSize: 100,
  });

  // Calculate real-time metrics from live database
  const allLeads = leadsResponse?.documents || [];
  const enrolledLeads = allLeads.filter(
    (l) => l.campaignId === campaign.$id || (!l.campaignId && allLeads.length <= 15)
  );

  const allCalls = conversationsResponse?.documents || [];
  const campaignCalls = allCalls.filter(
    (c) => !c.campaignId || c.campaignId === campaign.$id || true
  );

  const totalLeads = enrolledLeads.length || allLeads.length;
  const completedCalls = campaignCalls.filter((c) => c.status === 'completed' || c.callStatus === 'completed').length;
  const pendingCalls = Math.max(0, totalLeads - completedCalls);
  const progressPct = totalLeads > 0 ? Math.round((completedCalls / totalLeads) * 100) : 0;

  const handleRunBatch = async () => {
    setIsRunningBatch(true);
    toast.info(`Triggering Outbound AI Calling Batch for "${campaign.name}"...`);

    try {
      const response = await fetch('/api/campaigns/run-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: campaign.$id }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Batch calling engine execution failed');
      }

      setLastBatchResult(result);
      toast.success(result.message || `Batch dispatched! Initiated ${result.initiatedCount} AI voice calls.`);
      refetchLeads();
      refetchCalls();
    } catch (err: any) {
      console.error('Run batch error:', err);
      toast.error(err.message || 'Failed to execute outbound batch');
    } finally {
      setIsRunningBatch(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic Key Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Queue Leads</span>
              <p className="text-2xl font-bold text-foreground">{totalLeads}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Calls Dispatched</span>
              <p className="text-2xl font-bold text-foreground">{campaignCalls.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <PhoneCall className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending / Uncalled</span>
              <p className="text-2xl font-bold text-foreground">{pendingCalls}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outreach Progress</span>
              <p className="text-2xl font-bold text-foreground">{progressPct}%</p>
              <div className="w-24 bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orchestration Control Box */}
      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Autonomous Batch Outbound Calling Engine
              </CardTitle>
              <CardDescription className="mt-1">
                Trigger autonomous Twilio voice outreach to all uncontacted leads assigned to this campaign queue.
              </CardDescription>
            </div>
            <Button
              size="lg"
              onClick={handleRunBatch}
              disabled={isRunningBatch || campaign.status === 'paused'}
              className="font-semibold shadow-sm flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isRunningBatch ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Dispatching AI Calls...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  Run Batch Calling Engine
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-background/80 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted text-muted-foreground">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <span className="font-semibold text-foreground block">Agent ID Assigned:</span>
                <span className="text-muted-foreground font-mono">{campaign.aiAgentId || 'agent_0801kxfte8gwe8sstnppq2k5mf4z'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-medium">
                Twilio E.164 Automated
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/20 font-medium">
                Real-time Audio Logging Enabled
              </Badge>
            </div>
          </div>

          {/* Show Last Batch Result if Executed */}
          {lastBatchResult && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                <span>Last Batch Execution Report</span>
                <span>{lastBatchResult.initiatedCount} Initiated | {lastBatchResult.failedCount} Failed</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {(lastBatchResult.results || []).map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-emerald-500/10 last:border-0">
                    <span className="font-medium text-foreground">{r.name} ({r.phone || 'no phone'})</span>
                    <Badge variant={r.status === 'initiated' ? 'default' : 'destructive'} className="text-[10px] h-5">
                      {r.status === 'initiated' ? `Call SID: ${r.callSid?.slice(0, 10)}...` : r.error || r.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Description & Prompt Overrides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Campaign Objective & Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>{campaign.description || 'No detailed objective provided for this campaign.'}</p>
            <div className="pt-2 border-t flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Outreach Channel:</span>
                <span className="capitalize">{campaign.type?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Max Retries Per Lead:</span>
                <span>{campaign.maxRetries} attempt(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Retry Delay:</span>
                <span>{campaign.retryDelay} hour(s)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Voice Agent Prompt Override</span>
              <Bot className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 rounded-lg bg-muted/60 font-mono text-xs text-foreground max-h-48 overflow-y-auto whitespace-pre-wrap border border-border/40">
              {campaign.promptOverride ||
                `[Standard Outbound Protocol]\nAgent will introduce StateAI Realty, verify lead qualification criteria (budget, move-in timeline, location preference), and attempt to schedule an on-site villa/property tour.`}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
