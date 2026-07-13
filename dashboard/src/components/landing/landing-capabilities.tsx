'use client';

import React from 'react';
import { Mic, Zap, PhoneCall, CalendarCheck } from 'lucide-react';

const CAPABILITIES = [
  {
    step: '1',
    badge: 'Neural Acoustics',
    title: 'Indistinguishable Human Speech',
    description: 'Powered by StateAI Real-Time v2, Ru’a incorporates natural pauses, subtle inflections, and emotional warmth—with zero robotic monotone.',
    metric: '< 280ms Latency Guarantee'
  },
  {
    step: '2',
    badge: 'Speed-to-Lead',
    title: 'Instant 5-Second Triggering',
    description: 'The moment a prospect fills out a Zillow, Facebook Ads, or website form, Ru’a calls or texts within 5 seconds while intent is at its absolute peak.',
    metric: '4.8x Lead Conversion Boost'
  },
  {
    step: '3',
    badge: 'Full-Duplex Physics',
    title: 'Instant Interruption (Barge-In)',
    description: 'Legacy AI talks over buyers. Ru’a listens continuously while speaking and halts within 120 milliseconds when interrupted, pivoting smoothly.',
    metric: '120ms Cutoff Response'
  },
  {
    step: '4',
    badge: 'CRM Automation',
    title: 'Native Calendar & Appwrite Sync',
    description: 'Ru’a queries agent availability across Google Calendar or Outlook in real time, schedules showings, and logs all call summaries to Appwrite.',
    metric: '100% Automated Logging'
  }
];

export function LandingCapabilities() {
  return (
    <section id="capabilities" className="py-20 lg:py-28 bg-[#f4f4f4]">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] sm:text-[46px] font-normal leading-[1.08] tracking-[-0.035em] text-black mb-4">
            Qualify, schedule, and sync your leads. .{' '}
            <em className="font-serif italic text-black font-normal block sm:inline">
              Easy as 1-2-3
            </em>
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-black/80 max-w-2xl mx-auto">
            More than just an AI voice bot. Built for high-volume real estate teams{' '}
            <strong className="font-bold text-black">without jumping between tools</strong>.
          </p>
        </div>

        {/* Cleanvoice Bento Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-[24px] p-8 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,62,244,0.1)] transition duration-300 flex flex-col justify-between min-h-[280px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#242424] to-black text-base font-bold text-white shadow-xs border border-white/20">
                      {cap.step}
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-white uppercase bg-gradient-to-b from-[#242424] to-black px-3 py-1 rounded-full border border-black/10 shadow-xs">
                      {cap.badge}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-black mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm sm:text-base font-light text-black/75 leading-relaxed mb-6">
                  {cap.description}
                </p>
              </div>

              <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="font-medium text-black/50">Performance Metric</span>
                <span className="font-bold text-black bg-[#f4f4f4] px-3 py-1.5 rounded-lg">
                  {cap.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
