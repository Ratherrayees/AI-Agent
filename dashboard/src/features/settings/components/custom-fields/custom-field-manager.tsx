'use client';

import { useCustomFields, useDeleteCustomField } from '../../hooks/use-custom-fields';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings2 } from 'lucide-react';

export function CustomFieldManager() {
  const { data, isLoading } = useCustomFields();
  const { mutate: deleteField, isPending: isDeleting } = useDeleteCustomField();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-sm text-muted-foreground">Dynamic CRM Schema</h4>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Field
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field Label</TableHead>
              <TableHead>Target Entity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Required</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading schema...</TableCell>
              </TableRow>
            ) : data?.documents?.length ? (
              data.documents.map((field) => (
                <TableRow key={field.$id}>
                  <TableCell className="font-medium">
                    {field.label}
                    <div className="text-xs text-muted-foreground font-mono mt-1">{field.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{field.targetEntity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{field.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {field.required ? (
                      <span className="text-rose-500 font-medium text-sm">Yes</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="mr-2">
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteField(field.$id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  <Settings2 className="h-8 w-8 mx-auto mb-3 text-muted-foreground/50" />
                  No custom fields configured.<br/>
                  <span className="text-xs mt-1 block">
                    Extend your CRM by adding fields like &apos;Budget&apos; or &apos;Move-in Date&apos; to Leads.
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
