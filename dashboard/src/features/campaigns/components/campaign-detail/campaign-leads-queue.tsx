'use client';

import { useState } from 'react';
import { useLeads } from '@/features/leads/hooks/use-leads';
import { Lead, Campaign } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PhoneCall, Bot, CheckCircle, Clock, AlertCircle, Loader2, UserPlus, Play } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CampaignLeadsQueueProps {
  campaign: Campaign;
}

export function CampaignLeadsQueue({ campaign }: CampaignLeadsQueueProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [callingId, setCallingId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const { data: leadsResponse, isLoading, refetch } = useLeads({
    page: 1,
    pageSize: 100,
    search: searchTerm || undefined,
  });

  const allLeads = leadsResponse?.documents || [];
  
  // Filter leads that are explicitly assigned to this campaign OR if no leads are assigned yet, show uncontacted leads
  const assignedLeads = allLeads.filter((l) => l.campaignId === campaign.$id);
  const displayLeads = assignedLeads.length > 0 ? assignedLeads : allLeads.slice(0, 25);

  const handleInitiateCall = async (lead: Lead) => {
    if (!lead.phone) {
      toast.error(`No phone number recorded for ${lead.firstName} ${lead.lastName}`);
      return;
    }

    setCallingId(lead.$id);
    toast.info(`Initiating Outbound AI Voice Call for ${lead.firstName} ${lead.lastName} (${lead.phone})...`);

    try {
      const response = await fetch('/api/agents/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: lead.phone,
          leadId: lead.$id,
          campaignId: campaign.$id,
          agentId: campaign.aiAgentId,
          clientName: `${lead.firstName} ${lead.lastName}`
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to dispatch AI outbound call');
      }

      toast.success(
        `✅ AI Voice Agent dispatched to ${lead.phone}! Call SID: ${result.callSid || 'active'}`
      );
      refetch();
    } catch (err: any) {
      console.error('Call error:', err);
      toast.error(err.message || 'Error triggering voice call');
    } finally {
      setCallingId(null);
    }
  };

  const handleAssignAllToCampaign = async () => {
    setIsAssigning(true);
    toast.info(`Enrolling visible unassigned leads into "${campaign.name}"...`);

    let assigned = 0;
    for (const lead of allLeads.slice(0, 25)) {
      if (lead.campaignId !== campaign.$id) {
        try {
          await fetch(`/api/tools/update-lead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: lead.$id, campaignId: campaign.$id })
          });
          assigned++;
        } catch (e) {}
      }
    }

    setIsAssigning(false);
    toast.success(`Enrolled ${assigned} leads into "${campaign.name}"!`);
    refetch();
  };

  const getQueueBadge = (lead: Lead) => {
    if (lead.leadStatus === 'qualified' || lead.leadStatus === 'appointment_scheduled') {
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">Qualified / Booked</Badge>;
    }
    if (lead.leadStatus === 'contacted') {
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium">Contacted via AI</Badge>;
    }
    if (lead.leadStatus === 'lost') {
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-medium">Retry Exceeded</Badge>;
    }
    return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">Queued for AI</Badge>;
  };

  return (
    <Card className="border-border/60 shadow-sm bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-primary" />
            Outreach Calling Queue ({displayLeads.length} leads)
          </CardTitle>
          <CardDescription>
            {assignedLeads.length > 0
              ? `Leads explicitly enrolled in "${campaign.name}"`
              : `Showing top uncontacted queue leads (No leads explicitly enrolled yet)`}
          </CardDescription>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads in queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          {assignedLeads.length === 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAssignAllToCampaign}
              disabled={isAssigning || allLeads.length === 0}
              className="h-9 text-xs border-primary/30 text-primary hover:bg-primary/5"
            >
              {isAssigning ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <UserPlus className="h-3.5 w-3.5 mr-1.5" />}
              Enroll Queue Leads
            </Button>
          )}
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-9 px-3 text-xs font-medium transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Manage Leads
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading queue records...</span>
          </div>
        ) : displayLeads.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border/60">
            <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">No Leads in Outreach Queue</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              Add leads to Appwrite or click &quot;Enroll Queue Leads&quot; to assign contacts to this automated calling campaign.
            </p>
            <Link
              href="/dashboard/leads"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Go to Leads Directory
            </Link>
          </div>
        ) : (
          <div className="border rounded-xl border-border/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-xs text-muted-foreground uppercase font-semibold border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4">Lead Contact</th>
                    <th className="py-3 px-4">Company & Role</th>
                    <th className="py-3 px-4">Phone Number</th>
                    <th className="py-3 px-4">Queue Status</th>
                    <th className="py-3 px-4">Enrolled Date</th>
                    <th className="py-3 px-4 text-right">Autonomous Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {displayLeads.map((lead) => (
                    <tr key={lead.$id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-foreground">
                        <Link href={`/dashboard/leads/${lead.$id}`} className="hover:underline flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                            {lead.firstName?.[0] || 'L'}
                            {lead.lastName?.[0] || ''}
                          </div>
                          <span>
                            {lead.firstName} {lead.lastName}
                          </span>
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground text-xs">
                        {lead.company ? `${lead.company} (${lead.jobTitle || 'Contact'})` : lead.jobTitle || 'Direct Lead'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-foreground">
                        {lead.phone || <span className="text-muted-foreground italic">No phone</span>}
                      </td>
                      <td className="py-3.5 px-4">{getQueueBadge(lead)}</td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {lead.$createdAt ? format(new Date(lead.$createdAt), 'MMM d, yyyy') : 'Recently'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 px-3 text-xs font-semibold gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-all shadow-none border border-primary/20"
                          onClick={() => handleInitiateCall(lead)}
                          disabled={callingId === lead.$id || !lead.phone}
                        >
                          {callingId === lead.$id ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Dialing AI...
                            </>
                          ) : (
                            <>
                              <PhoneCall className="h-3.5 w-3.5" />
                              Call Now via AI
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
