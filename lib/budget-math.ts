/**
 * @file lib/budget-math.ts
 * @description Single responsibility: Mathematical calculations, cent-drift auto-correction,
 * what-if guest-count rescaling, and budget over/under severity detection.
 */

import { BudgetItem, CurrencyCode } from './schemas';
import { CURRENCY_SYMBOLS } from './constants';

export type { BudgetItem };

/**
 * Auto-balances remaining unlocked items against locked items to reach targetTotal.
 */
export function autoBalanceRemainingItems(
  items: BudgetItem[],
  lockedIds: Set<string>,
  targetTotal: number
): BudgetItem[] {
  const lockedItems = items.filter((i) => lockedIds.has(i.id));
  const unlockedItems = items.filter((i) => !lockedIds.has(i.id));

  const lockedSum = lockedItems.reduce((acc, i) => acc + i.allocatedAmount, 0);
  const remainingForUnlocked = Math.max(0, targetTotal - lockedSum);

  const balancedUnlocked = normalizeBudgetItems(unlockedItems, remainingForUnlocked);

  return items.map((i) => {
    if (lockedIds.has(i.id)) {
      const pct = targetTotal > 0 ? Number(((i.allocatedAmount / targetTotal) * 100).toFixed(1)) : 0;
      return { ...i, percentage: pct };
    }
    const found = balancedUnlocked.find((u) => u.id === i.id);
    if (found) {
      const pct = targetTotal > 0 ? Number(((found.allocatedAmount / targetTotal) * 100).toFixed(1)) : 0;
      return { ...found, percentage: pct };
    }
    return i;
  });
}

/**
 * Formats a numeric value with currency symbol and standard locale formatting.
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  showCents: boolean = false
): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);

  return `${symbol}${formatted}`;
}

/**
 * Formats percentage with 1 decimal place if needed.
 */
export function formatPercentage(pct: number): string {
  return `${Number(pct.toFixed(1))}%`;
}

/**
 * Validates whether the budget items sum to total budget within acceptable tolerance (0.01).
 */
export function isBudgetSumAccurate(
  items: BudgetItem[],
  totalBudget: number,
  tolerance: number = 0.01
): boolean {
  if (items.length === 0) return totalBudget === 0;
  const currentSum = items.reduce((acc, item) => acc + item.allocatedAmount, 0);
  return Math.abs(currentSum - totalBudget) <= tolerance;
}

/**
 * Normalizes and guarantees that budget items sum to exact total budget.
 * Corrects any rounding drift by attributing cent differences to the largest category item.
 */
export function normalizeBudgetItems(
  items: BudgetItem[],
  totalBudget: number
): BudgetItem[] {
  if (items.length === 0 || totalBudget <= 0) return items;

  // 1. Calculate base amounts based on percentage or existing amounts
  const currentAmountSum = items.reduce((sum, item) => sum + item.allocatedAmount, 0);
  const currentPctSum = items.reduce((sum, item) => sum + item.percentage, 0);

  let normalized: BudgetItem[] = [];

  if (currentAmountSum > 0 && Math.abs(currentAmountSum - totalBudget) > 0.001) {
    // Scale existing amounts proportionally to target totalBudget
    normalized = items.map((item) => {
      const rawRatio = item.allocatedAmount / currentAmountSum;
      const roundedAmount = Math.round(rawRatio * totalBudget * 100) / 100;
      return {
        ...item,
        allocatedAmount: roundedAmount,
        percentage: Number(((roundedAmount / totalBudget) * 100).toFixed(1)),
      };
    });
  } else if (currentPctSum > 0) {
    // Calculate from percentages
    normalized = items.map((item) => {
      const normalizedPct = item.percentage / currentPctSum;
      const roundedAmount = Math.round(normalizedPct * totalBudget * 100) / 100;
      return {
        ...item,
        allocatedAmount: roundedAmount,
        percentage: Number((normalizedPct * 100).toFixed(1)),
      };
    });
  } else {
    // Equal distribution if zero
    const perItem = Math.round((totalBudget / items.length) * 100) / 100;
    const perPct = Number((100 / items.length).toFixed(1));
    normalized = items.map((item) => ({
      ...item,
      allocatedAmount: perItem,
      percentage: perPct,
    }));
  }

  // 2. Fix cent drift by adjusting the largest line item
  const newSum = normalized.reduce((sum, item) => sum + item.allocatedAmount, 0);
  const drift = Math.round((totalBudget - newSum) * 100) / 100;

  if (Math.abs(drift) > 0.001 && normalized.length > 0) {
    let maxIdx = 0;
    let maxVal = -1;
    for (let i = 0; i < normalized.length; i++) {
      if (normalized[i].allocatedAmount > maxVal) {
        maxVal = normalized[i].allocatedAmount;
        maxIdx = i;
      }
    }

    const correctedAmount = Math.round((normalized[maxIdx].allocatedAmount + drift) * 100) / 100;
    normalized[maxIdx] = {
      ...normalized[maxIdx],
      allocatedAmount: Math.max(0, correctedAmount),
      percentage: Number(((Math.max(0, correctedAmount) / totalBudget) * 100).toFixed(1)),
    };
  }

  return normalized;
}

/**
 * Updates a single budget item's amount, and recalculates its percentage.
 */
export function updateBudgetItemAmount(
  items: BudgetItem[],
  targetId: string,
  newAmount: number,
  totalBudget: number
): {
  items: BudgetItem[];
  totalAllocated: number;
  remainingDifference: number;
} {
  const clampedAmount = Math.max(0, Math.round(newAmount * 100) / 100);

  const updated = items.map((item) => {
    if (item.id === targetId) {
      const pct = totalBudget > 0 ? Number(((clampedAmount / totalBudget) * 100).toFixed(1)) : 0;
      return {
        ...item,
        allocatedAmount: clampedAmount,
        percentage: pct,
      };
    }
    return item;
  });

  const totalAllocated = Math.round(updated.reduce((sum, i) => sum + i.allocatedAmount, 0) * 100) / 100;
  const remainingDifference = Math.round((totalBudget - totalAllocated) * 100) / 100;

  return {
    items: updated,
    totalAllocated,
    remainingDifference,
  };
}

/**
 * Checks if a category is variable per guest (e.g. Catering, Bar, Favors, Place Settings).
 */
export function isVariablePerGuestCategory(category: string): boolean {
  const lower = category.toLowerCase();
  return (
    lower.includes('cater') ||
    lower.includes('food') ||
    lower.includes('bar') ||
    lower.includes('drink') ||
    lower.includes('favor') ||
    lower.includes('menu') ||
    lower.includes('refreshment') ||
    lower.includes('tableware')
  );
}

/**
 * What-If Tool: Rescales per-guest categories live based on a simulated guest count slider.
 */
export function rescaleBudgetByGuestCount(
  items: BudgetItem[],
  originalGuestCount: number,
  simulatedGuestCount: number,
  totalBudget: number
): {
  items: BudgetItem[];
  totalAllocated: number;
  differenceFromBudget: number;
  perGuestCost: number;
} {
  const safeOriginal = Math.max(1, originalGuestCount);
  const safeSimulated = Math.max(1, simulatedGuestCount);
  const guestRatio = safeSimulated / safeOriginal;

  const rescaled = items.map((item) => {
    const isPerGuest = item.isPerGuest ?? isVariablePerGuestCategory(item.category);
    if (isPerGuest) {
      const newAmount = Math.round(item.allocatedAmount * guestRatio);
      return {
        ...item,
        isPerGuest: true,
        allocatedAmount: newAmount,
        percentage: totalBudget > 0 ? Number(((newAmount / totalBudget) * 100).toFixed(1)) : 0,
      };
    }
    return item;
  });

  const totalAllocated = rescaled.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const differenceFromBudget = Math.round((totalBudget - totalAllocated) * 100) / 100;
  const perGuestCost = Math.round(totalAllocated / safeSimulated);

  return {
    items: rescaled,
    totalAllocated,
    differenceFromBudget,
    perGuestCost,
  };
}

export type BudgetSeverity = 'balanced' | 'under' | 'caution' | 'critical';

/**
 * Over/Under Budget Severity detector with human-friendly guidance.
 */
export function getBudgetSeverity(
  totalAllocated: number,
  totalBudget: number
): {
  severity: BudgetSeverity;
  difference: number;
  message: string;
} {
  const diff = Math.round((totalBudget - totalAllocated) * 100) / 100;

  if (Math.abs(diff) <= 1) {
    return {
      severity: 'balanced',
      difference: 0,
      message: '100% Mathematically Balanced',
    };
  }

  if (diff > 0) {
    return {
      severity: 'under',
      difference: diff,
      message: `Surplus of ${formatCurrency(diff)} unallocated`,
    };
  }

  // Over budget
  const overAmount = Math.abs(diff);
  const overRatio = totalBudget > 0 ? overAmount / totalBudget : 1;

  if (overRatio <= 0.08) {
    return {
      severity: 'caution',
      difference: diff,
      message: `Slightly Over Budget by ${formatCurrency(overAmount)} (within contingency margin)`,
    };
  }

  return {
    severity: 'critical',
    difference: diff,
    message: `Significantly Over Budget by ${formatCurrency(overAmount)} — consider trimming`,
  };
}
