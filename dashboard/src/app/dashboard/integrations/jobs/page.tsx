import { Metadata } from 'next';
import { JobList } from '@/features/integrations/components/jobs/job-list';

export const metadata: Metadata = {
  title: 'System Jobs - StateAI CRM',
  description: 'Monitor background workers and cron jobs',
};

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">System Jobs</h3>
        <p className="text-sm text-muted-foreground">
          Monitor background processes, webhook retries, and data sync tasks.
        </p>
      </div>
      
      <JobList />
    </div>
  );
}
