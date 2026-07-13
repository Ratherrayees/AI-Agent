'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "What makes Ru'a different from a generic ChatGPT voice bot?",
    a: "Ru'a is powered by StateAI's acoustic edge neural engine with sub-280ms latency. Unlike generic bots that have 2-4 second pauses and robotic monotones, Ru'a breathes naturally, inflects like a human, and handles interruptions within 120ms without talking over your client."
  },
  {
    q: "How do minute top-ups work if I run out of my monthly plan minutes?",
    a: "You never have to upgrade your entire plan tier just to handle a temporary surge in inquiries. You can add instant minute top-up bundles right inside your StateAI billing dashboard at any time. Your lead qualification never halts."
  },
  {
    q: "How does the 5-second speed-to-lead trigger work?",
    a: "When a potential buyer fills out a Zillow, Facebook Ads, or website contact form, our Appwrite webhook immediately triggers Ru'a. Within 5 seconds, she initiates an outbound phone call or SMS to qualify the lead while their intent is highest."
  },
  {
    q: "Can Ru'a check my live Google or Outlook calendar during the call?",
    a: "Yes! Ru'a has bidirectional sync with Google Calendar and Microsoft Outlook. She checks agent availability in real time, avoids double bookings, and places calendar invites directly onto your schedule while on the phone with the buyer."
  },
  {
    q: "Does Ru'a log call recordings and summaries into my CRM?",
    a: "100% yes. Every single call is transcribed, summarized with key buyer preferences (e.g. 3 bed, $800k max budget, pre-approved), and logged into your Appwrite CRM pipeline automatically."
  }
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#f4f4f4]">
      <div className="max-w-[880px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[32px] sm:text-[45px] font-normal leading-[1.1] tracking-[-0.03em] text-black mb-4">
            Frequently Asked Questions. .{' '}
            <em className="font-serif italic text-black font-normal block sm:inline">
              Answered simple
            </em>
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-black/80">
            Everything you need to know about setting up Ru&apos;a for your real estate team.
          </p>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[20px] border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] transition-all duration-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between gap-4 transition-colors hover:bg-slate-50/50 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-medium tracking-[-0.01em] text-black">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#f4f4f4] text-black shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#3e3ef4] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 text-sm sm:text-base font-light text-black/75 leading-relaxed border-t border-black/[0.04] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
