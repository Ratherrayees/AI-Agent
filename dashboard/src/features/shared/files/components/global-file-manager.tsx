'use client';

import { useQuery } from '@tanstack/react-query';
import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileIcon, Download, Trash2, Folder, HardDriveUpload } from 'lucide-react';
import { format } from 'date-fns';
import { formatBytes } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function GlobalFileManager() {
  const { data, isLoading } = useQuery({
    queryKey: ['global_files'],
    queryFn: async () => {
      return await databases.listDocuments(DATABASE_ID, COLLECTION_IDS.FILES, [
        Query.orderDesc('$createdAt')
      ]);
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">All Uploaded Assets</h4>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Folder className="h-4 w-4 mr-2" />
            New Folder
          </Button>
          <Button size="sm">
            <HardDriveUpload className="h-4 w-4 mr-2" />
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
                    {file.entityType ? (
                      <Badge variant="secondary" className="capitalize">
                        {file.entityType}
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
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
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
