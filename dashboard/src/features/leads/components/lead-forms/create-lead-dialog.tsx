'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LeadForm } from './lead-form';
import { useCreateLead } from '../../hooks/use-create-lead';

export function CreateLeadDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateLead();

  const handleSubmit = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        }
      />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Lead</DialogTitle>
          <DialogDescription>
            Add a new lead to the CRM. Only name and phone are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <LeadForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
