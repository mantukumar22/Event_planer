import React from 'react';
import { CrownIcon } from './CrownIcon';

export function MarqueeStrip() {
  const words = [
    'WEDDINGS',
    'BIRTHDAYS',
    'COMMUNITY GALAS',
    'ROOFTOP PARTIES',
    'ANNIVERSARIES',
    'VIP SOIRÉES',
    'FUNDRAISERS',
    'FESTIVALS',
  ];

  return (
    <div
      className="relative w-full overflow-hidden border-y border-[var(--royal)]/20 bg-[var(--surface)]/70 backdrop-blur-md py-3.5 select-none"
      aria-hidden="true"
    >
      <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
        {[...words, ...words].map((word, idx) => (
          <div key={idx} className="flex items-center gap-8">
            <span className="font-display font-extrabold text-xs sm:text-sm tracking-[0.25em] text-[var(--muted)] hover:text-[var(--gold)] transition-colors">
              {word}
            </span>
            <CrownIcon size={14} className="text-[var(--magenta)] opacity-70 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
