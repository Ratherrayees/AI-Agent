import { Metadata } from 'next';
import { TeamManagement } from '@/features/settings/components/team-management';

export const metadata: Metadata = {
  title: 'Team Settings - StateAI CRM',
  description: 'Manage users and roles',
};

export default function TeamSettingsPage() {
  return <TeamManagement />;
}
