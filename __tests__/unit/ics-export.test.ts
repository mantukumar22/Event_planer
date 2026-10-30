import { describe, it, expect } from 'vitest';
import { generateIcsContent } from '@/lib/ics-export';
import { EventPlan } from '@/lib/schemas';

const mockPlan: EventPlan = {
  createdAt: '2026-10-30T10:00:00.000Z',
  intake: {
    eventType: 'wedding',
    eventTitle: 'Maya & Alex Royal Wedding',
    eventDate: '2027-06-15',
    guestCount: 150,
    totalBudget: 35000,
    currency: 'USD',
    location: 'Austin, TX',
    themeVibe: 'Moody Neon Chic',
    venueSetting: 'indoor',
  },
  executiveSummary: 'An unforgettable royal wedding.',
  budget: {
    totalBudget: 35000,
    currency: 'USD',
    contingencyAmount: 3500,
    items: [],
    summary: 'Detailed budget plan.',
  },
  timeline: {
    phases: ['Planning', 'Execution'],
    tasks: [
      {
        id: 'task-1',
        phase: 'Planning',
        timeOffset: '12 weeks before',
        title: 'Book Royal Venue',
        description: 'Secure contract and deposit for grand ballroom.',
        owner: 'Couple',
        priority: 'High',
        completed: false,
      },
      {
        id: 'task-2',
        phase: 'Execution',
        timeOffset: 'Day of Event',
        title: 'Grand Entrance',
        description: 'Sparkler entrance for guests.',
        owner: 'Coordinator',
        priority: 'High',
        completed: true,
      },
    ],
    dayOfSchedule: [
      {
        time: '04:00 PM',
        activity: 'Guest Arrival',
        leadRole: 'Host Team',
        location: 'Grand Foyer',
        notes: 'Cocktails and live strings.',
      },
    ],
  },
  vendors: { vendors: [], tips: [] },
  ideas: {
    themeDetails: {
      concept: 'Royal',
      colorPalette: ['#6D28D9'],
      decorElements: ['Gold Crowns'],
    },
    activities: [],
    customMenu: {
      signatureCocktailMocktail: 'Royal Purple Haze',
      appetizers: [],
      mains: [],
      dessert: 'Cake',
      dietaryNotes: 'None',
    },
    moneySavingHacks: [],
  },
};

describe('generateIcsContent RFC 5545 Pure Function', () => {
  it('generates a valid VCALENDAR with RFC 5545 structure', () => {
    const ics = generateIcsContent(mockPlan);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('PRODID:-//EventCraft AI//Event Schedule RFC 5545//EN');
    expect(ics).toContain('CALSCALE:GREGORIAN');
    expect(ics).toContain('METHOD:PUBLISH');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('generates the main event VEVENT block', () => {
    const ics = generateIcsContent(mockPlan);

    expect(ics).toContain('SUMMARY:Maya & Alex Royal Wedding');
    expect(ics).toContain('LOCATION:Austin\\, TX');
    expect(ics).toContain('DTSTART:20270615');
  });

  it('includes milestone tasks as VEVENT blocks', () => {
    const ics = generateIcsContent(mockPlan);

    expect(ics).toContain('SUMMARY:Milestone: Book Royal Venue');
    expect(ics).toContain('Owner: Couple');
  });

  it('includes day-of run-of-show agenda items as VEVENT blocks', () => {
    const ics = generateIcsContent(mockPlan);

    expect(ics).toContain('SUMMARY:[04:00 PM] Guest Arrival');
    expect(ics).toContain('LOCATION:Austin\\, TX');
  });

  it('escapes special characters correctly for iCalendar format', () => {
    const planWithCommas: EventPlan = {
      ...mockPlan,
      intake: {
        ...mockPlan.intake,
        eventTitle: 'Wedding, Gala; & Dinner',
        location: 'Paris, France',
      },
    };

    const ics = generateIcsContent(planWithCommas);
    expect(ics).toContain('Paris\\, France');
    expect(ics).toContain('Wedding\\, Gala\\; & Dinner');
  });
});
