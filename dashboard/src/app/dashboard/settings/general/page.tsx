import { Metadata } from 'next';
import { CompanySettingsForm } from '@/features/settings/components/company-settings-form';

export const metadata: Metadata = {
  title: 'General Settings - StateAI CRM',
  description: 'Manage company information and AI agent defaults',
};

export default function GeneralSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure your company profile and default CRM behavior.
        </p>
      </div>
      
      <CompanySettingsForm />
    </div>
  );
}
