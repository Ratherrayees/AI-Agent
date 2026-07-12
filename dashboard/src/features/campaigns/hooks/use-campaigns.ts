import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaign.service';
import { CampaignFormData, UpdateCampaignFormData } from '../validation/campaign.schema';
import { ListParams } from '@/types';
import { toast } from 'sonner';

export const CAMPAIGNS_QUERY_KEY = 'campaigns';
export const CAMPAIGN_QUERY_KEY = 'campaign';

export function useCampaigns(params: ListParams) {
  return useQuery({
    queryKey: [CAMPAIGNS_QUERY_KEY, params],
    queryFn: () => campaignService.getCampaigns(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [CAMPAIGN_QUERY_KEY, id],
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CampaignFormData) => campaignService.createCampaign(data),
    onSuccess: () => {
      toast.success('Campaign created successfully');
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create campaign');
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignFormData }) =>
      campaignService.updateCampaign(id, data),
    onSuccess: (updatedCampaign) => {
      toast.success('Campaign updated');
      queryClient.setQueryData([CAMPAIGN_QUERY_KEY, updatedCampaign.$id], updatedCampaign);
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update campaign');
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => campaignService.deleteCampaign(id),
    onSuccess: () => {
      toast.success('Campaign deleted');
      queryClient.invalidateQueries({ queryKey: [CAMPAIGNS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete campaign');
    },
  });
}
