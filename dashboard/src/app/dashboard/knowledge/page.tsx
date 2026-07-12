import { Metadata } from 'next';
import { KnowledgeList } from '@/features/knowledge/components/knowledge-list';

export const metadata: Metadata = {
  title: 'Knowledge Sources - StateAI CRM',
  description: 'Manage the catalog of knowledge assets fed to AI Agents',
};

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">Knowledge Catalog</h3>
        <p className="text-muted-foreground mt-2">
          Track and manage which documents and URLs are assigned to your Autonomous Voice Models.
          Note: This only manages metadata. The actual files are stored securely in the AI Engine.
        </p>
      </div>
      
      <KnowledgeList />
    </div>
  );
}
