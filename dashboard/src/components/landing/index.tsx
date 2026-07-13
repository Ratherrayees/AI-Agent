'use client';

import React from 'react';
import { LandingNavbar } from './landing-navbar';
import { LandingHero } from './landing-hero';
import { LandingCapabilities } from './landing-capabilities';
import { LandingTestimonials } from './landing-testimonials';
import { LandingPricing } from './landing-pricing';
import { LandingFaq } from './landing-faq';
import { LandingFooter } from './landing-footer';

export * from './landing-navbar';
export * from './landing-hero';
export * from './landing-capabilities';
export * from './landing-testimonials';
export * from './landing-pricing';
export * from './landing-faq';
export * from './landing-footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f4] text-slate-900 flex flex-col selection:bg-[#3e3ef4] selection:text-white font-sans overflow-x-hidden antialiased">
      <LandingNavbar />
      <main className="flex-1 bg-[#f4f4f4]">
        <LandingHero />
        <LandingCapabilities />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFaq />
      </main>
      <LandingFooter />
    </div>
  );
}
