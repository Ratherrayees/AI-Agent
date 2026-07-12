'use client';

import { useKnowledgeSources, useDeleteKnowledgeSource } from '../hooks/use-knowledge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Link as LinkIcon, File, Book, Trash2, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function KnowledgeList() {
  const { data, isLoading } = useKnowledgeSources();
  const { mutate: deleteSource, isPending: isDeleting } = useDeleteKnowledgeSource();

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="h-4 w-4 text-rose-500" />;
      case 'url': return <LinkIcon className="h-4 w-4 text-blue-500" />;
      case 'doc': return <File className="h-4 w-4 text-blue-600" />;
      default: return <Book className="h-4 w-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Catalog of AI Knowledge Assets</h4>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Catalog Source
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Voice Profile ID</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading knowledge sources...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((source) => (
                <TableRow key={source.$id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getIcon(source.documentType)}
                      <div>
                        <div>{source.name}</div>
                        {source.description && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {source.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {source.elevenLabsAgentId}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{source.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      {source.syncStatus === 'synced' && <div className="h-2 w-2 rounded-full bg-emerald-500" />}
                      {source.syncStatus === 'pending' && <div className="h-2 w-2 rounded-full bg-amber-500" />}
                      {source.syncStatus === 'error' && <div className="h-2 w-2 rounded-full bg-rose-500" />}
                      <span className="capitalize">{source.syncStatus}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(source.$updatedAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2" title="Force Sync Metadata">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteSource(source.$id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Book className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  No knowledge sources cataloged yet.<br/>
                  <span className="text-xs mt-1 block">
                    Use this to track which documents your autonomous voice agents are trained on.
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
