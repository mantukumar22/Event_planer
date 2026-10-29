import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercentage,
  isBudgetSumAccurate,
  normalizeBudgetItems,
  updateBudgetItemAmount,
  autoBalanceRemainingItems,
} from '@/lib/budget-math';
import { BudgetItem } from '@/lib/schemas';

describe('budget-math utilities', () => {
  const sampleItems: BudgetItem[] = [
    {
      id: 'venue',
      category: 'Venue & Rentals',
      percentage: 30,
      allocatedAmount: 3000,
      notes: 'Main hall',
    },
    {
      id: 'catering',
      category: 'Catering & Bar',
      percentage: 40,
      allocatedAmount: 4000,
      notes: 'Food and drink',
    },
    {
      id: 'photo',
      category: 'Photography',
      percentage: 20,
      allocatedAmount: 2000,
      notes: 'Full day coverage',
    },
    {
      id: 'decor',
      category: 'Decor & Floral',
      percentage: 10,
      allocatedAmount: 1000,
      notes: 'Centerpieces',
    },
  ];

  it('formats currency correctly with symbols and commas', () => {
    expect(formatCurrency(15000, 'USD')).toBe('$15,000');
    expect(formatCurrency(2500.5, 'EUR', true)).toBe('€2,500.50');
    expect(formatCurrency(100000, 'GBP')).toBe('£100,000');
  });

  it('formats percentages cleanly', () => {
    expect(formatPercentage(25.46)).toBe('25.5%');
    expect(formatPercentage(30)).toBe('30%');
  });

  it('correctly verifies if budget items sum to target', () => {
    expect(isBudgetSumAccurate(sampleItems, 10000)).toBe(true);
    expect(isBudgetSumAccurate(sampleItems, 10500)).toBe(false);
  });

  it('normalizes budget items and repairs cent rounding drift', () => {
    // 3 items summing to $10,000 with 1/3 splits (33.33% each -> $3333.33 * 3 = $9999.99, $0.01 drift)
    const driftItems: BudgetItem[] = [
      { id: '1', category: 'A', percentage: 33.33, allocatedAmount: 3333.33, notes: '' },
      { id: '2', category: 'B', percentage: 33.33, allocatedAmount: 3333.33, notes: '' },
      { id: '3', category: 'C', percentage: 33.33, allocatedAmount: 3333.33, notes: '' },
    ];

    const normalized = normalizeBudgetItems(driftItems, 10000);
    const sum = normalized.reduce((acc, curr) => acc + curr.allocatedAmount, 0);

    expect(sum).toBe(10000);
    expect(isBudgetSumAccurate(normalized, 10000)).toBe(true);
  });

  it('updates single budget item and reports difference accurately', () => {
    const res = updateBudgetItemAmount(sampleItems, 'venue', 3500, 10000);
    expect(res.totalAllocated).toBe(10500);
    expect(res.remainingDifference).toBe(-500);

    const updatedVenue = res.items.find((i) => i.id === 'venue');
    expect(updatedVenue?.allocatedAmount).toBe(3500);
    expect(updatedVenue?.percentage).toBe(35);
  });

  it('auto-balances remaining unlocked items', () => {
    const lockedIds = new Set(['venue']); // Lock venue at 3000
    const rebalanced = autoBalanceRemainingItems(sampleItems, lockedIds, 12000);

    const venue = rebalanced.find((i) => i.id === 'venue');
    expect(venue?.allocatedAmount).toBe(3000);

    const total = rebalanced.reduce((s, i) => s + i.allocatedAmount, 0);
    expect(total).toBe(12000);
  });
});
