import React from 'react';
import { ShieldCheck, Info, ArrowRight } from 'lucide-react';
import { CrownIcon } from './CrownIcon';

interface FooterProps {
  onScrollToForm?: () => void;
}

export function Footer({ onScrollToForm }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[var(--royal)]/25 bg-[var(--ink)] text-[var(--muted)] print:hidden">
      {/* Final CTA Band */}
      <section className="relative overflow-hidden border-b border-[var(--royal)]/25 py-16 sm:py-20 bg-gradient-to-r from-[var(--surface)] via-[var(--surface-2)] to-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--gold)]/30 mb-4">
            <CrownIcon size={14} className="text-[var(--gold)]" />
            <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--gold)]">
              Your Blueprint Awaits
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Ready to make{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--gold)]">
              history?
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto">
            Design an unforgettable event with verified math, actionable timelines, and concierge-level ideas in less than 60 seconds.
          </p>

          <div className="mt-8 flex justify-center">
            {onScrollToForm ? (
              <button
                type="button"
                onClick={onScrollToForm}
                className="btn-cyan px-8 py-4 text-sm sm:text-base font-extrabold flex items-center gap-3 cursor-pointer shadow-xl"
              >
                <span>Plan My Event Now</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            ) : (
              <a
                href="#planner"
                className="btn-cyan px-8 py-4 text-sm sm:text-base font-extrabold flex items-center gap-3 cursor-pointer shadow-xl"
              >
                <span>Plan My Event Now</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Footer Links & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[var(--royal)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--surface-2)] border border-[var(--royal)]/40 flex items-center justify-center text-[var(--gold)] shadow-md">
              <CrownIcon size={22} className="text-[var(--gold)]" />
            </div>
            <div>
              <span className="font-display font-black text-white text-lg">
                EventCraft AI
              </span>
              <p className="text-xs text-[var(--muted)] font-medium">
                Precision event budgeting, timelines & personalized royal curation
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#event-types" className="hover:text-white transition-colors">
              Event Types
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#planner" className="hover:text-white transition-colors">
              Planner
            </a>
          </div>
        </div>

        {/* Mandatory AI & Estimates Disclaimer */}
        <div className="p-4 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--royal)]/30 text-xs text-[var(--muted)] leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-bold text-white mb-1">
              Important Planning Disclaimer
            </p>
            <p>
              Estimates, pricing ranges, and vendor guidance are AI-generated based on typical industry averages and seasonal benchmarks. Real-world costs vary by exact date, venue restrictions, and supplier contracts. Always verify terms, permits, and pricing directly with contracted vendors and local municipal authorities before committing deposits.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)] pt-2">
          <p>© {new Date().getFullYear()} EventCraft AI. Royal Gen Z Nightlife Edition.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Zero telemetry tracking</span>
            </span>
            <span>•</span>
            <span>WCAG 2.2 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
