import { describe, it, expect } from 'vitest';
import { escapeCsvCell, generatePlanCsv } from '@/lib/export-utils';
import { EventPlan } from '@/lib/schemas';

describe('Export utilities', () => {
  it('escapes special characters in CSV cells properly', () => {
    expect(escapeCsvCell('Hello, World')).toBe('"Hello, World"');
    expect(escapeCsvCell('He said "yes"')).toBe('"He said ""yes"""');
    expect(escapeCsvCell('Line1\nLine2')).toBe('"Line1\nLine2"');
    expect(escapeCsvCell('Simple')).toBe('"Simple"');
  });

  it('generates a full structured CSV file from an event plan', () => {
    const mockPlan: EventPlan = {
      id: 'plan-123',
      createdAt: '2026-10-29T10:00:00Z',
      updatedAt: '2026-10-29T10:00:00Z',
      intake: {
        eventType: 'birthday',
        eventTitle: 'Leo 8th Dino Birthday',
        eventDate: '2027-04-10',
        guestCount: 25,
        totalBudget: 1200,
        currency: 'USD',
        location: 'Austin, TX',
        themeVibe: 'Dino Safari',
        culturalTraditions: '',
        mustHaves: 'Fossil dig',
        dietaryRestrictions: 'Nut-free',
        accessibilityNeeds: 'Paved paths',
        venueSetting: 'outdoor',
      },
      executiveSummary: 'A thrilling 8th birthday party safari.',
      budget: {
        totalBudget: 1200,
        currency: 'USD',
        contingencyAmount: 100,
        items: [
          { id: '1', category: 'Venue', percentage: 30, allocatedAmount: 360, notes: 'Pavilion' },
          { id: '2', category: 'Activities', percentage: 40, allocatedAmount: 480, notes: 'Fossil kits' },
          { id: '3', category: 'Cake & Food', percentage: 30, allocatedAmount: 360, notes: 'Pizza & cupcakes' },
        ],
        summary: 'Compact birthday plan.',
      },
      timeline: {
        phases: ['6 Weeks Out', 'Event Day'],
        tasks: [
          {
            id: 't-1',
            phase: '6 Weeks Out',
            timeOffset: '6 weeks',
            title: 'Book Pavilion',
            description: 'Call city parks',
            owner: 'Host',
            priority: 'High',
            completed: false,
          },
        ],
      },
      vendors: {
        vendors: [
          {
            id: 'v-1',
            category: 'Bakery',
            vendorRole: 'Custom Cake Designer',
            estimatedCostRange: '$150 - $250',
            questionsToAsk: ['Do you have nut-free kitchen?'],
            comparisonCriteria: ['Portfolio reviews'],
            booked: false,
          },
        ],
      },
      ideas: {
        themeDetails: {
          concept: 'Dino Safari',
          colorPalette: ['Forest Green', 'Sand Khaki'],
          decorElements: ['Burlap runners', 'Dino footprints'],
        },
        activities: [
          { title: 'Fossil Dig', description: 'Sandboxes with buried fossils', targetAudience: 'Kids' },
        ],
        customMenu: {
          signatureCocktailMocktail: 'Volcano Punch',
          appetizers: ['Herbivore Veggie Cups'],
          mains: ['Carnivore Sliders'],
          dessert: 'Fossil Excavation Cupcakes',
          dietaryNotes: '100% Nut Free',
        },
        moneySavingHacks: [
          { tip: 'DIY Dig Boxes', estimatedSavings: '$80', implementation: 'Use storage bins' },
        ],
      },
    };

    const csv = generatePlanCsv(mockPlan);

    expect(csv).toContain('Leo 8th Dino Birthday');
    expect(csv).toContain('BUDGET BREAKDOWN');
    expect(csv).toContain('TIMELINE SCHEDULE');
    expect(csv).toContain('VENDOR CHECKLIST');
    expect(csv).toContain('MONEY-SAVING TIPS');
    expect(csv).toContain('Volcano Punch');
  });
});
