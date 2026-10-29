import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadPlanFromStorage,
  savePlanToStorage,
  clearPlanFromStorage,
} from '@/lib/storage';
import { EventPlan } from '@/lib/schemas';

describe('LocalStorage Plan Persistence', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const validPlan: EventPlan = {
    id: 'test-plan-1',
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    intake: {
      eventType: 'wedding',
      eventTitle: 'Emma & Noah Wedding',
      eventDate: '2027-09-18',
      guestCount: 120,
      totalBudget: 28000,
      currency: 'USD',
      location: 'Portland, OR',
      themeVibe: 'Pacific Northwest Botanical',
      culturalTraditions: '',
      mustHaves: 'Locally roasted coffee bar',
      dietaryRestrictions: 'Vegan options',
      accessibilityNeeds: 'Level entryways',
      venueSetting: 'indoor',
    },
    executiveSummary: 'An intimate evergreen wedding celebration.',
    budget: {
      totalBudget: 28000,
      currency: 'USD',
      contingencyAmount: 1500,
      items: [
        { id: '1', category: 'Venue', percentage: 35, allocatedAmount: 9800, notes: 'Lodge' },
        { id: '2', category: 'Catering', percentage: 40, allocatedAmount: 11200, notes: 'Buffet' },
        { id: '3', category: 'Photography', percentage: 25, allocatedAmount: 7000, notes: '2 shooters' },
      ],
      summary: 'Focused budget.',
    },
    timeline: {
      phases: ['Phase 1', 'Phase 2'],
      tasks: [
        { id: 't-1', phase: 'Phase 1', timeOffset: '9 months', title: 'Secure lodge', description: 'Sign contract', owner: 'Host', priority: 'High', completed: false },
        { id: 't-2', phase: 'Phase 1', timeOffset: '6 months', title: 'Hire Caterer', description: 'Tasting session', owner: 'Host', priority: 'High', completed: false },
        { id: 't-3', phase: 'Phase 2', timeOffset: '3 months', title: 'Send Invites', description: 'Digital & paper', owner: 'Host', priority: 'Medium', completed: false },
        { id: 't-4', phase: 'Phase 2', timeOffset: '1 month', title: 'Final RSVP Count', description: 'Notify caterer', owner: 'Host', priority: 'High', completed: false },
        { id: 't-5', phase: 'Phase 2', timeOffset: '1 week', title: 'Rehearsal Run', description: 'Run walkthrough', owner: 'Coordinator', priority: 'Medium', completed: false },
      ],
    },
    vendors: {
      vendors: [
        { id: 'v-1', category: 'Catering', vendorRole: 'Farm Caterer', estimatedCostRange: '$9,000 - $12,000', questionsToAsk: ['Tastings included?', 'Staff count?'], comparisonCriteria: ['Local sourced %', 'Cleanup fee'], booked: false },
        { id: 'v-2', category: 'Venue', vendorRole: 'Lodge Coordinator', estimatedCostRange: '$8,000 - $10,000', questionsToAsk: ['Curfew policy?', 'Tables included?'], comparisonCriteria: ['Insurance requirement', 'Setup hours'], booked: false },
        { id: 'v-3', category: 'Photography', vendorRole: 'Documentary Photographer', estimatedCostRange: '$5,000 - $7,000', questionsToAsk: ['Second shooter?', 'Turnaround time?'], comparisonCriteria: ['Full gallery rights', 'Overtime rate'], booked: false },
      ],
    },
    ideas: {
      themeDetails: {
        concept: 'Botanical',
        colorPalette: ['Forest Green', 'Slate'],
        decorElements: ['Ferns', 'Cedar branches'],
      },
      activities: [{ title: 'Toast', description: 'Champagne toast', targetAudience: 'All' }],
      customMenu: {
        signatureCocktailMocktail: 'Cedar Spritz',
        appetizers: ['Wild mushroom crostini'],
        mains: ['Cedar plank salmon'],
        dessert: 'Marionberry tart',
        dietaryNotes: 'Vegan mushroom risotto',
      },
      moneySavingHacks: [{ tip: 'In-season greenery', estimatedSavings: '$600', implementation: 'Forage licensed cedar' }],
    },
  };

  it('saves and loads a valid plan from storage', () => {
    const saved = savePlanToStorage(validPlan);
    expect(saved).toBe(true);

    const loaded = loadPlanFromStorage();
    expect(loaded).not.toBeNull();
    expect(loaded?.id).toBe(validPlan.id);
    expect(loaded?.intake.eventTitle).toBe('Emma & Noah Wedding');
  });

  it('returns null gracefully when localStorage has invalid schema', () => {
    window.localStorage.setItem('eventcraft_current_plan', JSON.stringify({ corrupted: true }));
    const loaded = loadPlanFromStorage();
    expect(loaded).toBeNull();
  });

  it('clears storage properly', () => {
    savePlanToStorage(validPlan);
    expect(loadPlanFromStorage()).not.toBeNull();

    clearPlanFromStorage();
    expect(loadPlanFromStorage()).toBeNull();
  });
});
