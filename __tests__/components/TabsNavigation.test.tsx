import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PlanView } from '@/components/PlanView';
import { EventPlan } from '@/lib/schemas';

describe('Tabs Navigation & Keyboard Accessibility', () => {
  const mockPlan: EventPlan = {
    id: 'plan-test',
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
      themeVibe: 'Romantic Garden',
      culturalTraditions: '',
      mustHaves: '',
      dietaryRestrictions: '',
      accessibilityNeeds: '',
      venueSetting: 'outdoor',
    },
    executiveSummary: 'Full wedding plan overview.',
    budget: {
      totalBudget: 35000,
      currency: 'USD',
      contingencyAmount: 1750,
      items: [
        { id: '1', category: 'Venue', percentage: 40, allocatedAmount: 14000, notes: 'Estate' },
        { id: '2', category: 'Catering', percentage: 40, allocatedAmount: 14000, notes: 'Plated dinner' },
        { id: '3', category: 'Music', percentage: 20, allocatedAmount: 7000, notes: 'Quartet' },
      ],
      summary: 'Comprehensive plan',
    },
    timeline: {
      phases: ['Phase 1', 'Phase 2'],
      tasks: [
        {
          id: 't-1',
          phase: 'Phase 1',
          timeOffset: '12 weeks',
          title: 'Book Photographer',
          description: 'Review contracts',
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

  it('renders tablist and switches tabs on click', () => {
    render(
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

    const budgetTab = screen.getByRole('tab', { name: /budget allocation/i });
    const timelineTab = screen.getByRole('tab', { name: /timeline & milestones/i });

    expect(budgetTab).toHaveAttribute('aria-selected', 'true');
    expect(timelineTab).toHaveAttribute('aria-selected', 'false');

    // Click timeline tab
    fireEvent.click(timelineTab);
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');
    expect(budgetTab).toHaveAttribute('aria-selected', 'false');
  });

  it('supports arrow-key keyboard navigation across tabs (WAI-ARIA tabs pattern)', () => {
    render(
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

    const budgetTab = screen.getByRole('tab', { name: /budget allocation/i });
    const timelineTab = screen.getByRole('tab', { name: /timeline & milestones/i });

    budgetTab.focus();

    // Press ArrowRight to move to next tab
    fireEvent.keyDown(budgetTab, { key: 'ArrowRight' });
    expect(timelineTab).toHaveAttribute('aria-selected', 'true');

    // Press ArrowLeft to return to previous tab
    fireEvent.keyDown(timelineTab, { key: 'ArrowLeft' });
    expect(budgetTab).toHaveAttribute('aria-selected', 'true');

    // Press End to navigate to last tab
    fireEvent.keyDown(budgetTab, { key: 'End' });
    const ideasTab = screen.getByRole('tab', { name: /personalized ideas/i });
    expect(ideasTab).toHaveAttribute('aria-selected', 'true');
  });
});
