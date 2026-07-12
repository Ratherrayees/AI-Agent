'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitMerge, Settings2, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WorkflowBuilder() {
  // This is a UI mockup of the complex workflow builder
  // A full implementation would use React Flow or similar to map nodes
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Welcome Email Sequence</CardTitle>
                <CardDescription>Triggers when a new Lead is added</CardDescription>
              </div>
              <Badge>Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trigger Node */}
            <div className="relative pl-6 pb-6 border-l-2 border-indigo-200 ml-4">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-indigo-500 border-4 border-background" />
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center font-medium text-sm mb-2">
                  <PlayCircle className="h-4 w-4 mr-2 text-indigo-500" />
                  TRIGGER
                </div>
                <div className="text-sm">Lead Created</div>
              </div>
            </div>

            {/* Condition Node */}
            <div className="relative pl-6 pb-6 border-l-2 border-indigo-200 ml-4">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-amber-500 border-4 border-background" />
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center font-medium text-sm mb-2 text-amber-600">
                  <Settings2 className="h-4 w-4 mr-2" />
                  CONDITION
                </div>
                <div className="text-sm font-mono bg-background p-2 rounded border">
                  lead.source === &quot;Website Form&quot;
                </div>
              </div>
            </div>

            {/* Action Node */}
            <div className="relative pl-6 ml-4">
              <div className="absolute -left-[11px] top-0 h-5 w-5 rounded-full bg-emerald-500 border-4 border-background" />
              <div className="bg-muted/50 p-4 rounded-lg border border-emerald-500/20 shadow-sm">
                <div className="flex items-center font-medium text-sm mb-2 text-emerald-600">
                  <GitMerge className="h-4 w-4 mr-2" />
                  ACTION
                </div>
                <div className="text-sm">Send &quot;Welcome to StateAI&quot; Email</div>
                <div className="text-xs text-muted-foreground mt-2">Using Resend API</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Builder Toolbox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-dashed">
              + Add Condition
            </Button>
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-dashed">
              + Add Action
            </Button>
            <Button variant="outline" className="w-full justify-start text-muted-foreground border-dashed">
              + Add Delay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
