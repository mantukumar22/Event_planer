import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  clampNumber,
  formatSafeCurrency,
  sanitizePlan,
} from '@/lib/guardrails';
import { EventPlan } from '@/lib/schemas';

describe('AI Guardrails & Sanitization Library', () => {
  describe('sanitizeString', () => {
    it('strips dangerous HTML tags', () => {
      const malicious = '<script>alert("hack")</script>Hello <b>World</b><iframe src="x"></iframe>';
      const clean = sanitizeString(malicious);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('<iframe>');
      expect(clean).toBe('Hello World');
    });

    it('removes ASCII control characters', () => {
      const dirty = 'Hello\x00\x08World\x1B!';
      const clean = sanitizeString(dirty);
      expect(clean).toBe('HelloWorld!');
    });

    it('enforces maxLength truncation', () => {
      const long = 'a'.repeat(200);
      const clean = sanitizeString(long, 50);
      expect(clean.length).toBe(50);
    });

    it('handles non-string inputs gracefully', () => {
      expect(sanitizeString(null as any)).toBe('');
      expect(sanitizeString(undefined as any)).toBe('');
    });
  });

  describe('clampNumber', () => {
    it('clamps negative numbers to zero when min is zero', () => {
      expect(clampNumber(-50, 0, 1000)).toBe(0);
    });

    it('clamps absurd numbers to max', () => {
      expect(clampNumber(999999999, 0, 1000000)).toBe(1000000);
    });

    it('returns default value when input is NaN', () => {
      expect(clampNumber(NaN, 0, 100, 25)).toBe(25);
    });
  });

  describe('formatSafeCurrency', () => {
    it('formats USD currency safely via Intl.NumberFormat', () => {
      const formatted = formatSafeCurrency(12500, 'USD');
      expect(formatted).toBe('$12,500');
    });

    it('formats EUR currency safely', () => {
      const formatted = formatSafeCurrency(5400, 'EUR');
      expect(formatted).toContain('5,400');
    });

    it('handles invalid numbers safely', () => {
      expect(formatSafeCurrency(NaN, 'USD')).toBe('$0');
    });
  });

  describe('sanitizePlan', () => {
    it('cleanses all text and number fields in a generated plan', () => {
      const plan: EventPlan = {
        createdAt: '2026-10-30',
        intake: {
          eventType: 'birthday',
          eventTitle: '<b>Party</b>',
          eventDate: '2027-01-01',
          guestCount: 50,
          totalBudget: 5000,
          currency: 'USD',
          location: 'Miami',
          themeVibe: 'Neon',
          venueSetting: 'indoor',
        },
        executiveSummary: '<script>alert(1)</script>A fun party',
        budget: {
          totalBudget: 5000,
          currency: 'USD',
          contingencyAmount: 500,
          items: [
            {
              id: '1',
              category: '<style>x</style>Decor',
              percentage: 20,
              allocatedAmount: 1000,
              notes: 'Balloons',
            },
          ],
          summary: 'Safe summary',
        },
        timeline: {
          phases: ['Phase 1'],
          tasks: [],
          dayOfSchedule: [],
        },
        vendors: {
          vendors: [],
          tips: [],
        },
        ideas: {
          themeDetails: {
            concept: 'Neon',
            colorPalette: ['#000'],
            decorElements: ['Lights'],
          },
          activities: [],
          customMenu: {
            signatureCocktailMocktail: 'Royal Fizz',
            appetizers: [],
            mains: [],
            dessert: 'Cake',
            dietaryNotes: 'None',
          },
          moneySavingHacks: [],
        },
        assumptions: ['<script>bad()</script>Assume indoor'],
      };

      const sanitized = sanitizePlan(plan);
      expect(sanitized.executiveSummary).toBe('A fun party');
      expect(sanitized.budget.items[0].category).toBe('Decor');
      expect(sanitized.assumptions?.[0]).toBe('Assume indoor');
    });
  });
});
