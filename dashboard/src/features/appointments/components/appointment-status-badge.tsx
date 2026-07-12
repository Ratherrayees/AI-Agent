import { Badge } from '@/components/ui/badge';
import { APPOINTMENT_STATUS_LABELS, APPOINTMENT_STATUS_COLORS } from '../constants/appointment-constants';
import { AppointmentStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const label = APPOINTMENT_STATUS_LABELS[status] || status;
  const colorClass = APPOINTMENT_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <Badge
      variant="outline"
      className={cn('font-medium border-none', colorClass, className)}
    >
      {label}
    </Badge>
  );
}
