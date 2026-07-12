import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Target, MessageSquare, Mail, Phone } from 'lucide-react';

interface CampaignStatusBadgeProps {
  status: string;
  className?: string;
}

export function CampaignStatusBadge({ status, className }: CampaignStatusBadgeProps) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    paused: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-medium border-none capitalize', styles[status] || styles.draft, className)}
    >
      {status}
    </Badge>
  );
}

interface CampaignTypeIconProps {
  type: string;
  className?: string;
}

export function CampaignTypeIcon({ type, className }: CampaignTypeIconProps) {
  const iconProps = { className: cn("h-4 w-4 text-muted-foreground", className) };

  if (type === 'outbound_call') return <Phone {...iconProps} />;
  if (type === 'sms') return <MessageSquare {...iconProps} />;
  if (type === 'email') return <Mail {...iconProps} />;
  
  return <Target {...iconProps} />;
}
