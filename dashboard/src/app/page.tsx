import { redirect } from 'next/navigation';

export default function Home() {
  // Always redirect to dashboard, the layout will handle auth redirects
  redirect('/dashboard');
}
