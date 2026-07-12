import {
  LayoutDashboard,
  Users,
  Calendar,
  Phone,
  Megaphone,
  BarChart3,
  Settings,
  GitMerge,
  Book,
  FolderOpen,
  Blocks
} from 'lucide-react';
import { UserRole } from '@/types/roles';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles?: UserRole[]; // If undefined, available to all
}

export const MAIN_NAVIGATION: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
  },
  {
    title: 'Appointments',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    title: 'Conversations',
    href: '/dashboard/conversations',
    icon: Phone,
  },
  {
    title: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Megaphone,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.SALES, UserRole.VIEWER],
  },
  {
    title: 'Workflows',
    href: '/dashboard/workflows',
    icon: GitMerge,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Knowledge',
    href: '/dashboard/knowledge',
    icon: Book,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Files',
    href: '/dashboard/files',
    icon: FolderOpen,
  },
  {
    title: 'Integrations',
    href: '/dashboard/integrations',
    icon: Blocks,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
];
