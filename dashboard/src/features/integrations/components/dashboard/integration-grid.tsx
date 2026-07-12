'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';


const MOCK_INTEGRATIONS = [
  {
    id: 'voice_engine',
    name: 'StateAI Voice Engine',
    description: 'Autonomous AI voice generation & conversational engine',
    status: 'connected',
    version: 'v2.5',
    lastSync: 'Just now',
    icon: '🎙️',
  },
  {
    id: 'telephony',
    name: 'Telephony Gateway',
    description: 'Carrier network provider for outbound calling & SMS routing',
    status: 'connected',
    version: 'v2.0',
    lastSync: '5 mins ago',
    icon: '📞',
  },
  {
    id: 'google_calendar',
    name: 'Google Calendar Sync',
    description: 'Real-time showing & appointment synchronization',
    status: 'connected',
    version: 'v3',
    lastSync: '2 hours ago',
    icon: '📅',
  },
  {
    id: 'slack',
    name: 'Team Notifications (Slack)',
    description: 'Push notifications for qualified lead alerts & appointments',
    status: 'disconnected',
    version: '-',
    lastSync: 'Never',
    icon: '💬',
  }
];

export function IntegrationGrid() {
  const { user } = useAuth();
  const isSuperAdmin = 
    (user?.prefs?.role as string) === 'superadmin' || 
    user?.prefs?.role === 'super_admin' || 
    user?.labels?.includes('superadmin') || 
    user?.labels?.includes('super_admin');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MOCK_INTEGRATIONS.map((app) => (
        <Card key={app.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
                {app.icon}
              </div>
              <div>
                <CardTitle className="text-base">{app.name}</CardTitle>
                <CardDescription className="text-xs">{app.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 py-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={app.status === 'connected' ? 'default' : app.status === 'error' ? 'destructive' : 'secondary'} className="capitalize">
                  {app.status === 'connected' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                  {app.status === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {app.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span>{app.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Sync</span>
                <span className="flex items-center text-xs">
                  <RefreshCw className="w-3 h-3 mr-1 text-muted-foreground" />
                  {app.lastSync}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t bg-muted/20 flex flex-col gap-2">
            {isSuperAdmin ? (
              app.status === 'connected' || app.status === 'error' ? (
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="w-full">Configure</Button>
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive">Disconnect</Button>
                </div>
              ) : (
                <Button className="w-full">Connect</Button>
              )
            ) : (
              <div className="w-full text-center">
                <Button variant="outline" className="w-full text-xs font-semibold" disabled>
                  🔒 Managed by System Provider
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
