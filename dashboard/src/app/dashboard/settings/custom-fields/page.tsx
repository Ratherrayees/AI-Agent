import { Metadata } from 'next';
import { CustomFieldManager } from '@/features/settings/components/custom-fields/custom-field-manager';

export const metadata: Metadata = {
  title: 'Custom Fields - StateAI CRM',
  description: 'Manage dynamic schema for the CRM',
};

export default function CustomFieldsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Custom Fields</h3>
        <p className="text-sm text-muted-foreground">
          Extend the default CRM entities with your own custom data fields without writing code.
        </p>
      </div>
      
      <CustomFieldManager />
    </div>
  );
}
