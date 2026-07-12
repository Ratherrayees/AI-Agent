import { Metadata } from 'next';
import { GlobalFileManager } from '@/features/shared/files/components/global-file-manager';

export const metadata: Metadata = {
  title: 'File Manager - StateAI CRM',
  description: 'Centralized document storage',
};

export default function FilesPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h3 className="text-3xl font-bold tracking-tight">File Manager</h3>
        <p className="text-muted-foreground mt-2">
          Manage all documents, images, and audio recordings attached to Leads and Campaigns across your CRM.
        </p>
      </div>
      
      <div className="flex-1">
        <GlobalFileManager />
      </div>
    </div>
  );
}
