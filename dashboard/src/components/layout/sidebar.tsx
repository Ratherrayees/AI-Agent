import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MAIN_NAVIGATION } from '@/constants/navigation';
import { useAuth } from '@/providers/auth-provider';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/constants';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const userRole = user?.prefs?.role;

  // Filter navigation based on user role
  const navigation = MAIN_NAVIGATION.filter((item) => {
    if (!item.roles) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });

  return (
    <div className="hidden border-r bg-muted/40 md:block w-full h-full flex-shrink-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">{APP_NAME}</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? 'bg-muted text-primary'
                    : ''
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
