import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointment.service';
import { AppointmentFormData, UpdateAppointmentFormData } from '../validation/appointment.schema';
import { ListParams } from '@/types';
import { toast } from 'sonner';

export const APPOINTMENTS_QUERY_KEY = 'appointments';
export const APPOINTMENT_QUERY_KEY = 'appointment';

export function useAppointments(params: ListParams) {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, params],
    queryFn: () => appointmentService.getAppointments(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useLeadAppointments(leadId: string) {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, 'lead', leadId],
    queryFn: () => appointmentService.getAppointmentsByLead(leadId),
    enabled: !!leadId,
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: [APPOINTMENT_QUERY_KEY, id],
    queryFn: () => appointmentService.getAppointment(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AppointmentFormData) => appointmentService.createAppointment(data),
    onSuccess: (newAppointment) => {
      toast.success('Appointment scheduled');
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      // Invalidate specific lead's appointments
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY, 'lead', newAppointment.leadId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule appointment');
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentFormData }) =>
      appointmentService.updateAppointment(id, data),
    onSuccess: (updatedAppointment) => {
      toast.success('Appointment updated');
      queryClient.setQueryData([APPOINTMENT_QUERY_KEY, updatedAppointment.$id], updatedAppointment);
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY, 'lead', updatedAppointment.leadId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update appointment');
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      toast.success('Appointment deleted');
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete appointment');
    },
  });
}
