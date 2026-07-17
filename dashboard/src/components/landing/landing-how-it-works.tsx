'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  MessageSquare,
  Brain,
  Sparkles,
  Calendar,
  Database,
  RefreshCw,
  Users,
  BarChart3,
  TrendingUp,
  ArrowRight,
  X,
  Check
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '1',
    badge: 'Inbound Channels',
    title: 'Customer Reaches Out',
    description: 'Customers contact your business through your website, WhatsApp, Facebook, Instagram, Google Ads, email, or a phone call.',
    icon: Globe,
    metric: 'Omnichannel Capture'
  },
  {
    step: '2',
    badge: 'Speed-to-Lead',
    title: 'Instant AI Response',
    description: 'Ru’a responds within seconds using natural, human-like conversations, ensuring every inquiry receives an immediate reply, day or night.',
    icon: MessageSquare,
    metric: '< 5 Second SLA'
  },
  {
    step: '3',
    badge: 'Intent Scoring',
    title: 'Intelligent Lead Qualification',
    description: 'Ru’a identifies high-quality prospects by asking relevant questions about their needs, budget, timeline, location, and buying intent.',
    icon: Brain,
    metric: '100% Qualified'
  },
  {
    step: '4',
    badge: 'Adaptive Dialogue',
    title: 'Personalized Sales Conversation',
    description: 'Rather than following rigid scripts, Ru’a adapts to each customer, answers questions, handles objections, recommends services, and guides the conversation naturally.',
    icon: Sparkles,
    metric: 'Sub-280ms Latency'
  },
  {
    step: '5',
    badge: 'Calendar Sync',
    title: 'Appointment Booking',
    description: 'Qualified leads are automatically scheduled into your calendar based on real-time availability. Confirmation messages and reminders are sent automatically to reduce no-shows.',
    icon: Calendar,
    metric: 'Zero Double-Booking'
  },
  {
    step: '6',
    badge: 'Appwrite Native',
    title: 'CRM Synchronization',
    description: 'Every interaction is automatically saved, including customer details, conversation history, lead score, notes, pipeline stage, and follow-up status.',
    icon: Database,
    metric: 'Real-Time Logging'
  },
  {
    step: '7',
    badge: 'Multi-Touch Nurture',
    title: 'Automated Follow-Ups',
    description: "If a customer doesn't respond, Ru’a continues following up through WhatsApp, SMS, email, or voice calls until the opportunity is closed or completed.",
    icon: RefreshCw,
    metric: 'Persistent Engagement'
  },
  {
    step: '8',
    badge: 'Escalation Engine',
    title: 'Human Handoff',
    description: 'Whenever human assistance is required, Ru’a transfers the conversation instantly to your sales team with the complete conversation history and customer context.',
    icon: Users,
    metric: 'Seamless Transfer'
  },
  {
    step: '9',
    badge: 'Live Dashboard',
    title: 'Analytics & Insights',
    description: 'Monitor your entire sales operation with real-time analytics, including conversations handled, leads qualified, appointments booked, conversion rates, response times, and revenue generated.',
    icon: BarChart3,
    metric: 'Full Visibility'
  },
  {
    step: '10',
    badge: 'Self-Optimizing',
    title: 'Continuous Learning',
    description: 'Ru’a continuously improves by learning from customer interactions, business knowledge, FAQs, products, and successful sales conversations, becoming smarter over time.',
    icon: TrendingUp,
    metric: 'AI Evolution'
  }
];

const WHAT_YOU_GET = [
  'Instant responses to every lead',
  '24/7 AI sales conversations',
  'Intelligent lead qualification',
  'Automatic appointment booking',
  'CRM updates in real time',
  'Automated follow-ups',
  'Seamless human handoff',
  'Advanced sales analytics',
  'Higher conversion rates',
  'More revenue with less manual work'
];

export function LandingHowItWorks() {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#f4f4f4]">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
        {/* Exact Section Header Typography & Style */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] sm:text-[46px] font-normal leading-[1.08] tracking-[-0.035em] text-black mb-4">
            From lead to closed deal. .{' '}
            <em className="font-serif italic text-black font-normal block sm:inline">
              Automatically, 24/7
            </em>
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-black/80 max-w-2xl mx-auto">
            Discover how <strong className="font-bold text-black">Ru&apos;a AI</strong> works behind the scenes to capture, qualify, nurture, and convert every lead into a booked appointment without manual intervention.
          </p>
        </div>

        {/* Preview Cards exactly matching LandingCapabilities Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {WORKFLOW_STEPS.slice(0, 3).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-[24px] p-8 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,62,244,0.1)] transition duration-300 flex flex-col justify-between min-h-[300px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#242424] to-black text-base font-bold text-white shadow-xs border border-white/20">
                        {item.step}
                      </span>
                      <span className="text-xs font-semibold tracking-wide text-white uppercase bg-gradient-to-b from-[#242424] to-black px-3 py-1 rounded-full border border-black/10 shadow-xs">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-black mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm sm:text-base font-light text-black/75 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-black/50">Workflow Stage</span>
                  <span className="font-bold text-black bg-[#f4f4f4] px-3 py-1.5 rounded-lg">
                    {item.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner exactly following site cards and buttons */}
        <div className="bg-white rounded-[24px] p-8 sm:p-12 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] text-center max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-black mb-3">
            Explore the Complete 10-Stage Pipeline
          </h3>
          <p className="text-base font-light text-black/75 max-w-xl mx-auto mb-8">
            From instant omnichannel inquiries and full-duplex voice barge-in, to automated follow-ups and CRM synchronization.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black px-8 py-4 text-base font-medium text-white transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-xl flex items-center justify-center gap-2.5 mx-auto cursor-pointer group"
          >
            <span>View Complete Workflow ↓</span>
            <ArrowRight className="w-4 h-4 text-[#3e3ef4] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* FULL SCREEN MODAL adhering strictly to exact website tokens */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#060612]/90 backdrop-blur-md flex flex-col items-center justify-start p-4 sm:p-6 md:p-10"
          >
            {/* Top Bar */}
            <div className="w-full max-w-[1000px] flex items-center justify-between sticky top-0 z-30 bg-[#060612] border border-white/15 px-6 py-4 rounded-[100px] shadow-2xl mb-10">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3e3ef4] text-sm font-bold text-white shadow-xs">
                  10
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-normal text-white tracking-tight">
                    From Lead to Closed Deal • <em className="font-serif italic text-white/90">Autonomous Architecture</em>
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Interactive Vertical Timeline */}
            <div className="w-full max-w-[920px] relative pb-16">
              {/* Vertical Connector Line using exact #3e3ef4 and border tokens */}
              <div className="absolute left-6 sm:left-12 top-8 bottom-24 w-1 bg-[#3e3ef4]/40 rounded-full" />

              <div className="space-y-6 sm:space-y-8">
                {WORKFLOW_STEPS.map((stepItem, idx) => {
                  const Icon = stepItem.icon;
                  return (
                    <motion.div
                      key={stepItem.step}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="relative pl-16 sm:pl-28 flex flex-col group"
                    >
                      {/* Node Circle */}
                      <div className="absolute left-0 sm:left-6 top-6 w-12 h-12 rounded-full bg-[#060612] border-2 border-[#3e3ef4] flex items-center justify-center shadow-[0_0_20px_rgba(62,62,244,0.3)] z-10">
                        <span className="text-xs font-mono font-bold text-white">
                          #{stepItem.step}
                        </span>
                      </div>

                      {/* Step Card matching site cards exactly */}
                      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,62,244,0.1)] transition duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#242424] to-black text-white shadow-xs border border-white/20">
                              <Icon className="w-4.5 h-4.5 text-white" />
                            </span>
                            <h4 className="text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-black">
                              Step {stepItem.step} — {stepItem.title}
                            </h4>
                          </div>
                          <span className="self-start sm:self-auto text-xs font-semibold tracking-wide text-white uppercase bg-gradient-to-b from-[#242424] to-black px-3 py-1 rounded-full border border-black/10 shadow-xs">
                            {stepItem.badge}
                          </span>
                        </div>

                        <p className="text-sm sm:text-base font-light text-black/75 leading-relaxed">
                          {stepItem.description}
                        </p>

                        <div className="pt-4 mt-4 border-t border-black/[0.06] flex items-center justify-between text-xs font-mono">
                          <span className="font-medium text-black/50">Performance Metric</span>
                          <span className="font-bold text-black bg-[#f4f4f4] px-3 py-1.5 rounded-lg">
                            {stepItem.metric}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* FINAL OUTCOME SECTION inside modal strictly using site dark/light tokens */}
              <div className="mt-16 bg-white rounded-[24px] p-8 sm:p-12 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] text-center">
                <span className="text-xs font-semibold tracking-wide text-white uppercase bg-gradient-to-b from-[#242424] to-black px-3.5 py-1.5 rounded-full border border-black/10 shadow-xs inline-block mb-4">
                  Guaranteed Deliverables
                </span>
                <h3 className="text-2xl sm:text-4xl font-normal tracking-[-0.03em] text-black mb-3">
                  What You Get. .{' '}
                  <em className="font-serif italic text-black font-normal block sm:inline">
                    Every day
                  </em>
                </h3>
                <p className="text-base font-light text-black/75 max-w-xl mx-auto mb-10">
                  When you deploy Ru&apos;a across your real estate channels, here is your exact operational advantage:
                </p>

                {/* Grid of Check Icons strictly matching website card styles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12 text-left">
                  {WHAT_YOU_GET.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-[#f4f4f4] rounded-[16px] p-4 border border-black/[0.04]"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3e3ef4] text-white">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </span>
                      <span className="text-sm sm:text-base font-medium text-black">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* BOTTOM CTA exactly matching hero buttons */}
                <div className="pt-8 border-t border-black/[0.06] max-w-2xl mx-auto">
                  <h4 className="text-2xl sm:text-3xl font-normal tracking-[-0.02em] text-black mb-3">
                    Ready to put your sales on autopilot?
                  </h4>
                  <p className="text-sm sm:text-base font-light text-black/75 mb-8">
                    Experience how Ru&apos;a AI captures, qualifies, follows up with, and books meetings for your business—24 hours a day.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/book-a-demo" onClick={() => setModalOpen(false)} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black px-8 py-4 text-base font-medium text-white transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-xl cursor-pointer">
                        Book a Live Demo
                      </button>
                    </Link>
                    <Link href="/book-a-demo" onClick={() => setModalOpen(false)} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto rounded-[100px] border border-black/[0.12] bg-gradient-to-b from-white to-[#e2e2e2] px-8 py-4 text-base font-semibold text-black transition-all hover:bg-slate-100 cursor-pointer">
                        Talk to Our Team
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
