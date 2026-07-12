import { Metadata } from 'next';
import { BusinessHoursForm } from '@/features/settings/components/business-hours-form';

export const metadata: Metadata = {
  title: 'Business Hours - StateAI CRM',
  description: 'Manage CRM business hours for AI routing',
};

export default function BusinessHoursPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Hours</h3>
        <p className="text-sm text-muted-foreground">
          Define your team&apos;s working hours. These are used to calculate response time SLAs and agent availability.
        </p>
      </div>
      
      <BusinessHoursForm />
    </div>
  );
}
