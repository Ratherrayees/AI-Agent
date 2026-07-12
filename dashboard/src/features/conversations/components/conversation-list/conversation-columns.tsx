'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Conversation } from '@/types';
import { ConversationStatusBadge, ConversationTypeIcon } from '../conversation-badges';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, PlayCircle, FileText, Bot } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export const conversationColumns: ColumnDef<Conversation>[] = [
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
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const conv = row.original;
      return (
        <div className="flex items-center gap-2">
          <ConversationTypeIcon type={conv.type} direction={conv.direction} />
          <span className="capitalize hidden sm:inline-block">
            {conv.type.replace('_', ' ')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'leadId',
    header: 'Lead',
    cell: ({ row }) => {
      const leadId = row.getValue('leadId') as string;
      return (
        <Link
          href={`/dashboard/leads/${leadId}`}
          className="text-sm font-medium hover:underline flex flex-col"
        >
          <span>View Lead</span>
          <span className="text-xs text-muted-foreground font-normal">{leadId.slice(0, 8)}...</span>
        </Link>
      );
    },
  },
  {
    accessorKey: '$createdAt',
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
      const date = new Date(row.getValue('$createdAt'));
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {format(date, 'MMM d, yyyy')}
          </span>
          <span className="text-xs text-muted-foreground">
            {format(date, 'h:mm a')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'durationSeconds',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('durationSeconds') as number;
      if (!duration) return <span className="text-muted-foreground">-</span>;
      
      const mins = Math.floor(duration / 60);
      const secs = duration % 60;
      return (
        <span>
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <ConversationStatusBadge status={row.getValue('status')} />;
    },
  },
  {
    id: 'features',
    header: 'Features',
    cell: ({ row }) => {
      const conv = row.original;
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          {conv.recordingUrl && <PlayCircle className="h-4 w-4" />}
          {conv.transcript && <FileText className="h-4 w-4" />}
          {conv.agentId && <Bot className="h-4 w-4 text-primary" />}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const conv = row.original;
      return (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            // Because the columns are defined outside the component, 
            // a better approach is passing an onRowClick to the table body below.
            // But for simplicity in this file, we can just let row click handle it.
          }}
          className="pointer-events-none"
        >
          View Details
        </Button>
      );
    },
  },
];
