'use client';

import { useState } from 'react';
import { useApiKeys, useRevokeApiKey, useCreateApiKey } from '../../hooks/use-integrations';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Trash2, Copy, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export function ApiKeyList() {
  const { data, isLoading } = useApiKeys();
  const { mutate: revokeKey, isPending: isRevoking } = useRevokeApiKey();
  const { mutate: createKey, isPending: isCreating } = useCreateApiKey();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) {
      toast.error('Key name is required');
      return;
    }
    if (permissions.length === 0) {
      toast.error('At least one scope permission is required');
      return;
    }

    createKey(
      {
        name: keyName,
        permissions,
      },
      {
        onSuccess: (newKey: any) => {
          // Display the newly created secret key mock token
          const secret = `sk_live_${newKey.$id}_${Math.random().toString(36).substring(2, 15)}`;
          setCreatedKeySecret(secret);
          setKeyName('');
          setPermissions(['read']);
        },
      }
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Active Keys</h4>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setCreatedKeySecret(null);
          }
        }}>
          <DialogTrigger render={
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Generate Key
            </Button>
          } />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate API Key</DialogTitle>
              <DialogDescription>
                Create a secret key to authenticate secure API requests.
              </DialogDescription>
            </DialogHeader>

            {createdKeySecret ? (
              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-600 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>
                    Make sure to copy your API key now. You won't be able to see it again for security reasons.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input readOnly value={createdKeySecret} className="font-mono text-xs" />
                  <Button size="icon" variant="outline" onClick={() => handleCopy(createdKeySecret)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <DialogFooter className="sm:justify-end">
                  <Button type="button" onClick={() => setDialogOpen(false)}>
                    Done
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Production Dialer Server"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    disabled={isCreating}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Permissions</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="perm-read"
                        checked={permissions.includes('read')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPermissions([...permissions, 'read']);
                          } else {
                            setPermissions(permissions.filter((p) => p !== 'read'));
                          }
                        }}
                        disabled={isCreating}
                      />
                      <Label htmlFor="perm-read" className="font-normal text-sm">
                        Read: View leads, campaigns, and analytical summaries
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="perm-write"
                        checked={permissions.includes('write')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPermissions([...permissions, 'write']);
                          } else {
                            setPermissions(permissions.filter((p) => p !== 'write'));
                          }
                        }}
                        disabled={isCreating}
                      />
                      <Label htmlFor="perm-write" className="font-normal text-sm">
                        Write: Create/update entities or trigger outbound dialing
                      </Label>
                    </div>
                  </div>
                </div>

                <DialogFooter className="sm:justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Generating...' : 'Generate Key'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
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
