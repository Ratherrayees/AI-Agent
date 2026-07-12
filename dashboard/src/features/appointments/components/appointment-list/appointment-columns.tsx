'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Appointment } from '@/types';
import { AppointmentStatusBadge } from '../appointment-status-badge';
import { MEETING_TYPE_LABELS } from '../../constants/appointment-constants';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown, Calendar, Video, Phone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { format } from 'date-fns';

const getMeetingIcon = (type: string) => {
  switch (type) {
    case 'video_meeting':
    case 'zoom':
    case 'google_meet':
      return <Video className="h-4 w-4 mr-2 text-muted-foreground" />;
    case 'phone_call':
      return <Phone className="h-4 w-4 mr-2 text-muted-foreground" />;
    default:
      return <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />;
  }
};

export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title & Type',
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{appointment.title}</span>
          <span className="text-xs text-muted-foreground flex items-center mt-1">
            {getMeetingIcon(appointment.meetingType)}
            {MEETING_TYPE_LABELS[appointment.meetingType] || appointment.meetingType}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const apt = row.original;
      // Combine date and time for display
      const dateObj = new Date(`${apt.date}T${apt.startTime}:00`);
      
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(dateObj, 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-muted-foreground">
            {apt.startTime} - {apt.endTime}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'leadId',
    header: 'Lead',
    cell: ({ row }) => {
      // In a real app with joined queries, we'd display the lead name here.
      // For now, since Appwrite doesn't do deep populate automatically in listDocuments without relational attributes (in some setups),
      // we'll just show the ID or a link. A better approach is fetching the lead data in the UI or having a denormalized leadName field.
      const leadId = row.getValue('leadId') as string;
      
      return (
        <Link
          href={`/dashboard/leads/${leadId}`}
          className="text-sm text-primary hover:underline"
        >
          View Lead
        </Link>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <AppointmentStatusBadge status={row.getValue('status')} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const appointment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {appointment.meetingLink && (
                <DropdownMenuItem
                  render={
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  Join Meeting
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Edit Appointment
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem className="text-destructive">
              Cancel Appointment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
