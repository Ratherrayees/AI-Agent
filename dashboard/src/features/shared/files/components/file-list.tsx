'use client';

import { useRef } from 'react';
import { useFiles, useUploadFile, useDeleteFile } from '../hooks/use-files';
import { fileService } from '../services/file.service';
import { Loader2, Upload, Trash2, FileIcon, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

interface FileListProps {
  entityType: 'leadId' | 'conversationId' | 'campaignId';
  entityId: string;
}

export function FileList({ entityType, entityId }: FileListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: files, isLoading } = useFiles(entityType, entityId);
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile(entityType, entityId);
  const { mutate: deleteFile, isPending: isDeleting } = useDeleteFile(entityType, entityId);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && user) {
      uploadFile({ file: selectedFile, uploaderId: user.$id });
    }
    // Reset input so the same file can be uploaded again if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Attachments</h3>
        <div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload File
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : files && files.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <div key={file.$id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm flex items-start gap-3">
              <div className="p-2 bg-muted rounded">
                <FileIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatBytes(file.size)} • {new Date(file.$createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => window.open(fileService.getFileViewUrl(file.bucketId, file.fileId), '_blank')}
                  >
                    <Eye className="h-3 w-3 mr-1" /> View
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={() => window.open(fileService.getFileDownloadUrl(file.bucketId, file.fileId), '_blank')}
                  >
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                disabled={isDeleting}
                onClick={() => deleteFile({ id: file.$id, bucketId: file.bucketId, fileId: file.fileId })}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed flex flex-col items-center justify-center">
          <Upload className="h-8 w-8 mb-4 text-muted-foreground/50" />
          <p className="font-medium">No files uploaded yet</p>
          <p className="text-sm">Upload documents, images, or audio recordings related to this lead.</p>
        </div>
      )}
    </div>
  );
}
