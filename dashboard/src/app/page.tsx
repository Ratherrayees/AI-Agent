import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing';

export const metadata: Metadata = {
  title: "Ru'a by StateAI | Autonomous AI Voice & Text Assistant & Real Estate CRM",
  description:
    "Ru'a is the human-grade AI voice and text assistant engineered by StateAI for top real estate teams. Sub-280ms acoustic latency, full barge-in handling, and real-time Appwrite CRM synchronization.",
  keywords: [
    'AI Voice Assistant',
    'Real Estate AI CRM',
    'StateAI',
    "Ru'a",
    'Omnichannel AI Agent',
    'Speed to Lead',
    'Real Estate Automation',
  ],
  openGraph: {
    title: "Ru'a by StateAI — Human-Grade AI Voice & Text Assistant",
    description:
      "Stop losing real estate leads. Ru'a calls within 5 seconds, talks and sounds indistinguishably like a human, and syncs directly into your StateAI CRM.",
    url: 'https://stateai.io',
    siteName: 'StateAI CRM',
    locale: 'en_US',
    type: 'website',
  },
};

export default function Home() {
  return <LandingPage />;
}
