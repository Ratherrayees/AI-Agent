/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import { CompanySettingsFormData, BusinessHoursFormData } from '../validation/settings.schema';
import { toast } from 'sonner';

export const SETTINGS_QUERY_KEY = 'company-settings';
export const HOURS_QUERY_KEY = 'business-hours';

export function useCompanySettings() {
  return useQuery({
    queryKey: [SETTINGS_QUERY_KEY],
    queryFn: () => settingsService.getCompanySettings(),
  });
}

export function useSaveCompanySettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: CompanySettingsFormData }) =>
      settingsService.updateCompanySettings(id, data),
    onSuccess: () => {
      toast.success('Company settings saved successfully');
      queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save settings');
    },
  });
}

export function useBusinessHours() {
  return useQuery({
    queryKey: [HOURS_QUERY_KEY],
    queryFn: () => settingsService.getBusinessHours(),
  });
}

export function useSaveBusinessHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: BusinessHoursFormData }) =>
      settingsService.updateBusinessHours(id, data),
    onSuccess: () => {
      toast.success('Business hours saved successfully');
      queryClient.invalidateQueries({ queryKey: [HOURS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save business hours');
    },
  });
}
