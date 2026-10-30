'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { CrownIcon } from './CrownIcon';
import { NeonPath } from './NeonPath';

interface HeroProps {
  onScrollToForm: () => void;
  onPreviewSample?: () => void;
  onSelectPreset?: (preset: any) => void;
}

export function Hero({ onScrollToForm, onPreviewSample = () => {} }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[var(--royal)]/30">
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-royal-party.webp"
          alt="Atmospheric rooftop VIP party bathed in glowing magenta and royal purple neon lighting"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center filter brightness-[0.6] contrast-[1.1]"
        />
        {/* Dark purple radial and linear gradient overlay to ensure WCAG 4.5:1 contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#0A0612]/90 via-[#0A0612]/75 to-[#0A0612]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.35)_0%,transparent_75%)]"
          aria-hidden="true"
        />
      </div>

      {/* Curved neon path behind hero content */}
      <NeonPath variant="curve-left" className="top-10 -left-10 w-[120%] h-[700px] z-10 opacity-70" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center flex flex-col items-center">
        {/* Floating Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface)]/80 border border-[var(--gold)]/40 shadow-lg shadow-[var(--royal)]/20 mb-6 backdrop-blur-md">
          <CrownIcon size={16} className="text-[var(--gold)]" />
          <span className="font-accent italic text-xs sm:text-sm text-[var(--gold)] font-medium tracking-wide">
            your day, your crown
          </span>
          <span className="text-[10px] text-[var(--muted)]">•</span>
          <span className="text-xs font-bold text-white tracking-wider uppercase">
            GenAI Event Engine
          </span>
        </div>

        {/* Big Bold Headline in Unbounded */}
        <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] max-w-4xl drop-shadow-md">
          Plan the party they’ll{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--gold)]">
            never forget.
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 text-base sm:text-xl text-[var(--muted)] max-w-2xl leading-relaxed font-normal">
          Tell us your vision, guest size, and budget. EventCraft AI generates a complete,
          mathematically balanced plan with actionable checklists, vendor questions, and personalized touches.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={onScrollToForm}
            className="btn-cyan px-8 py-4 text-sm sm:text-base font-extrabold flex items-center gap-3 cursor-pointer"
          >
            <span>Plan My Event</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onPreviewSample}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[var(--surface)]/80 hover:bg-[var(--surface-2)] text-white font-bold text-sm sm:text-base border border-[var(--royal-light)]/40 hover:border-[var(--gold)] transition-all backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
          >
            <Eye className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
            <span>See a sample plan</span>
          </button>
        </div>

        {/* Floating Glass Chips */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl">
          <div className="royal-glass p-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-md">
            <Sparkles className="w-4 h-4 text-[var(--gold)] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-white">Budget in seconds</span>
          </div>

          <div className="royal-glass p-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-[var(--cyan)] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-white">Smart timeline</span>
          </div>

          <div className="royal-glass p-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-md">
            <Sparkles className="w-4 h-4 text-[var(--magenta)] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-white">Vendor checklist</span>
          </div>

          <div className="royal-glass p-3.5 rounded-2xl flex items-center justify-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-white">100% editable</span>
          </div>
        </div>
      </div>
    </section>
  );
}
