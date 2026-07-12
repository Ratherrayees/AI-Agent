import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customFieldService } from '../services/custom-field.service';
import { CustomFieldFormData } from '../validation/custom-field.schema';
import { toast } from 'sonner';

export function useCustomFields(entity?: string) {
  return useQuery({
    queryKey: ['custom_fields', entity],
    queryFn: () => customFieldService.getCustomFields(entity),
  });
}

export function useCreateCustomField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CustomFieldFormData) => customFieldService.createCustomField(data),
    onSuccess: () => {
      toast.success('Custom field created');
      queryClient.invalidateQueries({ queryKey: ['custom_fields'] });
    },
  });
}

export function useDeleteCustomField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customFieldService.deleteCustomField(id),
    onSuccess: () => {
      toast.success('Custom field deleted');
      queryClient.invalidateQueries({ queryKey: ['custom_fields'] });
    },
  });
}
