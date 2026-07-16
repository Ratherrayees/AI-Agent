import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login - Ru'a by StateAI",
  description: "Login to Ru'a Voice & Text Assistant CRM",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
