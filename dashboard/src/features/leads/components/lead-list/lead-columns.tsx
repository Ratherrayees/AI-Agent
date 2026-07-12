'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Lead } from '@/types';
import { LeadStatusBadge } from '../lead-status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
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
import { useDeleteLead } from '../../hooks/use-delete-lead';

export const leadColumns: ColumnDef<Lead>[] = [
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
    accessorKey: 'firstName',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <Link
          href={`/dashboard/leads/${lead.$id}`}
          className="font-medium hover:underline text-primary"
        >
          {lead.firstName} {lead.lastName}
        </Link>
      );
    },
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => {
      const company = row.getValue('company') as string;
      const title = row.original.jobTitle;
      
      if (!company && !title) return <span className="text-muted-foreground">-</span>;
      
      return (
        <div className="flex flex-col">
          <span>{company || '-'}</span>
          {title && <span className="text-xs text-muted-foreground">{title}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: 'leadStatus',
    header: 'Status',
    cell: ({ row }) => {
      return <LeadStatusBadge status={row.getValue('leadStatus')} />;
    },
  },
  {
    accessorKey: 'phone',
    header: 'Contact',
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string;
      const email = row.original.email;
      
      return (
        <div className="flex flex-col">
          <span>{phone}</span>
          {email && <span className="text-xs text-muted-foreground">{email}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: '$createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('$createdAt'));
      return (
        <span className="text-muted-foreground">
          {date.toLocaleDateString()}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const lead = row.original;
      const { deleteLead, isDeleting } = useDeleteLead();

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
              <DropdownMenuItem
                render={
                  <Link href={`/dashboard/leads/${lead.$id}`}>
                    View details
                  </Link>
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Edit Lead
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => deleteLead(lead.$id)}
              disabled={isDeleting}
            >
              Delete Lead
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
