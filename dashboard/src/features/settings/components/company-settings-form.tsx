'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySettingsSchema, CompanySettingsFormData } from '../validation/settings.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCompanySettings, useSaveCompanySettings } from '../hooks/use-settings';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';

export function CompanySettingsForm() {
  const { user } = useAuth();
  const isSuperAdmin = 
    (user?.prefs?.role as string) === 'superadmin' || 
    user?.prefs?.role === 'super_admin' || 
    user?.labels?.includes('superadmin') || 
    user?.labels?.includes('super_admin');

  const { data: settings, isLoading } = useCompanySettings();
  const { mutate: saveSettings, isPending } = useSaveCompanySettings();

  const form = useForm<CompanySettingsFormData>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      companyName: '',
      website: '',
      supportEmail: '',
      supportPhone: '',
      address: '',
      timezone: 'America/New_York',
      elevenLabsAgentId: '',
    },
  });

  // Load initial data
  useEffect(() => {
    if (settings) {
      form.reset({
        companyName: settings.companyName || '',
        website: settings.website || '',
        supportEmail: settings.supportEmail || '',
        supportPhone: settings.supportPhone || '',
        address: settings.address || '',
        timezone: settings.timezone || 'America/New_York',
        elevenLabsAgentId: settings.elevenLabsAgentId || '',
      });
    }
  }, [settings, form]);

  const onSubmit = (data: CompanySettingsFormData) => {
    saveSettings({ id: settings?.$id || null, data });
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
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://acme.com" disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="supportEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Email</FormLabel>
                  <FormControl>
                    <Input placeholder="support@acme.com" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supportPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-1234" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St..." disabled={isPending} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Timezone</FormLabel>
                <FormControl>
                  <Input disabled={isPending} {...field} />
                </FormControl>
                <FormDescription>
                  Ensure your team&apos;s workspace represents your brand accurately.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isSuperAdmin && (
          <div className="space-y-4 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium">Global Voice Engine Integration [Admin Only]</h3>
            
            <FormField
              control={form.control}
              name="elevenLabsAgentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Voice Model Profile ID</FormLabel>
                  <FormControl>
                    <Input placeholder="voice_model_xxxxxx" disabled={isPending} {...field} />
                  </FormControl>
                  <FormDescription>
                    This voice profile ID will be used as the fallback for any campaigns or calls that don&apos;t specify their own model.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="flex justify-start">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
