'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search, User, Calendar, Megaphone, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search CRM...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search leads, appointments, campaigns..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/leads'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Go to Leads</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/appointments'))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Go to Appointments</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/campaigns'))}>
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Go to Campaigns</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/files'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Go to File Manager</span>
            </CommandItem>
          </CommandGroup>
          
          {/* Real search integration would dynamically fetch and populate these groups using Appwrite Queries */}
          <CommandGroup heading="Recent Leads (Mock)">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/leads/mock_1'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Alice Johnson</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/leads/mock_2'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Bob Smith</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
