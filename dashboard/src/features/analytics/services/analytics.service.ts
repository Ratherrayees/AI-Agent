import { databases, DATABASE_ID, COLLECTION_IDS } from '@/lib/appwrite';
import { Query } from 'appwrite';

export interface DashboardStats {
  totalLeads: number;
  totalAppointments: number;
  totalConversations: number;
  activeCampaigns: number;
  leadsThisMonth: number;
  callsThisWeek: number;
}

export interface ChartDataPoint {
  name: string;
  inbound: number;
  outbound: number;
}

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const lastWeekIso = oneWeekAgo.toISOString();

    const [
      leads, 
      leadsMonth, 
      appointments, 
      conversations, 
      conversationsWeek, 
      campaigns
    ] = await Promise.all([
      // Total Leads
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.LEADS, [Query.limit(1)]),
      // Leads this month
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.LEADS, [
        Query.greaterThanEqual('$createdAt', firstDayOfMonth),
        Query.limit(1)
      ]),
      // Total Appointments
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.APPOINTMENTS, [Query.limit(1)]),
      // Total Conversations
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.CONVERSATIONS, [Query.limit(1)]),
      // Calls this week
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.CONVERSATIONS, [
        Query.greaterThanEqual('$createdAt', lastWeekIso),
        Query.limit(1)
      ]),
      // Active Campaigns
      databases.listDocuments(DATABASE_ID, COLLECTION_IDS.CAMPAIGNS, [
        Query.equal('status', 'active'),
        Query.limit(1)
      ])
    ]);

    return {
      totalLeads: leads.total,
      leadsThisMonth: leadsMonth.total,
      totalAppointments: appointments.total,
      totalConversations: conversations.total,
      callsThisWeek: conversationsWeek.total,
      activeCampaigns: campaigns.total,
    };
  },

  async getCallVolumeData(): Promise<ChartDataPoint[]> {
    // In a real app, we would query the database with group by date.
    // For MVP with Appwrite, we mock the last 7 days distribution
    const data: ChartDataPoint[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        inbound: Math.floor(Math.random() * 20) + 5,
        outbound: Math.floor(Math.random() * 40) + 10,
      });
    }
    
    return data;
  }
};
