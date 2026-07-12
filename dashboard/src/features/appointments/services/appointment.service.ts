import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Appointment, PaginatedResponse, ListParams } from '@/types';
import { AppointmentFormData, UpdateAppointmentFormData } from '../validation/appointment.schema';

export const appointmentService = {
  async getAppointments(params: ListParams): Promise<PaginatedResponse<Appointment>> {
    const queries = [];
    
    // Sort by date (upcoming first)
    if (params.sortField && params.sortOrder) {
      if (params.sortOrder === 'asc') {
        queries.push(Query.orderAsc(params.sortField));
      } else {
        queries.push(Query.orderDesc(params.sortField));
      }
    } else {
      queries.push(Query.orderDesc('date'));
      queries.push(Query.orderDesc('startTime'));
    }

    if (params.page && params.pageSize) {
      queries.push(Query.limit(params.pageSize));
      queries.push(Query.offset((params.page - 1) * params.pageSize));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      queries
    );

    return {
      documents: response.documents as unknown as Appointment[],
      total: response.total,
    };
  },
  
  async getAppointmentsByLead(leadId: string): Promise<Appointment[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      [
        Query.equal('leadId', leadId),
        Query.orderDesc('date'),
        Query.orderDesc('startTime')
      ]
    );

    return response.documents as unknown as Appointment[];
  },

  async getAppointment(id: string): Promise<Appointment> {
    return (await databases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      id
    )) as Appointment;
  },

  async createAppointment(data: AppointmentFormData): Promise<Appointment> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      ID.unique(),
      {
        ...data,
        createdById: data.createdById || '',
      }
    )) as unknown as Appointment;
  },

  async updateAppointment(id: string, data: UpdateAppointmentFormData): Promise<Appointment> {
    return (await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.APPOINTMENTS,
      id,
      data as any
    )) as unknown as Appointment;
  },

  async deleteAppointment(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.APPOINTMENTS, id);
  },
};
