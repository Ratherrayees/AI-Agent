'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteSchema, NoteFormData } from '../validation/note.schema';
import { useCreateNote } from '../hooks/use-notes';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface NoteFormProps {
  entityType: 'leadId' | 'conversationId' | 'appointmentId' | 'campaignId';
  entityId: string;
}

export function NoteForm({ entityType, entityId }: NoteFormProps) {
  const { user } = useAuth();
  const { mutate: createNote, isPending } = useCreateNote(entityType, entityId);

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: '',
      [entityType]: entityId,
      createdById: user?.$id || '',
    },
  });

  const onSubmit = (data: NoteFormData) => {
    // Ensure creator ID is injected if it was missing during initial render
    const payload = { ...data, createdById: user?.$id || data.createdById };
    
    createNote(payload, {
      onSuccess: () => {
        form.reset({
          content: '',
          [entityType]: entityId,
          createdById: user?.$id || '',
        });
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Type your note here..."
                    className="min-h-[100px] resize-y pr-12"
                    disabled={isPending}
                    {...field}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute bottom-2 right-2 h-8 w-8"
                    disabled={isPending || !field.value.trim()}
                  >
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Save Note</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
