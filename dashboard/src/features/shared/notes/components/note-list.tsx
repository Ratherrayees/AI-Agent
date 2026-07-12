'use client';

import { useNotes, useDeleteNote } from '../hooks/use-notes';
import { NoteForm } from './note-form';
import { Loader2, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/auth-provider';
import { UserRole } from '@/types';

interface NoteListProps {
  entityType: 'leadId' | 'conversationId' | 'appointmentId' | 'campaignId';
  entityId: string;
}

export function NoteList({ entityType, entityId }: NoteListProps) {
  const { data: notes, isLoading } = useNotes(entityType, entityId);
  const { mutate: deleteNote } = useDeleteNote(entityType, entityId);
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <NoteForm entityType={entityType} entityId={entityId} />

      <div className="space-y-4 mt-6">
        <h3 className="font-semibold text-lg">Previous Notes</h3>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.$id} className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {note.createdById === user?.$id ? 'You' : 'User'}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(note.$createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {(note.createdById === user?.$id || user?.prefs?.role === UserRole.SUPER_ADMIN) && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive -mt-1 -mr-1"
                      onClick={() => deleteNote(note.$id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
            No notes yet. Be the first to add one!
          </div>
        )}
      </div>
    </div>
  );
}
