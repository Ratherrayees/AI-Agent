'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Waves, ArrowRight, Menu, X } from 'lucide-react';

const NAVBAR_BOTTOM_OFFSET = 80; // top-4 (16px) + h-16 (64px)

const darkPillClass =
  'rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black text-white font-semibold transition-all hover:from-[#2e2e2e] hover:to-neutral-900 shadow-sm';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  const navItems = [
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Pricing & Top-Ups', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  useEffect(() => {
    const updateNavTheme = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      setIsOverHero(hero.getBoundingClientRect().bottom > NAVBAR_BOTTOM_OFFSET);
    };

    updateNavTheme();
    window.addEventListener('scroll', updateNavTheme, { passive: true });
    window.addEventListener('resize', updateNavTheme);

    return () => {
      window.removeEventListener('scroll', updateNavTheme);
      window.removeEventListener('resize', updateNavTheme);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6">
      <div className="pointer-events-auto relative flex items-center justify-between w-full max-w-[1100px] h-16 rounded-[100px] border-[1.1px] border-black/[0.12] bg-transparent px-6 transition-all duration-300">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#3e3ef4] text-white shadow-md shadow-[#3e3ef4]/30 group-hover:scale-105 transition-transform">
            <Waves className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-extrabold text-2xl tracking-tight transition-colors duration-300 ${
                isOverHero ? 'text-white' : 'text-slate-900'
              }`}
            >
              Ru&apos;a
            </span>
            <span
              className={`hidden sm:inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider font-mono ${darkPillClass}`}
            >
              by StateAI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2.5">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`px-5 py-2 text-xs ${darkPillClass}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions (Cleanvoice Signature Pill Buttons) */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link href="/login">
            <button className="rounded-[100px] border border-black/[0.12] bg-gradient-to-b from-white to-[#e2e2e2] px-5 py-2 text-xs font-semibold text-black transition-all hover:bg-slate-100 cursor-pointer">
              Sign In
            </button>
          </Link>
          <Link href="/dashboard">
            <button className={`px-5 py-2 text-xs flex items-center gap-1.5 cursor-pointer ${darkPillClass}`}>
              <span>Launch CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/dashboard">
            <button className="rounded-full bg-[#242424] text-white font-medium text-xs px-3.5 py-1.5">
              Launch
            </button>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isOverHero
                ? 'text-white hover:text-white/70'
                : 'text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-20 inset-x-0 mx-2 bg-white rounded-[24px] border border-black/[0.08] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.12)] space-y-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-[100px] border border-black/[0.12] bg-gradient-to-b from-white to-[#e2e2e2] py-2.5 text-sm font-semibold text-black">
                  Sign In
                </button>
              </Link>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-[100px] border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black py-2.5 text-sm font-semibold text-white">
                  Launch CRM Dashboard
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
