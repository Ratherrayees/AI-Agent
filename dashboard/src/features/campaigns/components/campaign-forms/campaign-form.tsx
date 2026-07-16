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
                  value={field.value || ''}
                  defaultValue={field.value || ''}
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
                  value={field.value || ''}
                  defaultValue={field.value || ''}
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

        <div className="space-y-4 border-t pt-4 bg-muted/20 p-4 rounded-xl border border-border/60">
            <h4 className="font-semibold text-xs text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span>Autonomous Voice Model Configuration</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">AI Agent Setup</span>
            </h4>
            
            <FormField
              control={form.control}
              name="aiAgentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Select Voice Agent Model *</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(val) => {
                      field.onChange(val);
                    }}
                    value={field.value || 'agent_0801kxfte8gwe8sstnppq2k5mf4z'}
                    defaultValue={field.value || 'agent_0801kxfte8gwe8sstnppq2k5mf4z'}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background font-medium">
                        <SelectValue placeholder="Select an Autonomous Voice Agent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="agent_0801kxfte8gwe8sstnppq2k5mf4z" className="font-medium">
                        🤖 StateAI Outbound Sales Specialist (VIP Villa Tour & Qualification) [Recommended]
                      </SelectItem>
                      <SelectItem value="agent_0801kxfrx9xbe8s8fcyz2k9m">
                        🏛️ Luxury Property & Estate Consultant (High-Ticket Buyers)
                      </SelectItem>
                      <SelectItem value="agent_0902kxftx8ewe8sstnppq2k5">
                        📞 Real Estate Follow-up Specialist & Appointment Setter
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Choose the pre-trained conversational AI voice agent profile that will conduct your phone calls.
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <FormLabel className="text-sm font-semibold">Campaign Prompt Override</FormLabel>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => field.onChange(`[Standard Outbound Protocol]\nAgent will introduce StateAI Realty, verify lead qualification criteria (budget, move-in timeline, location preference inside downtown/villas), and attempt to schedule an on-site villa tour.`)}
                        className="text-[11px] px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors border border-primary/20"
                      >
                        ⚡ Preset: VIP Villa Tour
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(`[Investor Outreach Protocol]\nAgent will introduce new off-plan luxury villa launch with 10% down payment and 8% guaranteed ROI. Verify investor readiness and schedule a private meeting with senior investment advisors.`)}
                        className="text-[11px] px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-medium transition-colors border border-blue-500/20"
                      >
                        🏢 Preset: Off-Plan Investor
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(`[Warm Follow-Up Protocol]\nCheck in with lead regarding past property inquiry. Ask if they are still actively searching in the market or have already purchased. Offer exclusive private listings.`)}
                        className="text-[11px] px-2 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-medium transition-colors border border-amber-500/20"
                      >
                        📅 Preset: Warm Follow-up
                      </button>
                    </div>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Select a preset button above or type custom instructions for the AI voice model..." 
                      className="min-h-[110px] font-mono text-xs bg-background leading-relaxed"
                      disabled={isLoading} 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Click a preset above to auto-fill proven qualification instructions, or edit directly in the text box.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
