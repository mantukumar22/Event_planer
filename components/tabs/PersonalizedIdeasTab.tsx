'use client';

import React from 'react';
import {
  Palette,
  Sparkles,
  Utensils,
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
      <div className="royal-glass rounded-3xl p-5 sm:p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--gold)]/30">
              Creative Curation & Tips
            </span>
            <span className="text-xs font-semibold text-[var(--cyan)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--cyan)]/30">
              Vibe: {themeVibe}
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Bespoke aesthetic palettes, signature menu ideas tailored to dietary preferences, crowd-pleasing activities, and actionable cost-saving hacks.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/40 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)] cursor-pointer ml-auto md:ml-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
          <span>Regenerate Ideas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Theme & Decor Aesthetics */}
        <section
          aria-labelledby="ideas-theme-heading"
          className="royal-glass rounded-3xl p-6 sm:p-8 border border-[var(--royal)]/40 shadow-xl flex flex-col"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--royal)]/20">
            <div className="p-2.5 rounded-xl bg-[var(--royal)]/30 text-[var(--magenta)] border border-[var(--magenta)]/30">
              <Palette className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-theme-heading" className="font-display font-bold text-sm sm:text-base text-white">
                Aesthetic Vision & Color Palette
              </h3>
              <p className="text-xs text-[var(--muted)]">Cohesive motifs and atmosphere styling</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-1.5">
                Concept & Atmosphere
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed bg-[var(--surface-2)]/80 p-4 rounded-2xl border border-[var(--royal)]/25">
                {ideas.themeDetails.concept}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2.5">
                Recommended Color Palette
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {ideas.themeDetails.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--royal)]/30 text-xs font-bold text-white"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-md border border-white/20 shrink-0"
                      style={{
                        backgroundColor: color.startsWith('#')
                          ? color
                          : ['#6D28D9', '#E879F9', '#F5C451', '#22E5FF', '#A78BFA'][i % 5],
                      }}
                      aria-hidden="true"
                    />
                    <span>{color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] mb-2.5">
                Key Decor & Atmospheric Elements
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-[var(--text)]">
                {ideas.themeDetails.decorElements.map((elem, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[var(--cyan)] shrink-0 mt-0.5" aria-hidden="true" />
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
          className="royal-glass rounded-3xl p-6 sm:p-8 border border-[var(--royal)]/40 shadow-xl flex flex-col"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--royal)]/20">
            <div className="p-2.5 rounded-xl bg-[var(--surface-2)] text-[var(--gold)] border border-[var(--gold)]/30">
              <Utensils className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-menu-heading" className="font-display font-bold text-sm sm:text-base text-white">
                Custom Menu & Beverage Concepts
              </h3>
              <p className="text-xs text-[var(--muted)]">Dietary-conscious tasting roadmap</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Signature Drink */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[var(--royal)]/40 via-[var(--surface-2)] to-[var(--magenta)]/30 border border-[var(--magenta)]/40">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-1">
                <GlassWater className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>Signature Cocktail / Mocktail</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-white">
                {ideas.customMenu.signatureCocktailMocktail}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-[var(--surface-2)]/80 rounded-2xl border border-[var(--royal)]/25">
                <h4 className="font-bold uppercase tracking-wider text-[var(--cyan)] mb-2">
                  Appetizers & Starters
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-[var(--text)]">
                  {ideas.customMenu.appetizers.map((app, i) => (
                    <li key={i}>{app}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-[var(--surface-2)]/80 rounded-2xl border border-[var(--royal)]/25">
                <h4 className="font-bold uppercase tracking-wider text-[var(--magenta)] mb-2">
                  Mains & Entrees
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-[var(--text)]">
                  {ideas.customMenu.mains.map((main, i) => (
                    <li key={i}>{main}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-xs sm:text-sm bg-[var(--surface-2)]/80 p-3.5 rounded-2xl border border-[var(--royal)]/25 flex items-start gap-2">
              <span className="font-bold text-[var(--gold)] shrink-0">Dessert:</span>
              <span className="text-[var(--text)]">{ideas.customMenu.dessert}</span>
            </div>

            {ideas.customMenu.dietaryNotes && (
              <div className="text-xs bg-emerald-950/60 text-emerald-300 p-3 rounded-2xl border border-emerald-500/30">
                <strong className="text-emerald-200">Dietary & Allergy Accommodations:</strong> {ideas.customMenu.dietaryNotes}
              </div>
            )}
          </div>
        </section>

        {/* Card 3: Activities & Entertainment Highlights */}
        <section
          aria-labelledby="ideas-activities-heading"
          className="royal-glass rounded-3xl p-6 sm:p-8 border border-[var(--royal)]/40 shadow-xl flex flex-col"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--royal)]/20">
            <div className="p-2.5 rounded-xl bg-[var(--royal)]/30 text-[var(--cyan)] border border-[var(--cyan)]/30">
              <PartyPopper className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-activities-heading" className="font-display font-bold text-sm sm:text-base text-white">
                Curated Activities & Icebreakers
              </h3>
              <p className="text-xs text-[var(--muted)]">Memorable moments designed for guest engagement</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {ideas.activities.map((act, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/40 transition-colors bg-[var(--surface-2)]/70"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {act.title}
                  </h4>
                  <span className="text-[10px] font-bold text-[var(--cyan)] bg-[var(--royal)]/30 px-2.5 py-0.5 rounded-full border border-[var(--cyan)]/30 shrink-0">
                    {act.targetAudience}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
                  {act.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Card 4: Money-Saving Tips ("Budget Hackers") */}
        <section
          aria-labelledby="ideas-hacks-heading"
          className="royal-glass rounded-3xl p-6 sm:p-8 border border-[var(--royal)]/40 shadow-xl flex flex-col"
        >
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--royal)]/20">
            <div className="p-2.5 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-500/30">
              <PiggyBank className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="ideas-hacks-heading" className="font-display font-bold text-sm sm:text-base text-white">
                Strategic Money-Saving Hacks
              </h3>
              <p className="text-xs text-[var(--muted)]">High impact savings without sacrificing guest experience</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {ideas.moneySavingHacks.map((hack, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {hack.tip}
                  </h4>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-500/40 shrink-0">
                    Save {hack.estimatedSavings}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] leading-relaxed mt-1">
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
