'use client';

import React, { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { Activity } from '@/types';
import { PhoneCall, Mail, Calendar, CheckCircle2, UserPlus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setIsLoading(true);
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_IDS.ACTIVITIES,
          [Query.orderDesc('$createdAt'), Query.limit(6)]
        );
        setActivities(res.documents as unknown as Activity[]);
      } catch (err) {
        console.error('Failed to load recent activities:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const getIcon = (type: string = '') => {
    const t = type.toLowerCase();
    if (t.includes('call')) return <PhoneCall className="h-4 w-4 text-emerald-500" />;
    if (t.includes('email') || t.includes('mail')) return <Mail className="h-4 w-4 text-blue-500" />;
    if (t.includes('appointment') || t.includes('meeting')) return <Calendar className="h-4 w-4 text-purple-500" />;
    if (t.includes('lead')) return <UserPlus className="h-4 w-4 text-amber-500" />;
    return <CheckCircle2 className="h-4 w-4 text-indigo-500" />;
  };

  return (
    <div className="col-span-1 rounded-xl border bg-card text-card-foreground shadow flex flex-col p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
        <h3 className="font-semibold text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Recent Activity
        </h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Live</span>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-12 text-sm text-muted-foreground animate-pulse">
          Loading live CRM events...
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Clock className="h-8 w-8 opacity-20 mb-2" />
          <p className="text-sm font-medium">No activity recorded yet</p>
          <p className="text-xs mt-1 text-muted-foreground/80">AI agent calls and lead events will stream here automatically.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto pr-1 max-h-[380px]">
          {activities.map((act) => (
            <div key={act.$id} className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/40">
              <div className="p-2 rounded-full bg-muted flex-shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug truncate">{act.title}</p>
                {act.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{act.description}</p>
                )}
                <span className="text-[10px] text-muted-foreground/70 mt-1.5 block font-mono">
                  {act.$createdAt ? formatDistanceToNow(new Date(act.$createdAt), { addSuffix: true }) : 'Just now'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
