import { Metadata } from 'next';
import { WorkflowList } from '@/features/workflows/components/workflow-list';
import { WorkflowBuilder } from '@/features/workflows/components/workflow-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const metadata: Metadata = {
  title: 'Workflows - StateAI CRM',
  description: 'Event-driven automation engine',
};

export default function WorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">Workflow Engine</h3>
        <p className="text-muted-foreground mt-2">
          Automate your CRM processes. Visually map triggers to actions to eliminate manual tasks.
        </p>
      </div>
      
      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">All Workflows</TabsTrigger>
          <TabsTrigger value="builder">Builder Sandbox</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-6">
          <WorkflowList />
        </TabsContent>
        <TabsContent value="builder" className="mt-6">
          <WorkflowBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
