import { Metadata } from 'next';
import { ApiKeyList } from '@/features/integrations/components/api/api-key-list';

export const metadata: Metadata = {
  title: 'API Keys - StateAI CRM',
  description: 'Manage internal API access keys',
};

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Keys</h3>
        <p className="text-sm text-muted-foreground">
          Generate and manage API keys for programmatic access to your CRM.
        </p>
      </div>
      
      <ApiKeyList />
    </div>
  );
}
