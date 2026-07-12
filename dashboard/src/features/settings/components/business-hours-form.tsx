'use client';

import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessHoursSchema, BusinessHoursFormData } from '../validation/settings.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useBusinessHours, useSaveBusinessHours } from '../hooks/use-settings';
import { Loader2 } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function BusinessHoursForm() {
  const { data: hoursDoc, isLoading } = useBusinessHours();
  const { mutate: saveHours, isPending } = useSaveBusinessHours();

  const form = useForm<BusinessHoursFormData>({
    resolver: zodResolver(businessHoursSchema),
    defaultValues: DAYS.reduce((acc, day) => {
      acc[day] = { 
        isOpen: !['saturday', 'sunday'].includes(day), 
        open: '09:00', 
        close: '17:00' 
      };
      return acc;
    }, {} as any),
  });

  useEffect(() => {
    if (hoursDoc && hoursDoc.scheduleJson) {
      try {
        const parsed = JSON.parse(hoursDoc.scheduleJson);
        form.reset(parsed);
      } catch (e) {
        console.error('Failed to parse business hours JSON', e);
      }
    }
  }, [hoursDoc, form]);

  const onSubmit = (data: BusinessHoursFormData) => {
    saveHours({ id: hoursDoc?.$id || null, data });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        
        <div className="space-y-4">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-4 w-40">
                <FormField
                  control={form.control}
                  name={`${day}.isOpen` as any}
                  render={({ field }) => (
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  )}
                />
                <span className="font-medium capitalize">{day}</span>
              </div>
              
              {form.watch(`${day}.isOpen` as any) ? (
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name={`${day}.open` as any}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input type="time" disabled={isPending} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className="text-muted-foreground">to</span>
                  <FormField
                    control={form.control}
                    name={`${day}.close` as any}
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input type="time" disabled={isPending} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground w-[240px] text-center">
                  Closed
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-start pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Business Hours'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
