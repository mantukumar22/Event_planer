'use client';

import React from 'react';
import Image from 'next/image';
import { CrownIcon } from './CrownIcon';
import { ShieldCheck, Zap, Sliders, Layers } from 'lucide-react';

export function AboutStats() {
  const stats = [
    {
      value: '3',
      label: 'Signature event formats',
      desc: 'Weddings, Birthdays & Community Galas',
      icon: Layers,
      color: 'text-[var(--cyan)]',
    },
    {
      value: '4-in-1',
      label: 'Integrated blueprint',
      desc: 'Budget, Timeline, Vendors & Ideas',
      icon: ShieldCheck,
      color: 'text-[var(--magenta)]',
    },
    {
      value: '< 60s',
      label: 'Generation speed',
      desc: 'Instant balanced financial breakdown',
      icon: Zap,
      color: 'text-[var(--gold)]',
    },
    {
      value: '100%',
      label: 'Customizable & live',
      desc: 'Auto-recalculating budget sums',
      icon: Sliders,
      color: 'text-emerald-400',
    },
  ];

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Glowing Outlined Blob Heading */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--royal-light)]/50 shadow-md shadow-[var(--royal)]/20 mb-4">
              <CrownIcon size={14} className="text-[var(--gold)]" />
              <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--gold)]">
                Why EventCraft
              </span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Concierge-grade precision,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--royal-light)] to-[var(--magenta)]">
                zero spreadsheet dread.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-[var(--muted)] leading-relaxed font-normal">
              Organizing an unforgettable celebration shouldn’t mean wrestling with broken formulas,
              endless vendor quote tabs, and forgotten logistics. EventCraft AI combines rigorous
              financial balancing with high-touch creative ideas—giving you a production-ready roadmap
              in under a minute.
            </p>

            {/* Big-number Stats Grid */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 w-full">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="royal-glass p-5 rounded-3xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-display font-black text-2xl sm:text-4xl ${stat.color} tracking-tight`}>
                        {stat.value}
                      </span>
                      <IconComponent className="w-5 h-5 text-[var(--muted)] group-hover:text-white transition-colors" aria-hidden="true" />
                    </div>
                    <div className="font-bold text-sm text-white">
                      {stat.label}
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-1 line-clamp-1">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Venue Showcase Photo */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden royal-glass p-2 border border-[var(--gold)]/30 shadow-2xl shadow-[var(--royal)]/30">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/about-venue.webp"
                  alt="Opulent velvet party lounge interior with glowing chandeliers and glowing purple uplighting"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0A0612]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[#0A0612]/80 backdrop-blur-md border border-[var(--royal)]/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Turnkey Event Architecture
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1 font-medium">
                    Every budget item sums automatically to the exact cent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
