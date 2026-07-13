import { LoginForm } from '@/features/auth/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Login - Ru'a by StateAI",
  description: "Login to Ru'a Voice & Text Assistant CRM",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <LoginForm />
    </div>
  );
}
