'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Campaign } from '@/types';
import { CampaignStatusBadge, CampaignTypeIcon } from '../campaign-badges';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Bot } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export const campaignColumns: ColumnDef<Campaign>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Campaign Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const campaign = row.original;
      return (
        <div className="flex flex-col ml-4">
          <Link
            href={`/dashboard/campaigns/${campaign.$id}`}
            className="font-medium text-primary hover:underline"
          >
            {campaign.name}
          </Link>
          <span className="text-xs text-muted-foreground flex items-center mt-1">
            <CampaignTypeIcon type={campaign.type} className="mr-1 h-3 w-3" />
            {campaign.type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return <CampaignStatusBadge status={row.getValue('status')} />;
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Timeline',
    cell: ({ row }) => {
      const start = row.getValue('startDate') as string;
      const end = row.original.endDate;
      
      if (!start) return <span className="text-muted-foreground">Not set</span>;
      
      return (
        <div className="flex flex-col text-sm">
          <span>{format(new Date(start), 'MMM d, yyyy')}</span>
          {end && <span className="text-muted-foreground">to {format(new Date(end), 'MMM d, yyyy')}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'aiAgentId',
    header: 'AI Agent',
    cell: ({ row }) => {
      const agentId = row.getValue('aiAgentId') as string;
      if (!agentId) return <span className="text-muted-foreground">-</span>;
      
      return (
        <span className="inline-flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
          <Bot className="h-3 w-3 mr-1" />
          Configured
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link href={`/dashboard/campaigns/${row.original.$id}`}>
          <Button variant="outline" size="sm">
            Manage
          </Button>
        </Link>
      );
    },
  },
];
