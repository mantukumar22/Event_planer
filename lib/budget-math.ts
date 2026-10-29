import { BudgetItem, CurrencyCode } from './schemas';
import { CURRENCY_SYMBOLS } from './constants';

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
    // Find index of item with largest allocated amount
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
 * Returns the modified items list with updated item and overall stats.
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
 * Automatically rebalances remaining items after user edits one or more items.
 */
export function autoBalanceRemainingItems(
  items: BudgetItem[],
  lockedItemIds: Set<string>,
  totalBudget: number
): BudgetItem[] {
  const lockedSum = items
    .filter((i) => lockedItemIds.has(i.id))
    .reduce((sum, i) => sum + i.allocatedAmount, 0);

  const remainingBudget = Math.max(0, totalBudget - lockedSum);
  const unlockedItems = items.filter((i) => !lockedItemIds.has(i.id));

  if (unlockedItems.length === 0) return items;

  const currentUnlockedSum = unlockedItems.reduce((sum, i) => sum + i.allocatedAmount, 0);

  const balancedUnlocked = normalizeBudgetItems(unlockedItems, remainingBudget);
  const balancedMap = new Map(balancedUnlocked.map((i) => [i.id, i]));

  return items.map((item) => {
    if (lockedItemIds.has(item.id)) {
      return {
        ...item,
        percentage: Number(((item.allocatedAmount / totalBudget) * 100).toFixed(1)),
      };
    }
    const updated = balancedMap.get(item.id);
    return updated
      ? {
          ...updated,
          percentage: Number(((updated.allocatedAmount / totalBudget) * 100).toFixed(1)),
        }
      : item;
  });
}
