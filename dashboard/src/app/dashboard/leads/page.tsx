import { Metadata } from 'next';
import { LeadTable } from '@/features/leads/components/lead-list/lead-table';

export const metadata: Metadata = {
  title: 'Leads - StateAI CRM',
  description: 'Manage your leads and contacts',
};

export default function LeadsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <p className="text-muted-foreground">
          Manage your contacts, prospects, and customers.
        </p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <LeadTable />
      </div>
    </div>
  );
}
