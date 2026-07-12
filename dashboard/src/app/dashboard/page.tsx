import { Metadata } from 'next';
import { DashboardStats } from '@/features/analytics/components/dashboard-stats';
import { CallVolumeChartDynamic as CallVolumeChart } from '@/features/analytics/components/call-volume-chart-dynamic';
import { RecentActivityFeed } from '@/features/analytics/components/recent-activity-feed';

export const metadata: Metadata = {
  title: 'Dashboard - StateAI CRM',
  description: 'AI CRM Dashboard Overview',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          Welcome to StateAI CRM. Here is what is happening with your leads and AI agents.
        </p>
      </div>
      
      <DashboardStats />
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <CallVolumeChart />
        <RecentActivityFeed />
      </div>
    </div>
  );
}
