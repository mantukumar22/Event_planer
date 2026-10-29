import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'jest-axe';
import { IntakeForm } from '@/components/IntakeForm';
import { Hero } from '@/components/Hero';
import { PlanView } from '@/components/PlanView';
import { EventPlan } from '@/lib/schemas';

describe('WCAG 2.2 AA Accessibility Audits (jest-axe)', () => {
  const mockPlan: EventPlan = {
    id: 'a11y-plan',
    createdAt: '2026-10-29T10:00:00Z',
    updatedAt: '2026-10-29T10:00:00Z',
    intake: {
      eventType: 'wedding',
      eventTitle: 'Julian & Maya Wedding',
      eventDate: '2027-06-19',
      guestCount: 150,
      totalBudget: 35000,
      currency: 'USD',
      location: 'Napa Valley, CA',
      themeVibe: 'Romantic Garden Elegance',
      culturalTraditions: '',
      mustHaves: '',
      dietaryRestrictions: '',
      accessibilityNeeds: '',
      venueSetting: 'outdoor',
    },
    executiveSummary: 'Accessible event overview.',
    budget: {
      totalBudget: 35000,
      currency: 'USD',
      contingencyAmount: 1750,
      items: [
        { id: '1', category: 'Venue', percentage: 40, allocatedAmount: 14000, notes: 'Estate' },
        { id: '2', category: 'Catering', percentage: 40, allocatedAmount: 14000, notes: 'Plated' },
        { id: '3', category: 'Music', percentage: 20, allocatedAmount: 7000, notes: 'Quartet' },
      ],
      summary: 'Well budgeted',
    },
    timeline: {
      phases: ['Phase 1', 'Phase 2'],
      tasks: [
        {
          id: 't-1',
          phase: 'Phase 1',
          timeOffset: '12 weeks',
          title: 'Book Photographer',
          description: 'Review contract',
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
          category: 'Photography',
          vendorRole: 'Lead Photographer',
          estimatedCostRange: '$4,000 - $6,000',
          questionsToAsk: ['Delivery time?'],
          comparisonCriteria: ['Print rights'],
          booked: false,
        },
      ],
    },
    ideas: {
      themeDetails: {
        concept: 'Garden',
        colorPalette: ['Sage', 'Cream'],
        decorElements: ['Floral arch'],
      },
      activities: [{ title: 'First Dance', description: 'Under fairy lights', targetAudience: 'All' }],
      customMenu: {
        signatureCocktailMocktail: 'Lavender Spritz',
        appetizers: ['Bruschetta'],
        mains: ['Filet mignon'],
        dessert: 'Layered cake',
        dietaryNotes: 'Vegetarian available',
      },
      moneySavingHacks: [{ tip: 'Sunday booking', estimatedSavings: '$2,000', implementation: 'Choose Sunday' }],
    },
  };

  it('IntakeForm should have no axe accessibility violations', async () => {
    const { container } = render(<IntakeForm onSubmit={vi.fn()} isLoading={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Hero should have no axe accessibility violations', async () => {
    const { container } = render(
      <Hero onSelectPreset={vi.fn()} onScrollToForm={vi.fn()} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PlanView should have no axe accessibility violations', async () => {
    const { container } = render(
      <PlanView
        plan={mockPlan}
        onUpdateBudget={vi.fn()}
        onUpdateTimeline={vi.fn()}
        onUpdateVendors={vi.fn()}
        onOpenRegenerate={vi.fn()}
        onOpenExport={vi.fn()}
        onPrint={vi.fn()}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
