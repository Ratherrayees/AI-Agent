'use client';

import { useLeadAppointments } from '../hooks/use-appointments';
import { Loader2, Calendar as CalendarIcon, Clock, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { AppointmentStatusBadge } from './appointment-status-badge';
import { CreateAppointmentDialog } from './appointment-forms/create-appointment-dialog';
import { MEETING_TYPE_LABELS } from '../constants/appointment-constants';

interface LeadAppointmentListProps {
  leadId: string;
}

const getMeetingIcon = (type: string) => {
  switch (type) {
    case 'video_meeting':
    case 'zoom':
    case 'google_meet':
      return <Video className="h-4 w-4 text-muted-foreground" />;
    case 'phone_call':
      return <Phone className="h-4 w-4 text-muted-foreground" />;
    default:
      return <CalendarIcon className="h-4 w-4 text-muted-foreground" />;
  }
};

export function LeadAppointmentList({ leadId }: LeadAppointmentListProps) {
  const { data: appointments, isLoading } = useLeadAppointments(leadId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Scheduled Meetings</h3>
        <CreateAppointmentDialog />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : appointments && appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div key={apt.$id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-full shrink-0">
                  {getMeetingIcon(apt.meetingType)}
                </div>
                <div>
                  <h4 className="font-semibold">{apt.title}</h4>
                  <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {format(new Date(`${apt.date}T00:00:00`), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {apt.startTime} - {apt.endTime}
                    </span>
                    <span>• {MEETING_TYPE_LABELS[apt.meetingType]}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <AppointmentStatusBadge status={apt.status} />
                {apt.meetingLink && (
                  <a href={apt.meetingLink} target="_blank" rel="noopener noreferrer" className="w-full h-full">
                    <Button variant="outline" size="sm" className="w-full h-full">
                      Join
                    </Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed flex flex-col items-center justify-center">
          <CalendarIcon className="h-8 w-8 mb-4 text-muted-foreground/50" />
          <p className="font-medium">No appointments scheduled</p>
          <p className="text-sm">Schedule a meeting or call with this lead.</p>
        </div>
      )}
    </div>
  );
}
