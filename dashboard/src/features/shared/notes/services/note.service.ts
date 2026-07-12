import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Note } from '@/types';
import { NoteFormData } from '../validation/note.schema';

export const noteService = {
  async getNotesByEntity(entityType: 'leadId' | 'conversationId' | 'appointmentId' | 'campaignId', entityId: string): Promise<Note[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.NOTES,
      [
        Query.equal(entityType, entityId),
        Query.orderDesc('$createdAt'),
        Query.limit(50),
      ]
    );

    return response.documents as unknown as Note[];
  },

  async createNote(data: NoteFormData): Promise<Note> {
    return (await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.NOTES,
      ID.unique(),
      data as any
    )) as unknown as Note;
  },

  async deleteNote(id: string): Promise<void> {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.NOTES, id);
  },
};
