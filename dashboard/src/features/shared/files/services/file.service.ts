import { databases, storage, DATABASE_ID, COLLECTION_IDS, BUCKET_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { FileRecord } from '@/types';

export const fileService = {
  async getFilesByEntity(entityType: 'leadId' | 'conversationId' | 'campaignId', entityId: string): Promise<FileRecord[]> {
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.FILES,
      [
        Query.equal(entityType, entityId),
        Query.orderDesc('$createdAt'),
      ]
    );
    return response.documents as unknown as FileRecord[];
  },

  async uploadFile(file: File, entityType: string, entityId: string, uploaderId: string): Promise<FileRecord> {
    // 1. Upload to storage bucket
    const uploadedFile = await storage.createFile(
      BUCKET_IDS.DOCUMENTS,
      ID.unique(),
      file
    );

    // 2. Create DB record for metadata and relationship
    const fileRecord = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.FILES,
      ID.unique(),
      {
        name: file.name,
        bucketId: BUCKET_IDS.DOCUMENTS,
        fileId: uploadedFile.$id,
        mimeType: file.type,
        size: file.size,
        [entityType]: entityId,
        uploadedById: uploaderId,
      }
    );

    return fileRecord as unknown as FileRecord;
  },

  async deleteFile(id: string, bucketId: string, fileId: string): Promise<void> {
    // 1. Delete from DB
    await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.FILES, id);
    
    // 2. Delete from Storage
    await storage.deleteFile(bucketId, fileId);
  },
  
  getFileViewUrl(bucketId: string, fileId: string): string {
    return storage.getFileView(bucketId, fileId).toString();
  },
  
  getFileDownloadUrl(bucketId: string, fileId: string): string {
    return storage.getFileDownload(bucketId, fileId).toString();
  }
};
