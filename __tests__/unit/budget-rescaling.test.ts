import { describe, it, expect } from 'vitest';
import {
  rescaleBudgetByGuestCount,
  isVariablePerGuestCategory,
  getBudgetSeverity,
  BudgetItem,
} from '@/lib/budget-math';

describe('Budget Rescaling & Severity Engine', () => {
  const baseItems: BudgetItem[] = [
    {
      id: 'item-1',
      category: 'Venue Rental',
      percentage: 30,
      allocatedAmount: 6000,
      notes: 'Fixed venue fee',
      isPerGuest: false,
    },
    {
      id: 'item-2',
      category: 'Catering & Dining',
      percentage: 40,
      allocatedAmount: 8000,
      notes: 'Plated dinner per guest',
      isPerGuest: true,
    },
    {
      id: 'item-3',
      category: 'Open Bar & Beverages',
      percentage: 20,
      allocatedAmount: 4000,
      notes: 'Beer, wine, cocktails',
      isPerGuest: true,
    },
    {
      id: 'item-4',
      category: 'Contingency Fund',
      percentage: 10,
      allocatedAmount: 2000,
      notes: 'Reserve buffer',
      isPerGuest: false,
    },
  ];

  describe('isVariablePerGuestCategory', () => {
    it('detects catering, bar, and favors as per-guest categories', () => {
      expect(isVariablePerGuestCategory('Catering & Food Service')).toBe(true);
      expect(isVariablePerGuestCategory('Signature Bar & Cocktails')).toBe(true);
      expect(isVariablePerGuestCategory('Party Favors & Gifts')).toBe(true);
      expect(isVariablePerGuestCategory('Evening Refreshments')).toBe(true);
    });

    it('identifies fixed costs like Venue, Photography, DJ as non-variable', () => {
      expect(isVariablePerGuestCategory('Venue Rental')).toBe(false);
      expect(isVariablePerGuestCategory('Photography & Video')).toBe(false);
      expect(isVariablePerGuestCategory('DJ & Sound Production')).toBe(false);
    });
  });

  describe('rescaleBudgetByGuestCount', () => {
    it('rescales per-guest categories proportionally while keeping fixed costs constant', () => {
      const originalGuests = 100;
      const simulatedGuests = 150; // 1.5x guests
      const totalBudget = 20000;

      const result = rescaleBudgetByGuestCount(
        baseItems,
        originalGuests,
        simulatedGuests,
        totalBudget
      );

      // Venue remains 6000
      const venue = result.items.find((i) => i.id === 'item-1');
      expect(venue?.allocatedAmount).toBe(6000);

      // Catering scales from 8000 to 12000 (1.5x)
      const catering = result.items.find((i) => i.id === 'item-2');
      expect(catering?.allocatedAmount).toBe(12000);

      // Bar scales from 4000 to 6000 (1.5x)
      const bar = result.items.find((i) => i.id === 'item-3');
      expect(bar?.allocatedAmount).toBe(6000);

      // Total allocated: 6000 + 12000 + 6000 + 2000 = 26000
      expect(result.totalAllocated).toBe(26000);
      expect(result.differenceFromBudget).toBe(-6000); // 6000 over budget
      expect(result.perGuestCost).toBe(Math.round(26000 / 150));
    });

    it('rescales down when guests decrease', () => {
      const result = rescaleBudgetByGuestCount(baseItems, 100, 50, 20000);
      const catering = result.items.find((i) => i.id === 'item-2');
      expect(catering?.allocatedAmount).toBe(4000); // 0.5x of 8000
    });
  });

  describe('getBudgetSeverity', () => {
    it('returns "balanced" when allocation matches total budget within 1 unit', () => {
      const res = getBudgetSeverity(20000, 20000);
      expect(res.severity).toBe('balanced');
      expect(res.difference).toBe(0);
    });

    it('returns "under" when there is a surplus', () => {
      const res = getBudgetSeverity(18000, 20000);
      expect(res.severity).toBe('under');
      expect(res.difference).toBe(2000);
    });

    it('returns "caution" when slightly over budget within 8% contingency margin', () => {
      // 21000 on 20000 is 5% over
      const res = getBudgetSeverity(21000, 20000);
      expect(res.severity).toBe('caution');
    });

    it('returns "critical" when significantly over budget', () => {
      // 26000 on 20000 is 30% over
      const res = getBudgetSeverity(26000, 20000);
      expect(res.severity).toBe('critical');
    });
  });
});
