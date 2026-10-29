import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BudgetTab } from '@/components/tabs/BudgetTab';
import { BudgetPlan } from '@/lib/schemas';

describe('BudgetTab Component', () => {
  const mockBudget: BudgetPlan = {
    totalBudget: 10000,
    currency: 'USD',
    contingencyAmount: 500,
    summary: 'Balanced celebration budget.',
    items: [
      { id: '1', category: 'Venue', percentage: 40, allocatedAmount: 4000, notes: 'Hall' },
      { id: '2', category: 'Catering', percentage: 40, allocatedAmount: 4000, notes: 'Buffet' },
      { id: '3', category: 'Music', percentage: 20, allocatedAmount: 2000, notes: 'DJ' },
    ],
  };

  it('renders SVG donut chart and accessible data table', () => {
    render(
      <BudgetTab
        budget={mockBudget}
        currency="USD"
        onUpdateBudget={vi.fn()}
        onOpenRegenerate={vi.fn()}
      />
    );

    expect(screen.getByRole('img', { name: /donut chart showing budget allocation/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /editable budget category allocation table/i })).toBeInTheDocument();
    expect(screen.getAllByText('Venue').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Catering').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Music').length).toBeGreaterThanOrEqual(1);
  });

  it('triggers onUpdateBudget when a line item amount is changed', () => {
    const handleUpdate = vi.fn();
    render(
      <BudgetTab
        budget={mockBudget}
        currency="USD"
        onUpdateBudget={handleUpdate}
        onOpenRegenerate={vi.fn()}
      />
    );

    const venueInput = screen.getByLabelText(/allocated amount for venue/i);
    fireEvent.change(venueInput, { target: { value: '4500' } });

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    const updated = handleUpdate.mock.calls[0][0];
    const venueItem = updated.items.find((i: any) => i.category === 'Venue');
    expect(venueItem.allocatedAmount).toBe(4500);
  });
});
