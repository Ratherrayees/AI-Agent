'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { campaignSchema, CampaignFormData } from '../../validation/campaign.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/providers/auth-provider';

interface CampaignFormProps {
  initialData?: Partial<CampaignFormData>;
  onSubmit: (data: CampaignFormData) => void;
  isLoading?: boolean;
}

export function CampaignForm({ initialData, onSubmit, isLoading }: CampaignFormProps) {
  const { user } = useAuth();
  const isSuperAdmin = 
    (user?.prefs?.role as string) === 'superadmin' || 
    user?.prefs?.role === 'super_admin' || 
    user?.labels?.includes('superadmin') || 
    user?.labels?.includes('super_admin');

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      type: initialData?.type || 'outbound_call',
      status: initialData?.status || 'draft',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      budget: initialData?.budget || 0,
      aiAgentId: initialData?.aiAgentId || '',
      promptOverride: initialData?.promptOverride || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Campaign Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Q3 Outreach" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type *</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="outbound_call">Outbound AI Calls</SelectItem>
                    <SelectItem value="sms">SMS Marketing</SelectItem>
                    <SelectItem value="email">Email Sequence</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status *</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" disabled={isLoading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isSuperAdmin && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Autonomous Voice Model Configuration [Admin Only]</h4>
            
            <FormField
              control={form.control}
              name="aiAgentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice Model Profile ID</FormLabel>
                  <FormControl>
                    <Input placeholder="voice_model_xxxxxx" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormDescription>
                    Assign the specific conversational AI voice model profile to automate outbound calls for this campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="promptOverride"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Prompt Override</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Specific instructions for the AI voice model for this campaign..." 
                      className="min-h-[100px] font-mono text-sm"
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    These instructions will dynamically customize the voice model&apos;s behavior and qualification flow during calls.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Campaign goals, target audience..." 
                  disabled={isLoading} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Campaign'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
