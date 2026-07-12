'use client';

import { useWorkflows, useDeleteWorkflow } from '../hooks/use-workflows';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { GitMerge, Plus, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

export function WorkflowList() {
  const { data, isLoading } = useWorkflows();
  const { mutate: deleteWorkflow, isPending: isDeleting } = useDeleteWorkflow();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Automated Sequences</h4>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading workflows...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((workflow) => {
                const trigger = workflow.triggerJson ? JSON.parse(workflow.triggerJson) : null;
                const actions = workflow.actionsJson ? JSON.parse(workflow.actionsJson) : [];
                
                return (
                  <TableRow key={workflow.$id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <GitMerge className="h-4 w-4 mr-2 text-indigo-500" />
                        {workflow.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 max-w-[250px] truncate">
                        {workflow.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={workflow.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {workflow.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trigger ? (
                        <div className="text-sm font-medium capitalize">
                          {trigger.type.replace('_', ' ')}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Manual</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {actions.length} step{actions.length !== 1 ? 's' : ''}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(workflow.$updatedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteWorkflow(workflow.$id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <GitMerge className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  No automated workflows exist.<br/>
                  <span className="text-xs mt-1 block">
                    Use workflows to replace manual tasks with event-driven automation.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
