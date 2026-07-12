import { Badge } from '@/components/ui/badge';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '../constants/lead-constants';
import { LeadStatus } from '@/types';
import { cn } from '@/lib/utils';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  const label = LEAD_STATUS_LABELS[status] || status;
  const colorClass = LEAD_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <Badge
      variant="outline"
      className={cn('font-medium border-none', colorClass, className)}
    >
      {label}
    </Badge>
  );
}
