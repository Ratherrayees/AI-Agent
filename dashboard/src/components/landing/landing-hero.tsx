'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LandingHero() {
  return (
    <section id="hero" className="relative isolate w-full overflow-hidden bg-[#060612] text-white rounded-b-[40px] lg:rounded-b-[60px] pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-48 lg:pb-40 px-4 sm:px-6">
      {/* Background Ambient Radial Glows exactly inspired by cleanvoice.ai */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 78% 12%, rgba(62, 62, 244, 0.52), transparent 38%), radial-gradient(circle at 22% 85%, rgba(255, 217, 110, 0.28), transparent 34%), linear-gradient(180deg, #050509 0%, #060612 60%, #111018 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060612] to-transparent opacity-60" />

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
        {/* Social Proof Avatar Strip */}
        <div className="inline-flex items-center gap-3 rounded-[100px] bg-white/[0.07] border border-white/15 py-2 px-4 mb-8 backdrop-blur-md shadow-xs">
          <div className="flex items-center -space-x-2">
            <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-[#060612] flex items-center justify-center text-[9px] font-extrabold text-white">
              MV
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#060612] flex items-center justify-center text-[9px] font-extrabold text-white">
              ER
            </div>
            <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-[#060612] flex items-center justify-center text-[9px] font-extrabold text-white">
              TA
            </div>
          </div>
          <p className="text-xs sm:text-sm font-medium text-white/90">
            Trusted by 15,000+ top real estate agents & brokers
          </p>
        </div>

        {/* Signature Cleanvoice Strikethrough & Serif Italics Headline */}
        <h1 className="text-[clamp(2.5rem,5.8vw,68px)] font-normal leading-[0.92] text-white tracking-[-0.02em] max-w-4xl mx-auto mb-6">
          Engage your real estate leads in{' '}
          <span className="relative inline-block text-white/35 mr-1">
            <span className="line-through decoration-[#3e3ef4] decoration-4 font-normal">
              48 hours
            </span>
          </span>{' '}
          <span className="font-semibold text-white">5 seconds.</span>{' '}
          <em className="font-serif font-normal italic text-white block sm:inline mt-2 sm:mt-0">
            Indistinguishably human.
          </em>
        </h1>

        {/* Concise Subtitle */}
        <p className="text-base sm:text-lg font-light text-white/80 max-w-2xl mx-auto leading-[1.6] mb-10 text-balance">
          Qualify inbound property inquiries, check live agent availability across Google & Outlook calendars, and book showings using <strong className="font-bold text-white">AI</strong>. Without hitting pause or missing a weekend buyer.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none mx-auto">
          <a href="#capabilities" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black px-8 py-4 text-base font-medium text-white transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer group">
              <Sparkles className="w-4 h-4 text-[#3e3ef4] group-hover:scale-110 transition-transform" />
              <span>Explore Capabilities ↓</span>
            </button>
          </a>
          <a href="#pricing" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-[100px] border border-white/20 bg-white/10 hover:bg-white/15 px-8 py-4 text-base font-medium text-white transition-all cursor-pointer">
              View Pricing & Top-Ups
            </button>
          </a>
        </div>

        <p className="text-xs sm:text-sm font-light text-white/60 mt-4">
          Launch directly inside StateAI CRM. No custom coding needed.
        </p>
      </div>
    </section>
  );
}
