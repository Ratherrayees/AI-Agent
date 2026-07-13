'use client';

import React from 'react';
import Link from 'next/link';
import { Waves, ArrowRight, ShieldCheck } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#f4f4f4] pt-8 pb-16">
      {/* Top Cleanvoice Dark Pill CTA Card */}
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 mb-16">
        <div className="bg-[#060612] text-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl border border-white/10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(circle at 80% 20%, rgba(62, 62, 244, 0.5), transparent 40%), radial-gradient(circle at 20% 80%, rgba(255, 217, 110, 0.3), transparent 35%)',
            }}
          />
          <div className="max-w-2xl mx-auto relative z-10">
            <h2 className="text-[32px] sm:text-[48px] font-normal tracking-[-0.03em] leading-[1.08] mb-4">
              Ready to automate your speed-to-lead? .{' '}
              <em className="font-serif italic text-white font-normal block sm:inline">
                Start closing more deals
              </em>
            </h2>
            <p className="text-white/80 font-light text-base sm:text-lg mb-8 leading-relaxed">
              Launch Ru&apos;a directly inside StateAI CRM. Convert weekend inquiries into booked calendar appointments 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black px-8 py-4 text-base font-medium text-white transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-xl flex items-center justify-center gap-2 cursor-pointer">
                  <span>Launch StateAI CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto rounded-[100px] border border-white/20 bg-white/10 hover:bg-white/15 px-8 py-4 text-base font-medium text-white transition-all cursor-pointer">
                  <span>Agent Portal Login</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 pt-8 border-t border-black/[0.08] grid grid-cols-1 md:grid-cols-4 gap-8 text-black">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3e3ef4] text-white shadow-xs">
              <Waves className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Ru&apos;a
            </span>
            <span className="text-xs font-bold text-black/50 font-mono">by StateAI</span>
          </Link>
          <p className="text-xs font-light text-black/70 leading-relaxed mb-4">
            The autonomous AI voice and text assistant engineered specifically for top real estate teams and high-volume brokerages.
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-black/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>SOC-2 Type II & TCPA Compliant</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-black mb-3 font-mono">Capabilities</div>
          <ul className="space-y-2.5 text-xs font-light text-black/70">
            <li><a href="#capabilities" className="hover:text-[#3e3ef4] transition-colors">Sub-280ms Neural Voice</a></li>
            <li><a href="#capabilities" className="hover:text-[#3e3ef4] transition-colors">5-Second Speed-to-Lead</a></li>
            <li><a href="#capabilities" className="hover:text-[#3e3ef4] transition-colors">Instant Barge-In Handling</a></li>
            <li><a href="#capabilities" className="hover:text-[#3e3ef4] transition-colors">Google & Outlook Calendar Sync</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-black mb-3 font-mono">Plans & Pricing</div>
          <ul className="space-y-2.5 text-xs font-light text-black/70">
            <li><a href="#pricing" className="hover:text-[#3e3ef4] transition-colors">Starter Plan ($149 / mo)</a></li>
            <li><a href="#pricing" className="hover:text-[#3e3ef4] transition-colors">Pro Agency Plan ($399 / mo)</a></li>
            <li><a href="#pricing" className="hover:text-[#3e3ef4] transition-colors">Enterprise Custom (Talk to Expert)</a></li>
            <li><a href="#faq" className="hover:text-[#3e3ef4] transition-colors">Frequently Asked Questions</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-black mb-3 font-mono">StateAI Platform</div>
          <ul className="space-y-2.5 text-xs font-light text-black/70">
            <li><Link href="/dashboard" className="hover:text-[#3e3ef4] transition-colors">CRM Overview Dashboard</Link></li>
            <li><Link href="/dashboard/leads" className="hover:text-[#3e3ef4] transition-colors">Lead Intent Pipeline</Link></li>
            <li><Link href="/dashboard/calls" className="hover:text-[#3e3ef4] transition-colors">Acoustic Call Transcripts</Link></li>
            <li><Link href="/login" className="hover:text-[#3e3ef4] transition-colors">Agent Portal Login</Link></li>
          </ul>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6 pt-8 mt-12 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-black/50">
        <div>
          &copy; {new Date().getFullYear()} StateAI Technologies Inc. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/dashboard" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link href="/dashboard" className="hover:text-black transition-colors">System Status</Link>
        </div>
      </div>
    </footer>
  );
}
