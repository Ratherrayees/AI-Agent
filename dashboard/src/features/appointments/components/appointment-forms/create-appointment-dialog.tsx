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
import { CalendarPlus } from 'lucide-react';
import { AppointmentForm } from './appointment-form';
import { useCreateAppointment } from '../../hooks/use-appointments';

export function CreateAppointmentDialog() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateAppointment();

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
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        }
      />
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>
            Book a new meeting or call with a lead.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <AppointmentForm onSubmit={handleSubmit} isLoading={isPending} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
