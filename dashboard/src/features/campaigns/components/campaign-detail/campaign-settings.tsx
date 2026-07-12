'use client';

import { useState } from 'react';
import { Campaign } from '@/types';
import { useUpdateCampaign } from '../../hooks/use-campaigns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Loader2, Save, Bot } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';

interface CampaignSettingsProps {
  campaign: Campaign;
}

export function CampaignSettings({ campaign }: CampaignSettingsProps) {
  const { user } = useAuth();
  const isSuperAdmin = 
    (user?.prefs?.role as string) === 'superadmin' || 
    user?.prefs?.role === 'super_admin' || 
    user?.labels?.includes('superadmin') || 
    user?.labels?.includes('super_admin');

  const updateMutation = useUpdateCampaign();
  const [name, setName] = useState(campaign.name);
  const [description, setDescription] = useState(campaign.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(campaign.priority || 'medium');
  const [aiAgentId, setAiAgentId] = useState(campaign.aiAgentId || '');
  const [maxRetries, setMaxRetries] = useState(campaign.maxRetries?.toString() || '2');
  const [retryDelay, setRetryDelay] = useState(campaign.retryDelay?.toString() || '60');
  const [maxCallsPerLead, setMaxCallsPerLead] = useState(campaign.maxCallsPerLead?.toString() || '3');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        id: campaign.$id,
        data: {
          name,
          description,
          priority,
          aiAgentId,
          maxRetries: parseInt(maxRetries, 10) || 2,
          retryDelay: parseInt(retryDelay, 10) || 60,
          maxCallsPerLead: parseInt(maxCallsPerLead, 10) || 3,
        },
      },
      {
        onSuccess: () => {
          toast.success('Campaign parameters and AI voice rules updated successfully!');
        },
      }
    );
  };

  return (
    <Card className="border-border/60 shadow-sm bg-card max-w-3xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-primary" />
          Campaign Configuration & AI Rules
        </CardTitle>
        <CardDescription>
          Customize automated calling parameters, voice profile links, and retry intervals
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSave}>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Campaign Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Q3 Luxury Property Follow-up"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Outreach Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="high">High Priority (Immediate Queue Dispatch)</option>
                <option value="medium">Medium Priority (Standard Pacing)</option>
                <option value="low">Low Priority (Off-peak Calling)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Campaign Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe target audience and key qualifying questions..."
              rows={3}
            />
          </div>

          {isSuperAdmin ? (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-purple-500" />
                Voice Model Profile ID [Admin Only]
              </label>
              <Input
                value={aiAgentId}
                onChange={(e) => setAiAgentId(e.target.value)}
                placeholder="voice_model_xxxxxx"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Assign the specific conversational AI voice model profile to automate outbound calls for this campaign.
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-purple-500" />
                Assigned Voice Profile Model
              </label>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/60 font-mono text-xs text-muted-foreground">
                <span>{aiAgentId ? 'Enterprise Real Estate Voice Assistant [Active]' : 'Standard Conversational Engine [Default]'}</span>
                <span className="px-2 py-0.5 rounded bg-background border text-[10px] font-semibold text-foreground uppercase tracking-wider">Locked by System</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Voice model assignments and conversational qualification rules are managed directly by your Software Provider.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/40">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Retries per Lead</label>
              <Input
                type="number"
                min="0"
                max="10"
                value={maxRetries}
                onChange={(e) => setMaxRetries(e.target.value)}
              />
              <span className="text-xs text-muted-foreground">Number of failed call attempts before marking lost</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Retry Delay (Minutes)</label>
              <Input
                type="number"
                min="5"
                max="1440"
                value={retryDelay}
                onChange={(e) => setRetryDelay(e.target.value)}
              />
              <span className="text-xs text-muted-foreground">Time interval to wait before re-calling busy/no-answer</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Max Calls Limit</label>
              <Input
                type="number"
                min="1"
                max="20"
                value={maxCallsPerLead}
                onChange={(e) => setMaxCallsPerLead(e.target.value)}
              />
              <span className="text-xs text-muted-foreground">Absolute ceiling for total AI contacts</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/40 pt-4 flex justify-end">
          <Button type="submit" disabled={updateMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Configuration
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
