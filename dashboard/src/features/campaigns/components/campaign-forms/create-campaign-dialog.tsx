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
import { CampaignForm } from './campaign-form';
import { useCreateCampaign } from '../../hooks/use-campaigns';

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateCampaign();

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
            Create Campaign
          </Button>
        }
      />
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Configure a new outreach campaign. Link an Autonomous Voice Model to automate outbound calls.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <CampaignForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
