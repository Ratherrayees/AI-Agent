'use client';

import { useParams } from 'next/navigation';
import { useCampaign } from '@/features/campaigns/hooks/use-campaigns';
import { CampaignHeader } from '@/features/campaigns/components/campaign-detail/campaign-header';
import { CampaignOverview } from '@/features/campaigns/components/campaign-detail/campaign-overview';
import { CampaignLeadsQueue } from '@/features/campaigns/components/campaign-detail/campaign-leads-queue';
import { CampaignCallHistory } from '@/features/campaigns/components/campaign-detail/campaign-call-history';
import { CampaignSettings } from '@/features/campaigns/components/campaign-detail/campaign-settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, PhoneCall, Bot, Settings2, Sparkles, Phone } from 'lucide-react';

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: campaign, isLoading, isError } = useCampaign(id);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-sm text-muted-foreground font-medium">Loading Campaign Engine...</span>
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 py-20">
        <div className="p-4 rounded-full bg-destructive/10 text-destructive">
          <PhoneCall className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Campaign Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-sm text-center">
          The campaign you requested does not exist or has been deleted from Appwrite.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <CampaignHeader campaign={campaign} />

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap">
          <TabsTrigger
            value="overview"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6 flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Overview & Execution Queue
          </TabsTrigger>
          <TabsTrigger
            value="queue"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6 flex items-center gap-2"
          >
            <PhoneCall className="h-4 w-4" />
            Outreach Leads Queue
          </TabsTrigger>
          <TabsTrigger
            value="calls"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            AI Call Logs & Recordings
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6 flex items-center gap-2"
          >
            <Settings2 className="h-4 w-4" />
            Configuration & Rules
          </TabsTrigger>
        </TabsList>

        <div className="pt-6 flex-1">
          <TabsContent value="overview" className="m-0 focus-visible:outline-none">
            <CampaignOverview campaign={campaign} />
          </TabsContent>

          <TabsContent value="queue" className="m-0 focus-visible:outline-none">
            <CampaignLeadsQueue campaign={campaign} />
          </TabsContent>

          <TabsContent value="calls" className="m-0 focus-visible:outline-none">
            <CampaignCallHistory campaign={campaign} />
          </TabsContent>

          <TabsContent value="settings" className="m-0 focus-visible:outline-none">
            <CampaignSettings campaign={campaign} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
