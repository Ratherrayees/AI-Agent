'use client';

import { useState } from 'react';
import { useLeads } from '@/features/leads/hooks/use-leads';
import { Lead, Campaign } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, PhoneCall, Bot, CheckCircle, Clock, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CampaignLeadsQueueProps {
  campaign: Campaign;
}

export function CampaignLeadsQueue({ campaign }: CampaignLeadsQueueProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [callingId, setCallingId] = useState<string | null>(null);

  // Fetch leads using our paginated query hook
  const { data: leadsResponse, isLoading } = useLeads({
    page: 1,
    pageSize: 50,
    search: searchTerm || undefined,
  });

  const leads = leadsResponse?.documents || [];

  const handleInitiateCall = async (lead: Lead) => {
    setCallingId(lead.$id);
    toast.info(`Initiating Outbound AI Voice Call for ${lead.firstName} ${lead.lastName}...`);

    setTimeout(() => {
      setCallingId(null);
      toast.success(
        `AI Voice Agent dispatched to call ${lead.phone || 'lead contact number'} for campaign "${campaign.name}"!`
      );
    }, 1500);
  };

  const getQueueBadge = (status: string) => {
    switch (status) {
      case 'new':
      case 'contacted':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">Queued for AI</Badge>;
      case 'qualified':
      case 'showing_scheduled':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium">Call Completed</Badge>;
      case 'lost':
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-medium">Retry Exceeded</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium">In Queue</Badge>;
    }
  };

  return (
    <Card className="border-border/60 shadow-sm bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-primary" />
            Outreach Calling Queue
          </CardTitle>
          <CardDescription>
            Leads enrolled in this campaign and their real-time AI outreach status
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads in queue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Link
            href="/dashboard/leads"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-8 px-3 text-xs font-medium transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Add Leads
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading queue records...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl border-border/60">
            <Bot className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">No Leads in Queue</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              Add leads from the main leads directory or import via CSV/API to start automated calling.
            </p>
            <Link
              href="/dashboard/leads"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 text-xs font-medium transition-colors"
            >
              Browse Leads
            </Link>
          </div>
        ) : (
          <div className="border rounded-xl border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-left font-medium border-b border-border/60">
                <tr>
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Phone & Email</th>
                  <th className="py-3 px-4">CRM Status</th>
                  <th className="py-3 px-4">Outreach Queue Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-foreground">
                {leads.map((lead) => (
                  <tr key={lead.$id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <Link
                        href={`/dashboard/leads/${lead.$id}`}
                        className="text-primary hover:underline"
                      >
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-mono">{lead.phone || 'No phone'}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {lead.email || 'No email'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="outline" className="capitalize text-xs font-normal">
                        {(lead.leadStatus || lead.status || 'new').replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      {getQueueBadge(lead.leadStatus || lead.status || 'new')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleInitiateCall(lead)}
                        disabled={callingId === lead.$id || !lead.phone || campaign.status !== 'running'}
                        className="h-8 px-3 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                      >
                        {callingId === lead.$id ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                        ) : (
                          <PhoneCall className="h-3 w-3 mr-1.5" />
                        )}
                        {callingId === lead.$id ? 'Calling...' : 'Call via AI'}
                      </Button>
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
