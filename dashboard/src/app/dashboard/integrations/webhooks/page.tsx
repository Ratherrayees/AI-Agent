import { Metadata } from 'next';
import { WebhookList } from '@/features/integrations/components/webhooks/webhook-list';

export const metadata: Metadata = {
  title: 'Webhooks - StateAI CRM',
  description: 'Manage incoming and outgoing webhooks',
};

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Webhook Center</h3>
        <p className="text-sm text-muted-foreground">
          Configure real-time event triggers for external systems.
        </p>
      </div>
      
      <WebhookList />
    </div>
  );
}
