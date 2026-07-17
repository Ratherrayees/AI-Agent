'use client';

import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { databases, storage, DATABASE_ID, COLLECTION_IDS, BUCKET_IDS } from '@/lib/appwrite';
import { ID, Query } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon, Download, Trash2, Folder, HardDriveUpload, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { formatBytes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/providers/auth-provider';
import { toast } from 'sonner';

export function GlobalFileManager() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['global_files'],
    queryFn: async () => {
      return await databases.listDocuments(DATABASE_ID, COLLECTION_IDS.FILES, [
        Query.orderDesc('$createdAt')
      ]);
    }
  });

  const { mutate: uploadFile, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const targetBucket = BUCKET_IDS.DOCUMENTS;
      const uploadedFile = await storage.createFile(
        targetBucket,
        ID.unique(),
        file
      );

      return await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.FILES,
        ID.unique(),
        {
          name: file.name,
          bucketId: targetBucket,
          fileId: uploadedFile.$id,
          mimeType: file.type,
          size: file.size,
          category: 'document',
          uploadedById: user?.$id || 'system',
          uploadedBy: user?.name || 'System',
        }
      );
    },
    onSuccess: () => {
      toast.success('File uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['global_files'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload file');
    }
  });

  const { mutate: deleteFile, isPending: isDeleting } = useMutation({
    mutationFn: async ({ id, bucketId, fileId }: { id: string; bucketId: string; fileId: string }) => {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.FILES, id);
      await storage.deleteFile(bucketId, fileId);
    },
    onSuccess: () => {
      toast.success('File deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['global_files'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete file');
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      uploadFile(selectedFile);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = (bucketId: string, fileId: string) => {
    try {
      const url = storage.getFileDownload(bucketId, fileId).toString();
      window.open(url, '_blank');
    } catch (e: any) {
      toast.error('Failed to get download URL');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">All Uploaded Assets</h4>
        <div className="flex gap-2">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <Button 
            variant="outline" 
            size="sm" 
            disabled
            title="Folder support coming in next phase"
          >
            <Folder className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button 
            size="sm" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <HardDriveUpload className="h-4 w-4 mr-2" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Entity Link</TableHead>
              <TableHead>Uploaded By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading files...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((file) => (
                <TableRow key={file.$id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileIcon className="h-4 w-4 mr-2 text-blue-500" />
                      {file.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatBytes(file.size)}
                  </TableCell>
                  <TableCell>
                    {file.entityType || file.leadId || file.campaignId || file.conversationId ? (
                      <Badge variant="secondary" className="capitalize">
                        {file.entityType || (file.leadId ? 'Lead' : file.campaignId ? 'Campaign' : 'Conversation')}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {file.uploadedBy || 'System'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(file.$createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => handleDownload(file.bucketId, file.fileId)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteFile({ id: file.$id, bucketId: file.bucketId, fileId: file.fileId })}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Folder className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  No files have been uploaded yet.<br/>
                  <span className="text-xs mt-1 block">
                    Upload contracts, floor plans, or call scripts here.
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
