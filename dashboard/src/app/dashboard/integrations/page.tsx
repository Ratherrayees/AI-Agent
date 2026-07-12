import { Metadata } from 'next';
import { IntegrationGrid } from '@/features/integrations/components/dashboard/integration-grid';

export const metadata: Metadata = {
  title: 'Connections - StateAI CRM',
  description: 'Manage third-party integrations',
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Connected Apps</h3>
        <p className="text-sm text-muted-foreground">
          Configure external services that interact with your CRM and AI agents.
        </p>
      </div>
      
      <IntegrationGrid />
    </div>
  );
}
