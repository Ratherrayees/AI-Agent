import { Lead } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, MapPin, Globe, Clock, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeadOverviewProps {
  lead: Lead;
}

export function LeadOverview({ lead }: LeadOverviewProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Contact Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Company</p>
              <p className="text-muted-foreground">{lead.company || '-'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">
                {[lead.address, lead.city, lead.state, lead.postalCode, lead.country]
                  .filter(Boolean)
                  .join(', ') || '-'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Website</p>
              {lead.website ? (
                <a href={lead.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {lead.website}
                </a>
              ) : (
                <p className="text-muted-foreground">-</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CRM Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CRM Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Assigned To</p>
              <p className="text-muted-foreground">{lead.assignedUserId || 'Unassigned'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Created</p>
              <p className="text-muted-foreground">
                {new Date(lead.$createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">Source</p>
              <p className="text-muted-foreground">{lead.leadSource || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description Card */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          {lead.description ? (
            <p className="text-sm whitespace-pre-wrap">{lead.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
