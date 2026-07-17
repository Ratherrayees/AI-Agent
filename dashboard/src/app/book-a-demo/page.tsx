import { ArrowRight } from 'lucide-react';
import { WhatsAppWidget } from '@/components/landing/whatsapp-widget';

export const metadata = {
  title: "Book a Demo | Ru'a",
  description: 'Schedule a guided walkthrough of Ru\'a and learn how it can automate your real estate lead follow-up.',
};

export default function BookADemoPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '15550199999';
  const message = encodeURIComponent("Hello! I would like to book a demo for Ru'a AI Real Estate Assistant.");
  const whatsappUrl = `https://wa.me/${number}?text=${message}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-4 py-16 relative">
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
          <div className="rounded-[24px] border border-white/10 bg-white/5 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Ready to book?</h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Click below to start a chat on WhatsApp. One of our experts will arrange a convenient time for your live walkthrough.
              </p>
            </div>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[100px] bg-[#25D366] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#20ba5a] hover:scale-[1.02] shadow-lg shadow-emerald-950/20 cursor-pointer w-full text-center"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 mr-2 fill-current shrink-0">
                <path d="M12.031 2c-5.514 0-9.99 4.476-9.99 9.99 0 1.758.455 3.479 1.32 5.004L2 22l5.136-1.325a9.92 9.92 0 0 0 4.895 1.28c5.514 0 9.99-4.476 9.99-9.99C22.021 6.476 17.545 2 12.031 2zm0 18.286c-1.636 0-3.238-.433-4.636-1.253l-.332-.196-3.055.788.802-2.93-.215-.342A8.257 8.257 0 0 1 3.714 12c0-4.57 3.733-8.286 8.317-8.286 4.584 0 8.317 3.716 8.317 8.286s-3.733 8.286-8.317 8.286zm4.567-6.223c-.25-.124-1.477-.728-1.704-.81-.228-.08-.393-.124-.558.124-.165.25-.638.81-.78 1.026-.144.216-.287.243-.537.12a6.764 6.764 0 0 1-1.993-1.229 7.452 7.452 0 0 1-1.38-1.717c-.15-.25-.016-.385.109-.508.113-.11.25-.292.375-.438.124-.145.166-.25.25-.415.083-.166.042-.31-.02-.435-.063-.125-.558-1.348-.765-1.846-.201-.486-.406-.42-.558-.428-.145-.008-.31-.01-.476-.01a.916.916 0 0 0-.662.307c-.228.25-.87.85-.87 2.075s.89 2.406.99 2.541c.1.135 1.752 2.674 4.244 3.748.592.256 1.055.409 1.414.523.595.19 1.137.163 1.564.1.476-.07 1.477-.602 1.684-1.183.208-.58.208-1.078.145-1.183-.063-.105-.228-.166-.477-.29z" />
              </svg>
              Book via WhatsApp
            </a>
          </div>
        </div>
      </div>
      <WhatsAppWidget />
    </main>
  );
}
