'use client';

import { useParams } from 'next/navigation';
import { useLead } from '@/features/leads/hooks/use-lead';
import { LeadHeader } from '@/features/leads/components/lead-detail/lead-header';
import { LeadOverview } from '@/features/leads/components/lead-detail/lead-overview';
import { NoteList } from '@/features/shared/notes/components/note-list';
import { ActivityTimeline } from '@/features/shared/activities/components/activity-timeline';
import { FileList } from '@/features/shared/files/components/file-list';
import { LeadAppointmentList } from '@/features/appointments/components/lead-appointment-list';
import { LeadConversationList } from '@/features/conversations/components/lead-conversation-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: lead, isLoading, isError } = useLead(id);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Lead Not Found</h2>
        <p className="text-muted-foreground">The lead you are looking for does not exist or has been deleted.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <LeadHeader lead={lead} />
      
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="overview" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Notes
          </TabsTrigger>
          <TabsTrigger 
            value="activities" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Activities
          </TabsTrigger>
          <TabsTrigger 
            value="files" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Files
          </TabsTrigger>
          <TabsTrigger 
            value="appointments" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Appointments
          </TabsTrigger>
          <TabsTrigger 
            value="conversations" 
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
          >
            Conversations
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 overflow-auto pt-6">
          <TabsContent value="overview" className="m-0">
            <LeadOverview lead={lead} />
          </TabsContent>
          
          <TabsContent value="notes" className="m-0">
            <NoteList entityType="leadId" entityId={lead.$id} />
          </TabsContent>
          
          <TabsContent value="activities" className="m-0">
            <div className="py-6 px-4">
              <ActivityTimeline leadId={lead.$id} />
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="m-0">
            <div className="py-6 px-4">
              <FileList entityType="leadId" entityId={lead.$id} />
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="m-0">
            <div className="py-6 px-4">
              <LeadAppointmentList leadId={lead.$id} />
            </div>
          </TabsContent>
          
          <TabsContent value="conversations" className="m-0">
            <div className="py-6 px-4">
              <LeadConversationList leadId={lead.$id} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
