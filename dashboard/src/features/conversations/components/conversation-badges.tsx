import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Phone, MessageSquare, Mail, PhoneIncoming, PhoneOutgoing, Mic, Bot } from 'lucide-react';

interface ConversationStatusBadgeProps {
  status: string;
  className?: string;
}

export function ConversationStatusBadge({ status, className }: ConversationStatusBadgeProps) {
  const styles: Record<string, string> = {
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    missed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    voicemail: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    failed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  const labels: Record<string, string> = {
    completed: 'Completed',
    missed: 'Missed',
    voicemail: 'Voicemail',
    failed: 'Failed',
    in_progress: 'In Progress',
  };

  return (
    <Badge
      variant="outline"
      className={cn('font-medium border-none', styles[status] || styles.completed, className)}
    >
      {labels[status] || status}
    </Badge>
  );
}

interface ConversationTypeIconProps {
  type: string;
  direction?: string;
  className?: string;
}

export function ConversationTypeIcon({ type, direction, className }: ConversationTypeIconProps) {
  const iconProps = { className: cn("h-4 w-4", className) };

  if (type === 'inbound_call' || (type === 'call' && direction === 'inbound')) {
    return <PhoneIncoming {...iconProps} className={cn("text-blue-500", className)} />;
  }
  if (type === 'outbound_call' || (type === 'call' && direction === 'outbound')) {
    return <PhoneOutgoing {...iconProps} className={cn("text-emerald-500", className)} />;
  }
  if (type === 'sms') return <MessageSquare {...iconProps} className={cn("text-purple-500", className)} />;
  if (type === 'email') return <Mail {...iconProps} className={cn("text-amber-500", className)} />;
  
  return <Phone {...iconProps} />;
}
