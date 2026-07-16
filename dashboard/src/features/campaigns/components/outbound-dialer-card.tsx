'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneCall, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AGENTS = [
  { id: 'agent_0801kxfte8gwe8sstnppq2k5mf4z', name: 'StateAI Outbound Sales Specialist (Dom)' },
  { id: 'agent_0001kxftec1yfyarde2z14aqetne', name: 'StateAI Outbound Coordinator & Reminders (Bella)' },
  { id: 'agent_1901kxftef3jfxbv3v0rqbberwvv', name: 'StateAI Customer Care & Surveys (Clyde)' }
];

export function OutboundDialerCard() {
  const [phone, setPhone] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0].id);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/agents/outbound-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          agentId: selectedAgent,
          clientName: 'Live Dialer Test'
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          text: `✅ Call initiated to ${phone}! Call SID: ${data.callSid || 'Live'}`
        });
      } else {
        setStatus({
          type: 'error',
          text: `❌ ${data.error || 'Failed to trigger outbound call'}`
        });
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        text: `❌ Error: ${err.message || 'Network error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <PhoneCall className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Quick Outbound AI Dialer (Twilio Live)</h3>
            <p className="text-sm text-muted-foreground">Test your ElevenLabs AI voice agents instantly using connected Twilio number (+15715711446)</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleDial} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-4 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Select Agent</label>
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
            disabled={loading}
          >
            {AGENTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-5 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Target Phone Number (with Country Code)</label>
          <Input
            placeholder="+1 (555) 000-1234 or +971 50 123 4567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="md:col-span-3">
          <Button
            type="submit"
            disabled={loading || !phone.trim()}
            className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Dialing...
              </>
            ) : (
              <>
                <PhoneCall className="mr-2 h-4 w-4" />
                Trigger Call
              </>
            )}
          </Button>
        </div>
      </form>

      {status && (
        <div
          className={`p-3 rounded-md text-sm flex items-center gap-2 ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-destructive/10 border border-destructive/20 text-destructive'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{status.text}</span>
        </div>
      )}
    </div>
  );
}
