'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "We plugged Ru'a into our StateAI CRM, and now she calls our Zillow inquiries within 4 seconds, qualifies budget, and books showings on our calendars automatically. Our closed volume jumped 40% in 60 days.",
    author: "Marcus Vance",
    role: "Managing Broker",
    agency: "Vance Luxury Group (Miami, FL)",
    metric: "$2.4M GCI Closed",
    initials: "MV"
  },
  {
    quote: "When I heard Ru'a pause, chuckle lightly, and instantly answer when interrupted mid-sentence without missing a beat... I was speechless. Our high-end luxury clients love talking to her.",
    author: "Elena Rostova",
    role: "Senior Lead Specialist",
    agency: "Apex Realty Partners (Austin, TX)",
    metric: "98.4% Realism Rating",
    initials: "ER"
  },
  {
    quote: "Ru'a will text a buyer over SMS while they're at work, notice they want a quick phone call during lunch, dial their cell, and continue the exact same conversation. And it logs directly into Appwrite.",
    author: "Tariq Al-Mansoor",
    role: "Director of Operations",
    agency: "Skyline Brokerage (Chicago, IL)",
    metric: "18 hrs/week Saved",
    initials: "TA"
  }
];

export function LandingTestimonials() {
  return (
    <section className="py-20 lg:py-24 bg-[#f4f4f4]">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] sm:text-[45px] font-normal leading-[1.12] tracking-[-0.03em] text-black mb-4">
            “I have listings to close, but I need instant lead follow-up too”. .{' '}
            <em className="font-serif italic text-black block sm:inline font-normal">
              Is that you?
            </em>
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-black/80 max-w-2xl mx-auto">
            Save <strong className="font-bold text-black">18+ hours a week</strong> per agent with StateAI CRM automation.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between bg-white rounded-[24px] p-8 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,62,244,0.08)] transition duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3e3ef4] bg-[#3e3ef4]/10 px-2.5 py-1 rounded-full font-mono">
                    Verified Broker
                  </span>
                </div>

                <Quote className="w-6 h-6 text-black/20 mb-3" />

                <p className="text-sm text-black/80 leading-relaxed mb-8 italic font-light">
                  &quot;{item.quote}&quot;
                </p>
              </div>

              <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#242424] to-black text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs border border-white/20">
                    {item.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-black">{item.author}</div>
                    <div className="text-[11px] font-light text-black/60 line-clamp-1">{item.role} • {item.agency}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[9px] uppercase font-bold text-black/40">Impact</div>
                  <div className="text-xs font-bold text-emerald-600">{item.metric}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
