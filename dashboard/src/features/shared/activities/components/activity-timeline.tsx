'use client';

import { useActivities } from '../hooks/use-activities';
import { format } from 'date-fns';
import { CheckCircle2, PhoneCall, Calendar, Mail, FileText, User as UserIcon, Loader2, Plus, Edit2, Phone, ArrowRightCircle } from 'lucide-react';

interface ActivityTimelineProps {
  leadId: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'lead_created':
      return <Plus className="h-4 w-4 text-emerald-500" />;
    case 'lead_updated':
      return <Edit2 className="h-4 w-4 text-blue-500" />;
    case 'note_added':
      return <FileText className="h-4 w-4 text-amber-500" />;
    case 'call_logged':
      return <Phone className="h-4 w-4 text-indigo-500" />;
    case 'email_sent':
      return <Mail className="h-4 w-4 text-purple-500" />;
    case 'appointment_scheduled':
      return <Calendar className="h-4 w-4 text-pink-500" />;
    case 'status_changed':
      return <ArrowRightCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-primary" />;
  }
};

export function ActivityTimeline({ leadId }: ActivityTimelineProps) {
  const { data: activities, isLoading } = useActivities(leadId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        No activities recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
      {activities.map((activity) => (
        <div key={activity.$id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Timeline Node */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
            {getActivityIcon(activity.type)}
          </div>
          
          {/* Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border bg-card shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
              <div className="font-semibold">{activity.title}</div>
              <time className="text-xs text-muted-foreground font-medium sm:ml-2">
                {format(new Date(activity.$createdAt), 'MMM d, h:mm a')}
              </time>
            </div>
            {activity.description && (
              <div className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
