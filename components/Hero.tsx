'use client';

import React from 'react';
import { Sparkles, Calendar, DollarSign, Clock, Users, ArrowRight } from 'lucide-react';
import { PRESET_EVENTS } from '@/lib/constants';
import { IntakeFormData } from '@/lib/schemas';

interface HeroProps {
  onSelectPreset: (preset: IntakeFormData) => void;
  onScrollToForm: () => void;
}

export function Hero({ onSelectPreset, onScrollToForm }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-stone-100 py-12 md:py-16 border-b border-stone-800">
      {/* Decorative ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
            <span>AI-Crafted Weddings, Birthdays & Community Gatherings</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight text-white leading-tight">
            Stress-free event planning with bespoke budgets, timelines & ideas.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
            Tell us your vision, guest size, and budget. EventCraft AI generates a complete,
            mathematically balanced plan with actionable checklists, vendor questions, and personalized touches.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToForm}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-stone-900 cursor-pointer"
            >
              <span>Build Custom Plan</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-xs text-stone-400 font-medium">or pick a sample event below</span>
          </div>
        </div>

        {/* 3-Step Process */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-stone-800/80">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-100">Describe Your Event</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Target date, guest count, vibe, cultural customs, and budget parameters.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-100">AI Generates Full Plan</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Exact budget breakdown, countdown tasks, vendor questionnaires, and menu ideas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-800/40 border border-stone-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-100">Live Edit & Ask Assistant</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Tweak line items with auto-rebalancing, check off tasks, and chat with AI planner.
              </p>
            </div>
          </div>
        </div>

        {/* Preset Quick Selectors */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Try an Example Preset:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_EVENTS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset.data)}
                className="group text-left p-4 rounded-xl bg-stone-850 hover:bg-stone-800 border border-stone-750 hover:border-amber-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-stone-700/60 text-stone-300 capitalize">
                    {preset.data.eventType}
                  </span>
                  <span className="text-xs text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Load Preset &rarr;
                  </span>
                </span>
                <span className="block mt-2 text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  {preset.title}
                </span>
                <span className="block text-xs text-stone-400 mt-1 line-clamp-1">
                  {preset.subtitle}
                </span>
                <span className="mt-3 flex items-center gap-3 text-[11px] text-stone-400 pt-2 border-t border-stone-800">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-stone-500" aria-hidden="true" />
                    ${preset.data.totalBudget.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-stone-500" aria-hidden="true" />
                    {preset.data.guestCount} guests
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
