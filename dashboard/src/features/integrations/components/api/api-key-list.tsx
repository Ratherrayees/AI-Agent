'use client';

import { useApiKeys, useRevokeApiKey } from '../../hooks/use-integrations';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export function ApiKeyList() {
  const { data, isLoading } = useApiKeys();
  const { mutate: revokeKey, isPending: isRevoking } = useRevokeApiKey();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Active Keys</h4>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Generate Key
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Prefix</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading API keys...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((key) => (
                <TableRow key={key.$id} className={key.isRevoked ? 'opacity-50 bg-muted/20' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Key className="h-4 w-4 mr-2 text-muted-foreground" />
                      {key.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    sk_live_{key.$id.substring(0, 4)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={key.isRevoked ? 'destructive' : 'default'} className="capitalize">
                      {key.isRevoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {key.permissions?.length || 0} scopes
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(key.$createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {key.lastUsedAt ? format(new Date(key.lastUsedAt), 'MMM d, yyyy') : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    {!key.isRevoked && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => revokeKey(key.$id)}
                        disabled={isRevoking}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No API keys generated yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
