'use client';

import { useState } from 'react';
import { useWebhooks, useCreateWebhook, useWebhookLogs } from '../../hooks/use-integrations';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Webhook as WebhookIcon, History, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const AVAILABLE_EVENTS = [
  { id: 'lead.created', label: 'Lead Created' },
  { id: 'lead.updated', label: 'Lead Updated' },
  { id: 'call.started', label: 'Call Started' },
  { id: 'call.completed', label: 'Call Completed' },
  { id: 'appointment.scheduled', label: 'Appointment Scheduled' }
];

export function WebhookList() {
  const { data, isLoading } = useWebhooks();
  const { mutate: createWebhook, isPending: isCreating } = useCreateWebhook();

  // Create Webhook Form State
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [direction, setDirection] = useState<'incoming' | 'outgoing'>('outgoing');
  const [status, setStatus] = useState<'active' | 'paused' | 'error'>('active');
  const [events, setEvents] = useState<string[]>(['lead.created']);

  // Webhook Logs State
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const { data: logs, isLoading: isLoadingLogs } = useWebhookLogs(selectedWebhookId || '');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error('Webhook name is required');
      return;
    }
    if (!url) {
      toast.error('Endpoint URL is required');
      return;
    }
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }
    if (events.length === 0) {
      toast.error('Please select at least one trigger event');
      return;
    }

    createWebhook(
      {
        name,
        url,
        direction,
        status,
        events,
        retryPolicyJson: JSON.stringify({ maxAttempts: 3, delay: 1000, backoff: 'exponential' })
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          setName('');
          setUrl('');
          setDirection('outgoing');
          setStatus('active');
          setEvents(['lead.created']);
        }
      }
    );
  };

  const handleOpenLogs = (webhookId: string) => {
    setSelectedWebhookId(webhookId);
    setLogsOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Configured Endpoints</h4>
        
        {/* Create Webhook Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          } />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Webhook Endpoint</DialogTitle>
              <DialogDescription>
                Configure an HTTP endpoint to receive event-driven push notifications.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Webhook Name</Label>
                <Input
                  id="webhook-name"
                  placeholder="e.g. Zapier Lead Sync"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Endpoint URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://yourserver.com/webhooks"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isCreating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select value={direction} onValueChange={(val: any) => setDirection(val)} disabled={isCreating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outgoing">Outgoing (Push)</SelectItem>
                      <SelectItem value="incoming">Incoming (Receive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Initial Status</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)} disabled={isCreating}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label>Trigger Events</Label>
                <div className="flex flex-col gap-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div key={event.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`event-${event.id}`}
                        checked={events.includes(event.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEvents([...events, event.id]);
                          } else {
                            setEvents(events.filter((e) => e !== event.id));
                          }
                        }}
                        disabled={isCreating}
                      />
                      <Label htmlFor={`event-${event.id}`} className="font-normal text-sm">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="sm:justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setCreateOpen(false)} disabled={isCreating}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Adding...' : 'Configure Webhook'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks List Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading webhooks...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((webhook) => (
                <TableRow key={webhook.$id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <WebhookIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {webhook.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px] mt-1">{webhook.url}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.direction === 'incoming' ? 'secondary' : 'outline'} className="capitalize">
                      {webhook.direction}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.status === 'active' ? 'default' : 'destructive'} className="capitalize">
                      {webhook.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {webhook.events?.length || 0} events
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(webhook.$updatedAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2" onClick={() => handleOpenLogs(webhook.$id)}>
                      <History className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                    <Button variant="outline" size="sm" disabled>Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No webhooks configured yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Webhook Logs Dialog */}
      <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Webhook Execution Logs</DialogTitle>
            <DialogDescription>
              Recent HTTP deliveries and payloads for the configured webhook.
            </DialogDescription>
          </DialogHeader>

          {isLoadingLogs ? (
            <div className="py-8 text-center text-muted-foreground">Loading history...</div>
          ) : logs?.documents?.length ? (
            <div className="space-y-4 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.documents.map((log) => (
                    <TableRow key={log.$id}>
                      <TableCell className="font-mono text-xs">{log.event}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {log.statusCode >= 200 && log.statusCode < 300 ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-500" />
                          )}
                          <span className={log.statusCode >= 200 && log.statusCode < 300 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                            {log.statusCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{log.durationMs}ms</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(log.$createdAt), 'MMM d, h:mm:ss a')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 border border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
              <ShieldAlert className="h-8 w-8 mb-2 text-muted-foreground/50" />
              <span>No deliveries cataloged for this webhook endpoint yet.</span>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setLogsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
