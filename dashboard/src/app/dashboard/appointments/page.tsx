import { Metadata } from 'next';
import { AppointmentTable } from '@/features/appointments/components/appointment-list/appointment-table';

export const metadata: Metadata = {
  title: 'Appointments - StateAI CRM',
  description: 'Manage your meetings and scheduled calls',
};

export default function AppointmentsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all upcoming meetings, calls, and events.
        </p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <AppointmentTable />
      </div>
    </div>
  );
}
