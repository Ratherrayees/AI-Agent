'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { title: 'General', href: '/dashboard/settings/general' },
    { title: 'Business Hours', href: '/dashboard/settings/business-hours' },
    { title: 'Custom Fields', href: '/dashboard/settings/custom-fields' },
    { title: 'Team Members', href: '/dashboard/settings/team' },
  ];

  return (
    <div className="flex flex-col h-full gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and CRM preferences.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="w-full">
                <Button
                  variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
                  className={cn(
                    'justify-start w-full',
                    pathname.startsWith(item.href) ? 'bg-secondary/50' : 'hover:bg-transparent hover:underline'
                  )}
                >
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>
        
        <div className="flex-1 overflow-y-auto pr-2 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
