'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Webhook, Key, Blocks, Activity } from 'lucide-react';

interface IntegrationsLayoutProps {
  children: React.ReactNode;
}

export default function IntegrationsLayout({ children }: IntegrationsLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { title: 'Connections', href: '/dashboard/integrations', icon: Blocks, exact: true },
    { title: 'Webhooks', href: '/dashboard/integrations/webhooks', icon: Webhook },
    { title: 'API Keys', href: '/dashboard/integrations/api', icon: Key },
    { title: 'System Jobs', href: '/dashboard/integrations/jobs', icon: Activity },
  ];

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations & API</h1>
        <p className="text-muted-foreground">
          Manage external connections, webhooks, and background system jobs.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link href={item.href} key={item.href} className="w-full">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'justify-start w-full',
                      isActive ? 'bg-secondary/50' : 'hover:bg-transparent hover:underline'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
