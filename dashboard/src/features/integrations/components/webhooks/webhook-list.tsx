'use client';

import { useWebhooks } from '../../hooks/use-integrations';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Webhook as WebhookIcon, History } from 'lucide-react';
import { format } from 'date-fns';

export function WebhookList() {
  const { data, isLoading } = useWebhooks();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Configured Endpoints</h4>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Webhook
        </Button>
      </div>

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
                    <Button variant="ghost" size="sm" className="mr-2">
                      <History className="h-4 w-4 mr-2" />
                      Logs
                    </Button>
                    <Button variant="outline" size="sm">Edit</Button>
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
    </div>
  );
}
