import { useState } from 'react';
import { Lead } from '@/types';
import { Button } from '@/components/ui/button';
import { LeadStatusBadge } from '../lead-status-badge';
import { Mail, Phone, Calendar, ArrowLeft, MoreHorizontal, PhoneCall, Loader2 } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LeadHeaderProps {
  lead: Lead;
}

export function LeadHeader({ lead }: LeadHeaderProps) {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string | null>(null);

  const triggerAIOutboundCall = async () => {
    if (!lead.phone) {
      alert('This lead has no phone number.');
      return;
    }
    if (!confirm(`Trigger ElevenLabs AI Outbound Call via Twilio to ${lead.firstName} ${lead.lastName} (${lead.phone})?`)) {
      return;
    }

    setIsCalling(true);
    setCallStatus(null);
    try {
      const res = await fetch('/api/agents/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: lead.phone,
          leadId: lead.$id,
          clientName: `${lead.firstName} ${lead.lastName}`
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCallStatus('Call Initiated!');
        alert(`✅ Outbound AI call triggered successfully to ${lead.phone}!`);
      } else {
        alert(`❌ Failed to trigger call: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`❌ Error triggering call: ${err.message || err}`);
    } finally {
      setIsCalling(false);
      setTimeout(() => setCallStatus(null), 4000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-lg border">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/leads" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {lead.firstName} {lead.lastName}
          </h1>
          <LeadStatusBadge status={lead.leadStatus} />
          {callStatus && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {callStatus}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground ml-8">
          {lead.jobTitle || lead.company ? (
            <div className="flex items-center gap-1 font-medium text-foreground">
              {lead.jobTitle} {lead.jobTitle && lead.company ? 'at' : ''} {lead.company}
            </div>
          ) : null}
          
          {lead.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${lead.email}`} className="hover:underline text-primary">
                {lead.email}
              </a>
            </div>
          )}
          
          {lead.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <a href={`tel:${lead.phone}`} className="hover:underline text-primary">
                {lead.phone}
              </a>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-8 md:ml-0">
        {lead.phone && (
          <Button 
            variant="default" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            onClick={triggerAIOutboundCall}
            disabled={isCalling}
          >
            {isCalling ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Calling...
              </>
            ) : (
              <>
                <PhoneCall className="h-4 w-4 mr-2" />
                Call AI Agent
              </>
            )}
          </Button>
        )}
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Book Meeting
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Lead</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
