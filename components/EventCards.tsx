'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Users, DollarSign } from 'lucide-react';
import { PRESET_EVENTS } from '@/lib/constants';
import { IntakeFormData } from '@/lib/schemas';
import { CrownIcon } from './CrownIcon';

interface EventCardsProps {
  onSelectPreset: (preset: IntakeFormData) => void;
}

export function EventCards({ onSelectPreset }: EventCardsProps) {
  const cards = [
    {
      type: 'wedding',
      badge: 'Royal Weddings',
      title: 'Romantic Garden Elegance',
      subtitle: 'Napa Valley • 150 Guests • $35,000',
      description: 'Lush lavender florals, farm-to-table cuisine, live strings & gold sparkler grand exit.',
      image: '/images/card-wedding.webp',
      imageAlt: 'Elegant outdoor royal wedding banquet illuminated by glowing fairy lights and purple hues',
      presetId: 'wedding-150',
    },
    {
      type: 'birthday',
      badge: 'Epic Birthdays',
      title: 'Dino Explorer Safari (8th)',
      subtitle: 'Austin • 25 Adventurers • $1,200',
      description: 'Fossil dig zones, erupting volcano cake, safari vests & allergen-safe feast.',
      image: '/images/card-birthday.webp',
      imageAlt: 'Energetic neon birthday celebration table with festive decor and ambient lighting',
      presetId: 'birthday-kid',
    },
    {
      type: 'community',
      badge: 'Community Galas',
      title: 'Summer Block Party & Cook-off',
      subtitle: 'Chicago • 200 Neighbors • $5,000',
      description: 'Street closures, artisan food tents, local live jazz & quiet sensory-friendly zones.',
      image: '/images/card-community.webp',
      imageAlt: 'Lively community festival night with string lights, vendor booths, and gathering crowds',
      presetId: 'community-fundraiser',
    },
  ];

  const handleCardClick = (presetId: string) => {
    const found = PRESET_EVENTS.find((p) => p.id === presetId);
    if (found) {
      onSelectPreset(found.data);
    }
  };

  return (
    <section id="event-types" className="py-20 md:py-28 bg-[var(--surface)]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--royal-light)]/40 mb-4">
            <CrownIcon size={14} className="text-[var(--gold)]" />
            <span className="font-display font-bold text-xs uppercase tracking-widest text-[var(--gold)]">
              Made For Every Celebration
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Tailored blueprints for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--magenta)] via-[var(--cyan)] to-[var(--gold)]">
              any scale.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)]">
            Explore curated blueprints designed for weddings, landmark birthdays, and neighborhood galas.
            Click &ldquo;Plan this&rdquo; to pre-fill the assistant.
          </p>
        </div>

        {/* 3 Image Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card) => {
            const preset = PRESET_EVENTS.find((p) => p.id === card.presetId)?.data;
            return (
              <div
                key={card.presetId}
                className="group royal-glass rounded-3xl overflow-hidden border border-[var(--royal)]/30 hover:border-[var(--gold)]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[var(--royal)]/25"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#0A0612]/80 backdrop-blur-md text-[var(--gold)] border border-[var(--gold)]/40">
                    {card.badge}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-[var(--cyan)] transition-colors">
                      {card.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-[var(--gold)] font-medium mt-1">
                      <span>{card.subtitle}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--muted)] mt-3 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Plan This Button */}
                  <div className="mt-6 pt-4 border-t border-[var(--royal)]/20 flex items-center justify-between">
                    <span className="text-xs text-[var(--muted)] font-medium">
                      {preset?.guestCount} guests • {preset?.currency} ${preset?.totalBudget.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCardClick(card.presetId)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--cyan)] hover:bg-[#55EEFF] text-[#04121A] text-xs font-black transition-all shadow-md shadow-[var(--cyan)]/20 cursor-pointer"
                    >
                      <span>Plan this</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
