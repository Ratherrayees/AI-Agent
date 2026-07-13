'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, PlusCircle } from 'lucide-react';

type TierTheme = 'silver' | 'gold' | 'mythic';

const tierThemes: Record<
  TierTheme,
  {
    card: string;
    cardInner?: string;
    badge: string;
    badgeFloating?: string;
    title: string;
    description: string;
    price: string;
    period: string;
    divider: string;
    featureLabel: string;
    feature: string;
    featureIcon: string;
    topUp: string;
    button: string;
  }
> = {
  silver: {
    card: 'bg-gradient-to-b from-[#fafbfc] via-white to-[#e4e7eb] border border-[#b8bcc4]/60 shadow-[0_18px_50px_rgba(148,163,184,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] hover:border-[#9ca3af]/70 hover:shadow-[0_22px_60px_rgba(148,163,184,0.24)]',
    cardInner: 'before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent',
    badge: 'text-[#475569] bg-gradient-to-b from-[#f1f5f9] to-[#cbd5e1] border border-[#94a3b8]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]',
    title: 'text-[#1e293b]',
    description: 'text-[#475569]',
    price: 'bg-gradient-to-br from-[#64748b] via-[#475569] to-[#334155] bg-clip-text text-transparent',
    period: 'text-[#64748b]',
    divider: 'border-[#cbd5e1]/60',
    featureLabel: 'text-[#64748b]',
    feature: 'text-[#334155]',
    featureIcon: 'text-[#64748b]',
    topUp: 'font-semibold text-[#475569] bg-gradient-to-r from-[#f1f5f9] to-[#e2e8f0] p-2.5 rounded-xl border border-[#94a3b8]/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    button:
      'bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] text-[#1e293b] border border-[#94a3b8]/50 shadow-[0_4px_14px_rgba(148,163,184,0.25),inset_0_1px_0_rgba(255,255,255,0.9)] hover:from-[#ffffff] hover:via-[#e8edf2] hover:to-[#b8c4d0]',
  },
  gold: {
    card: 'bg-gradient-to-b from-[#fffdf5] via-[#fff9e6] to-[#fef3c7] border-2 border-[#d4a017]/70 shadow-[0_20px_60px_rgba(212,160,23,0.22),inset_0_1px_0_rgba(255,255,255,0.9)] ring-4 ring-[#fbbf24]/15 scale-[1.02] z-10 hover:border-[#ca8a04]/80',
    cardInner: 'before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#fde68a] before:to-transparent',
    badge: 'text-[#78350f] bg-gradient-to-b from-[#fef08a] to-[#fbbf24] border border-[#d97706]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]',
    badgeFloating:
      'bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#b45309] text-[#fffbeb] border border-[#fbbf24]/50 shadow-[0_4px_20px_rgba(217,119,6,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]',
    title: 'text-[#451a03]',
    description: 'text-[#78350f]/80',
    price: 'bg-gradient-to-br from-[#b45309] via-[#d97706] to-[#92400e] bg-clip-text text-transparent',
    period: 'text-[#a16207]',
    divider: 'border-[#fcd34d]/50',
    featureLabel: 'text-[#92400e]',
    feature: 'text-[#78350f]',
    featureIcon: 'text-[#d97706]',
    topUp: 'font-semibold text-[#92400e] bg-gradient-to-r from-[#fef9c3] to-[#fde68a] p-2.5 rounded-xl border border-[#fbbf24]/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]',
    button:
      'bg-gradient-to-b from-[#fbbf24] via-[#d97706] to-[#b45309] text-[#fffbeb] border border-[#fde68a]/40 shadow-[0_6px_24px_rgba(217,119,6,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-[#fcd34d] hover:via-[#ea580c] hover:to-[#c2410c]',
  },
  mythic: {
    card: 'bg-gradient-to-br from-[#0a0505] via-[#1a0808] to-[#0d0404] border border-[#dc2626]/45 shadow-[0_24px_70px_rgba(153,27,27,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#ef4444]/60 hover:shadow-[0_28px_80px_rgba(220,38,38,0.45)]',
    cardInner:
      'before:absolute before:inset-0 before:rounded-[24px] before:bg-[radial-gradient(ellipse_at_20%_0%,rgba(220,38,38,0.2),transparent_50%),radial-gradient(ellipse_at_80%_100%,rgba(127,29,29,0.25),transparent_45%)] before:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#f87171]/50 after:to-transparent',
    badge:
      'text-[#fecaca] bg-gradient-to-r from-[#450a0a]/90 via-[#991b1b]/70 to-[#450a0a]/90 border border-[#dc2626]/50 shadow-[0_0_20px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]',
    title: 'text-[#fef2f2]',
    description: 'text-[#fca5a5]/90',
    price: 'bg-gradient-to-br from-[#fecaca] via-[#f87171] to-[#dc2626] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(220,38,38,0.4)]',
    period: 'text-[#f87171]',
    divider: 'border-[#991b1b]/40',
    featureLabel: 'text-[#fca5a5]',
    feature: 'text-[#fecaca]/90',
    featureIcon: 'text-[#ef4444]',
    topUp:
      'font-semibold text-[#fecaca] bg-gradient-to-r from-[#450a0a]/60 via-[#991b1b]/35 to-[#7f1d1d]/30 p-2.5 rounded-xl border border-[#dc2626]/45 shadow-[0_0_16px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.06)]',
    button:
      'bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#7f1d1d] text-[#fef2f2] border border-[#f87171]/35 shadow-[0_6px_28px_rgba(153,27,27,0.55),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-[#b91c1c] hover:via-[#ef4444] hover:to-[#991b1b]',
  },
};

export function LandingPricing() {
  const tiers: Array<{
    name: string;
    theme: TierTheme;
    priceDisplay: string;
    period: string;
    topUpNote?: string;
    description: string;
    popular: boolean;
    badge: string;
    ctaText: string;
    features: string[];
  }> = [
    {
      name: 'Starter',
      theme: 'silver',
      priceDisplay: '$149',
      period: '/ month',
      topUpNote: 'Top-Ups Available Anytime',
      description: 'Perfect for individual real estate agents automating lead follow-up and appointment scheduling.',
      popular: false,
      badge: 'Starter Package',
      ctaText: 'Launch Starter Plan',
      features: [
        '250 AI Voice Minutes / month',
        '1 Autonomous Persona (Ru’a - Lead Qualifier)',
        'Instant 5-Second Speed-to-Lead Triggering',
        'Bidirectional Google & Outlook Calendar Sync',
        'StateAI Appwrite CRM Dashboard Access',
        'Automated SMS & Text Follow-Up Messaging'
      ]
    },
    {
      name: 'Pro',
      theme: 'gold',
      priceDisplay: '$399',
      period: '/ month',
      topUpNote: 'Top-Ups Available Anytime',
      description: 'Our recommended plan for active real estate teams demanding full omnichannel lead dominance.',
      popular: true,
      badge: 'Most Popular',
      ctaText: 'Launch Pro Plan',
      features: [
        '1,000 AI Voice Minutes / month',
        '5 Custom Personas + Instant Voice Cloning',
        'Sub-280ms Priority Acoustic Edge Routing',
        'Instant Barge-In Interruption Handling',
        'Full Appwrite CRM Sync & Deal Pipelines',
        'Omnichannel Hand-Offs (Voice ↔ SMS ↔ WhatsApp)',
        'Priority Webhook & Zapier Integration Access'
      ]
    },
    {
      name: 'Premium',
      theme: 'mythic',
      priceDisplay: 'Talk to Expert',
      period: '',
      description: 'Engineered specifically for high-volume brokerages, commercial firms, and multi-office teams.',
      popular: false,
      badge: 'Custom Enterprise',
      ctaText: 'Contact Expert Team',
      features: [
        'Custom Voice Volume (10,000+ Minutes)',
        'Dedicated Sub-200ms Edge Nodes & Private SIP Trunking',
        'Unlimited Personas & Multi-Lingual Dialects',
        'Full White-Label Dashboard (Your Brokerage Brand)',
        'Dedicated AI Script Engineer & Account Manager',
        'TCPA, SOC-2 Type II & GDPR Compliance Suite',
        '24/7 Priority Phone Support & 99.98% SLA Guarantee'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-[#f4f4f4]">
      <div className="max-w-[1150px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-[32px] sm:text-[45px] font-normal leading-[1.1] tracking-[-0.03em] text-black mb-4">
            Simple plans with instant top-ups. .{' '}
            <em className="font-serif italic text-black font-normal block sm:inline">
              No contracts
            </em>
          </h2>
          <p className="text-base sm:text-lg font-light leading-relaxed text-black/80 max-w-2xl mx-auto">
            Start with your core monthly minutes and add top-up minutes anytime right from your dashboard.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {tiers.map((tier, idx) => {
            const theme = tierThemes[tier.theme];

            return (
              <div key={idx} className="relative flex flex-col h-full pt-5">
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <span
                      className={`whitespace-nowrap font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md font-mono ${theme.badgeFloating ?? theme.badge}`}
                    >
                      ⭐ {tier.badge}
                    </span>
                  </div>
                )}

                <div
                  className={`relative flex flex-col justify-between flex-1 rounded-[24px] p-8 transition-all overflow-hidden ${theme.card} ${theme.cardInner ?? ''}`}
                >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl font-semibold tracking-[-0.02em] ${theme.title}`}>{tier.name}</h3>
                    {!tier.popular && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full font-mono ${theme.badge}`}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </div>

                  <p className={`text-sm font-light mb-6 min-h-[44px] leading-relaxed ${theme.description}`}>
                    {tier.description}
                  </p>

                  <div className={`mb-8 pb-8 border-b ${theme.divider}`}>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-4xl sm:text-5xl font-semibold tracking-tight font-sans ${theme.price}`}>
                        {tier.priceDisplay}
                      </span>
                      {tier.period && (
                        <span className={`text-sm font-medium ${theme.period}`}>{tier.period}</span>
                      )}
                    </div>
                    {tier.topUpNote && (
                      <p className={`mt-3 text-xs sm:text-sm leading-snug ${theme.topUp}`}>{tier.topUpNote}</p>
                    )}
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3.5 mb-8">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-3 font-mono ${theme.featureLabel}`}>
                      What&apos;s Included:
                    </div>
                    {tier.features.map((feat, fIdx) => (
                      <div
                        key={fIdx}
                        className={`flex items-start gap-2.5 text-xs sm:text-sm leading-snug font-light ${theme.feature}`}
                      >
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${theme.featureIcon}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-auto relative z-10">
                  <Link href="/dashboard" className="block w-full">
                    <button
                      className={`w-full h-12 rounded-[100px] font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${theme.button}`}
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Cleanvoice style Top-Up Callout Banner */}
        <div className="max-w-[1150px] mx-auto bg-[#060612] text-white rounded-[28px] p-8 sm:p-10 shadow-xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-60"
            style={{
              background: 'radial-gradient(circle at 10% 50%, rgba(62, 62, 244, 0.45), transparent 45%)',
            }}
          />
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-3.5 rounded-2xl bg-white/10 text-[#3e3ef4] shrink-0 border border-white/15">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="font-semibold text-lg sm:text-xl text-white tracking-[-0.01em]">
                  Need more voice minutes during peak listing season?
                </h4>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider font-mono">
                  Instant Top-Up
                </span>
              </div>
              <p className="text-xs sm:text-sm font-light text-white/80 leading-relaxed max-w-2xl">
                You never have to upgrade your entire monthly tier just because your listings double in spring. Add <strong className="text-white font-medium">additional minute top-up bundles</strong> anytime directly inside your billing dashboard—your agent never stops qualifying leads.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-auto relative z-10">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black px-6 py-3.5 text-xs sm:text-sm font-medium text-white transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-lg cursor-pointer">
                View Top-Up Options
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
