'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign } from '@/types';
import { CampaignStatusBadge, CampaignTypeIcon } from '../campaign-badges';
import { useUpdateCampaign, useDeleteCampaign } from '../../hooks/use-campaigns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  CheckCircle2,
  Trash2,
  Bot,
  Calendar,
  Clock,
  Settings2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';

interface CampaignHeaderProps {
  campaign: Campaign;
}

export function CampaignHeader({ campaign }: CampaignHeaderProps) {
  const router = useRouter();
  const updateMutation = useUpdateCampaign();
  const deleteMutation = useDeleteCampaign();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: 'running' | 'paused' | 'completed') => {
    updateMutation.mutate(
      {
        id: campaign.$id,
        data: { status: newStatus as any },
      },
      {
        onSuccess: () => {
          if (newStatus === 'running') {
            toast.success(`Campaign "${campaign.name}" is now RUNNING & Outbound Calling Engine Enabled!`);
          } else if (newStatus === 'paused') {
            toast.info(`Campaign "${campaign.name}" paused. All pending queue items halted.`);
          } else {
            toast.success(`Campaign marked as Completed!`);
          }
        },
      }
    );
  };

  const handleDelete = () => {
    setIsDeleting(true);
    deleteMutation.mutate(campaign.$id, {
      onSuccess: () => {
        toast.success(`Campaign "${campaign.name}" deleted.`);
        router.push('/dashboard/campaigns');
      },
      onError: () => {
        setIsDeleting(false);
      },
    });
  };

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 font-medium',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium',
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-medium',
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border border-border/60 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/campaigns')}
              className="h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Campaigns
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-primary/10 text-primary">
                <CampaignTypeIcon type={campaign.type} className="h-6 w-6 text-primary" />
              </span>
              {campaign.name}
            </h1>
            <CampaignStatusBadge status={campaign.status} className="px-3 py-1 text-xs" />
            <Badge
              variant="outline"
              className={`capitalize ${priorityColors[campaign.priority] || priorityColors.medium}`}
            >
              {campaign.priority} Priority
            </Badge>
          </div>
          {campaign.description && (
            <p className="text-muted-foreground text-sm max-w-3xl mt-1">{campaign.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          {campaign.status !== 'running' && campaign.status !== 'completed' && (
            <Button
              size="sm"
              onClick={() => handleStatusChange('running')}
              disabled={updateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4 fill-current" />
              )}
              {campaign.status === 'paused' ? 'Resume Campaign' : 'Start Campaign'}
            </Button>
          )}

          {campaign.status === 'running' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('paused')}
              disabled={updateMutation.isPending}
              className="border-orange-500/40 text-orange-600 hover:bg-orange-500/10 dark:text-orange-400"
            >
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Pause className="mr-2 h-4 w-4 fill-current" />
              )}
              Pause Campaign
            </Button>
          )}

          {campaign.status !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusChange('completed')}
              disabled={updateMutation.isPending}
              className="border-blue-500/40 text-blue-600 hover:bg-blue-500/10 dark:text-blue-400"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Completed
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  size="sm"
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                />
              }
            >
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign "{campaign.name}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will remove the campaign and disassociate all queued lead calling records.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete Permanently'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40 mt-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">AI Voice Agent</p>
            <p className="text-sm font-semibold truncate max-w-[150px]">
              {campaign.aiAgentId || 'StateAI Voice Assistant'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Schedule</p>
            <p className="text-sm font-semibold">
              {campaign.startDate ? format(new Date(campaign.startDate), 'MMM d, yyyy') : 'No Start Date'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Timezone & Rules</p>
            <p className="text-sm font-semibold truncate max-w-[150px]">
              {campaign.timezone || 'UTC'} ({campaign.maxRetries || 2} retries)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Settings2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Outreach Pace</p>
            <p className="text-sm font-semibold">
              Max {campaign.maxCallsPerLead || 3} calls/lead
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
