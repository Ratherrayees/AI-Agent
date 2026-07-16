import { Metadata } from 'next';
import { CampaignTable } from '@/features/campaigns/components/campaign-list/campaign-table';
import { OutboundDialerCard } from '@/features/campaigns/components/outbound-dialer-card';

export const metadata: Metadata = {
  title: 'Campaigns - StateAI CRM',
  description: 'Manage AI outreach campaigns and lead queues',
};

export default function CampaignsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns & Outbound AI</h1>
        <p className="text-muted-foreground">
          Orchestrate automated AI calling campaigns, test live voice agents, and manage lead queues.
        </p>
      </div>

      <OutboundDialerCard />
      
      <div className="flex-1 overflow-auto">
        <CampaignTable />
      </div>
    </div>
  );
}
