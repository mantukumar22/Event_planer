'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, Clock, Sparkles } from 'lucide-react';
import { CrownIcon } from './CrownIcon';

interface SamplePlanMockupProps {
  onLoadSample: () => void;
}

export function SamplePlanMockup({ onLoadSample }: SamplePlanMockupProps) {
  // Sample mini donut segments for visual preview
  const previewSlices = [
    { label: 'Venue & Grounds', pct: 32, color: '#6D28D9' },
    { label: 'Catering & Bar', pct: 30, color: '#22E5FF' },
    { label: 'Photo & Cinema', pct: 12, color: '#A78BFA' },
    { label: 'Royal Florals', pct: 10, color: '#E879F9' },
    { label: 'Music & Audio', pct: 7, color: '#F5C451' },
    { label: 'Reserve Fund', pct: 9, color: '#94A3B8' },
  ];

  return (
    <section id="sample-preview" className="py-20 md:py-28 relative overflow-hidden bg-[var(--surface)]/30 border-y border-[var(--royal)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--royal-light)]/40 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--cyan)]" />
            <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--cyan)]">
              Interactive Blueprint Preview
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            See the exact plan you’ll get.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)]">
            Every output includes balanced budget allocations, countdown checklists, vendor interview questions, and signature ideas.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onLoadSample}
              className="btn-cyan px-7 py-3.5 text-sm font-black flex items-center gap-2 shadow-xl cursor-pointer"
            >
              <CrownIcon size={18} className="text-[#04121A]" />
              <span>Load This Sample Plan Live</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Bento Mockup Preview Card */}
        <div className="royal-glass rounded-3xl p-6 sm:p-10 border border-[var(--royal)]/40 shadow-2xl relative overflow-hidden">
          {/* Header Bar of Sample */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--royal)]/20">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[var(--royal)]/40 text-[var(--gold)] border border-[var(--gold)]/30 uppercase tracking-wider">
                  Royal Wedding Sample
                </span>
                <span className="text-xs text-[var(--muted)]">Napa Valley, CA • 150 Guests</span>
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                Julian & Maya’s Royal Garden Wedding
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">Total Budget</span>
                <p className="font-display font-black text-xl sm:text-2xl text-[var(--cyan)]">$35,000</p>
              </div>
            </div>
          </div>

          {/* Bento Subgrid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
            {/* Donut Preview */}
            <div className="lg:col-span-5 royal-glass p-6 rounded-2xl border border-[var(--royal)]/30 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-white uppercase tracking-wider mb-4 self-start flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[var(--gold)]" />
                Budget Allocation Donut
              </span>

              {/* Mini SVG Donut Chart */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Concentric stroke rings simulating slices */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1D1033" strokeWidth="16" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#6D28D9"
                    strokeWidth="16"
                    strokeDasharray="76.4 238.7"
                    strokeDashoffset="0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#22E5FF"
                    strokeWidth="16"
                    strokeDasharray="71.6 238.7"
                    strokeDashoffset="-76.4"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#A78BFA"
                    strokeWidth="16"
                    strokeDasharray="28.6 238.7"
                    strokeDashoffset="-148.0"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#E879F9"
                    strokeWidth="16"
                    strokeDasharray="23.9 238.7"
                    strokeDashoffset="-176.6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F5C451"
                    strokeWidth="16"
                    strokeDasharray="16.7 238.7"
                    strokeDashoffset="-200.5"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#94A3B8"
                    strokeWidth="16"
                    strokeDasharray="21.5 238.7"
                    strokeDashoffset="-217.2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Verified</span>
                  <span className="font-display font-extrabold text-lg text-white">100%</span>
                  <span className="text-[9px] text-emerald-400 font-semibold">$0 drift</span>
                </div>
              </div>

              {/* Mini Legend */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full text-[11px]">
                {previewSlices.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[var(--muted)] truncate">{s.label} ({s.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Snippet Preview */}
            <div className="lg:col-span-7 royal-glass p-6 rounded-2xl border border-[var(--royal)]/30 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--cyan)]" />
                  Countdown Timeline Milestone Snippet
                </span>

                <div className="space-y-3 mt-3">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-white">Lock In Primary Estate Venue</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">High</span>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">12 Months Before • Finalize contracts with rain contingency clause.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-white">Book Lead Photographer & Cinema</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">High</span>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">10 Months Before • Full-day coverage + drone aerial permits.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--gold)] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-white">Menu Tasting & Allergen Customization</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">Medium</span>
                      </div>
                      <p className="text-[11px] text-[var(--muted)] mt-0.5">5 Months Before • Verify gluten-free, vegan & halal plated items.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--royal)]/20 flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Vendor Checklist: 4 categories • 12 negotiation questions ready</span>
                <span className="text-[var(--gold)] font-bold">100% Editable Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
