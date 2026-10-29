'use client';

import React from 'react';
import {
  Palette,
  Sparkles,
  Utensils,
  Lightbulb,
  PiggyBank,
  Check,
  GlassWater,
  PartyPopper,
} from 'lucide-react';
import { IdeasPlan } from '@/lib/schemas';

interface PersonalizedIdeasTabProps {
  ideas: IdeasPlan;
  themeVibe: string;
  onOpenRegenerate: () => void;
}

export function PersonalizedIdeasTab({
  ideas,
  themeVibe,
  onOpenRegenerate,
}: PersonalizedIdeasTabProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Creative Curation & Tips
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
              Vibe: {themeVibe}
            </span>
          </div>

          <p className="mt-2 text-sm text-stone-600 max-w-2xl">
            Bespoke aesthetic palettes, signature menu ideas tailored to dietary preferences, crowd-pleasing activities, and actionable cost-saving hacks.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ml-auto md:ml-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Regenerate Ideas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Theme & Decor Aesthetics */}
        <section
          aria-labelledby="ideas-theme-heading"
          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Palette className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-theme-heading" className="text-sm font-bold text-stone-900">
                Aesthetic Vision & Color Palette
              </h3>
              <p className="text-xs text-stone-500">Cohesive motifs and atmosphere styling</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Concept & Atmosphere
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                {ideas.themeDetails.concept}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Recommended Color Palette
              </h4>
              <div className="flex flex-wrap gap-2">
                {ideas.themeDetails.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-inner border border-black/10 shrink-0"
                      style={{
                        backgroundColor: color.startsWith('#')
                          ? color
                          : ['#B45309', '#047857', '#BE185D', '#4338CA', '#D97706'][i % 5],
                      }}
                      aria-hidden="true"
                    />
                    <span>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Key Decor & Atmospheric Elements
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {ideas.themeDetails.decorElements.map((elem, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{elem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Card 2: Custom Menu & Signature Beverage */}
        <section
          aria-labelledby="ideas-menu-heading"
          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Utensils className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-menu-heading" className="text-sm font-bold text-stone-900">
                Custom Menu & Beverage Concepts
              </h3>
              <p className="text-xs text-stone-500">Dietary-conscious tasting roadmap</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Signature Drink */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/40">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                <GlassWater className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Signature Cocktail / Mocktail</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">
                {ideas.customMenu.signatureCocktailMocktail}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <h4 className="font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Appetizers & Starters
                </h4>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  {ideas.customMenu.appetizers.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <h4 className="font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mains & Entrees
                </h4>
                <ul className="space-y-1 list-disc list-inside text-stone-600">
                  {ideas.customMenu.mains.map((main, i) => (
                    <li key={i}>{main}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-xs bg-stone-50 p-3 rounded-xl border border-stone-200/60 flex items-start gap-2">
              <span className="font-bold text-stone-700 shrink-0">Dessert:</span>
              <span className="text-stone-600">{ideas.customMenu.dessert}</span>
            </div>

            {ideas.customMenu.dietaryNotes && (
              <div className="text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                <strong>Dietary & Allergy Accommodations:</strong> {ideas.customMenu.dietaryNotes}
              </div>
            )}
          </div>
        </section>

        {/* Card 3: Activities & Entertainment Highlights */}
        <section
          aria-labelledby="ideas-activities-heading"
          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <PartyPopper className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-activities-heading" className="text-sm font-bold text-stone-900">
                Curated Activities & Icebreakers
              </h3>
              <p className="text-xs text-stone-500">Memorable moments designed for guest engagement</p>
            </div>
          </div>

          <div className="space-y-3">
            {ideas.activities.map((act, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-stone-200/80 hover:border-amber-300 transition-colors bg-stone-50/50"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {act.title}
                  </h4>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 shrink-0">
                    {act.targetAudience}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Card 4: Money-Saving Tips ("Budget Hackers") */}
        <section
          aria-labelledby="ideas-hacks-heading"
          className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col"
        >
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <PiggyBank className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-hacks-heading" className="text-sm font-bold text-stone-900">
                Strategic Money-Saving Hacks
              </h3>
              <p className="text-xs text-stone-500">High impact savings without sacrificing guest experience</p>
            </div>
          </div>

          <div className="space-y-3">
            {ideas.moneySavingHacks.map((hack, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-emerald-200/70 bg-emerald-50/20"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                    {hack.tip}
                  </h4>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Save {hack.estimatedSavings}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {hack.implementation}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
