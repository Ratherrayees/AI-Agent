import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: "Book a Demo | Ru'a",
  description: 'Schedule a guided walkthrough of Ru\'a and learn how it can automate your real estate lead follow-up.',
};

export default function BookADemoPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950/90 p-10 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[#7c7c7c] mb-4">
            Book a Demo
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
            See Ru&apos;a in action with a live walkthrough.
          </h1>
        </div>
        <p className="text-base text-slate-300 leading-relaxed mb-10">
          Schedule a private demo with our team and discover how Ru&apos;a can qualify leads, sync calendars, and close more real estate opportunities automatically.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-2">What you’ll see</h2>
            <ul className="space-y-2 text-sm text-slate-300 leading-7">
              <li>• Live agent calendar sync</li>
              <li>• AI-driven lead qualification flow</li>
              <li>• Demo of appointment scheduling and CRM logging</li>
              <li>• Custom strategy for your brokerage</li>
            </ul>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold mb-2">Ready to book?</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Click below to reserve your demo and one of our experts will reach out with available times.
            </p>
            <Link href="mailto:sales@stateai.io?subject=Book%20a%20Demo%20for%20Ru'a" className="inline-flex items-center justify-center rounded-[100px] bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-100">
              Email Sales
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
