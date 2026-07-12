'use client';

import { useSystemJobs } from '../../hooks/use-integrations';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export function JobList() {
  const { data, isLoading } = useSystemJobs();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Recent Task Executions</h4>
        <div className="flex items-center text-xs text-muted-foreground">
          <Activity className="h-4 w-4 mr-1 text-emerald-500 animate-pulse" />
          Workers Active
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading system jobs...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((job) => (
                <TableRow key={job.$id}>
                  <TableCell className="font-medium capitalize">
                    {job.type.replace(/_/g, ' ')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        job.status === 'completed' ? 'default' : 
                        job.status === 'failed' ? 'destructive' : 
                        'secondary'
                      } 
                      className="capitalize"
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(job.$createdAt), 'MMM d, h:mm:ss a')}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {job.durationMs}ms
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {job.details || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={job.status === 'running'}>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Run Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  No jobs have executed recently.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
