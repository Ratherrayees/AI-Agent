'use client';

import React from 'react';
import { LandingNavbar } from './landing-navbar';
import { LandingHero } from './landing-hero';
import { LandingVideoShowcase } from './landing-video-showcase';
import { LandingCapabilities } from './landing-capabilities';
import { LandingHowItWorks } from './landing-how-it-works';
import { LandingTestimonials } from './landing-testimonials';
import { LandingPricing } from './landing-pricing';
import { LandingFaq } from './landing-faq';
import { LandingFooter } from './landing-footer';
import { WhatsAppWidget } from './whatsapp-widget';

export * from './landing-navbar';
export * from './landing-hero';
export * from './landing-video-showcase';
export * from './landing-capabilities';
export * from './landing-how-it-works';
export * from './landing-testimonials';
export * from './landing-pricing';
export * from './landing-faq';
export * from './landing-footer';
export * from './whatsapp-widget';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900 flex flex-col selection:bg-[#3e3ef4] selection:text-white font-sans overflow-x-hidden antialiased">
      <LandingNavbar />
      <main className="flex-1 bg-[#f4f4f4]">
        <LandingHero />
        <LandingVideoShowcase />
        <LandingCapabilities />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFaq />
      </main>
      <LandingFooter />
      <WhatsAppWidget />
    </div>
  );
}
