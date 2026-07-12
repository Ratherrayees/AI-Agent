import { Metadata } from 'next';
import { DashboardStats } from '@/features/analytics/components/dashboard-stats';
import { CallVolumeChartDynamic as CallVolumeChart } from '@/features/analytics/components/call-volume-chart-dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, TrendingUp, Users, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Analytics & Performance - StateAI CRM',
  description: 'In-depth AI conversation, call volume, and lead conversion metrics',
};

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Performance</h1>
        <p className="text-muted-foreground">
          Detailed metrics on AI voice agents, lead conversion funnels, and call outcomes.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-4">
        <CallVolumeChart />

        <Card className="col-span-1 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              AI Insights
            </CardTitle>
            <CardDescription>Automated performance highlights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
              <TrendingUp className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Call duration increased by 14%</p>
                <p className="text-muted-foreground text-xs">Leads are spending more time conversing with the real estate qualification agent.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
              <PhoneCall className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Peak inbound hours: 2PM - 5PM</p>
                <p className="text-muted-foreground text-xs">Consider scheduling proactive SMS reminders 1 hour before peak call windows.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-border/50">
              <Users className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Conversion rate: 28.4%</p>
                <p className="text-muted-foreground text-xs">Qualified leads booking tours is up 5.2% over last week.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
