'use client';

import React from 'react';
import Image from 'next/image';
import { CrownIcon } from './CrownIcon';
import { SlidersHorizontal, Cpu, Sparkles } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Tell us the vibe & budget',
      subtitle: 'Date, headcount, cultural customs & strict constraints',
      description:
        'Specify your exact budget, guest count, dietary rules, and aesthetic dreams. EventCraft accepts everything from black-tie luxury to grassroots community picnics.',
      icon: SlidersHorizontal,
      color: 'from-[var(--royal)] to-[var(--magenta)]',
    },
    {
      num: '02',
      title: 'Instant royal-grade blueprint',
      subtitle: 'Penny-perfect budget, milestones & vendor questionnaires',
      description:
        'Gemini models craft a custom 4-pillar event dossier: mathematical budget breakdown, phase-by-phase countdown, vendor interview scripts, and curated menu concepts.',
      icon: Cpu,
      color: 'from-[var(--magenta)] to-[var(--cyan)]',
    },
    {
      num: '03',
      title: 'Customize & execute seamlessly',
      subtitle: 'Live recalculation, offline persistence & streaming assistant',
      description:
        'Adjust line items on the fly with live sum balancing, check off completed vendor tasks, export printable PDF / CSV sheets, and ask the AI planner anything.',
      icon: Sparkles,
      color: 'from-[var(--cyan)] to-[var(--gold)]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--royal-light)]/40 mb-4">
            <CrownIcon size={14} className="text-[var(--gold)]" />
            <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--gold)]">
              The Architecture
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            How EventCraft{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--royal-light)] via-[var(--magenta)] to-[var(--cyan)]">
              works.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)]">
            From raw idea to comprehensive operational dossier in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Steps List */}
          <div className="lg:col-span-7 space-y-6">
            {steps.map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="royal-glass p-6 sm:p-8 rounded-3xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/40 transition-all flex flex-col sm:flex-row items-start gap-6 group"
                >
                  <div className="flex sm:flex-col items-center justify-between w-full sm:w-auto shrink-0">
                    <span className="font-display font-black text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-br from-white to-[var(--muted)] group-hover:from-[var(--cyan)] group-hover:to-[var(--gold)] transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--royal)]/40 flex items-center justify-center text-[var(--cyan)] sm:mt-3 shadow-inner">
                      <IconComp className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[var(--gold)] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--royal-light)] mt-1">
                      {step.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--muted)] mt-2.5 leading-relaxed font-normal">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Photo Showcase */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden royal-glass p-2 border border-[var(--royal)]/40 shadow-2xl shadow-[var(--royal)]/30">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/how-it-works-lounge.webp"
                  alt="Atmospheric private party lounge illuminated by ambient violet lights and modern cocktails"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center filter brightness-90 hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0A0612]/90 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0A0612]/85 backdrop-blur-md border border-[var(--gold)]/30">
                  <div className="flex items-center gap-2">
                    <CrownIcon size={16} className="text-[var(--gold)]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Turnkey Execution
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-1">
                    Ready to share with vendors, co-hosts, or venues in one click.
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
