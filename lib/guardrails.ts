/**
 * @file lib/guardrails.ts
 * @description Single responsibility: Input normalization, output guardrails, HTML tag stripping,
 * number clamping, and Intl currency formatting for AI safety.
 */

import { CurrencyCode, EventPlan } from './schemas';

/**
 * Strips HTML-like tags, script elements, iframe injections, and control characters.
 */
export function sanitizeString(input: string, maxLength?: number): string {
  if (typeof input !== 'string') return '';

  let sanitized = input
    // Remove null bytes and non-printable control characters (except newline \n and tab \t)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip HTML tags (<script>, <iframe>, <img onerror>, etc.)
    .replace(/<[^>]*>?/gm, '')
    // Replace raw angle brackets with safe text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();

  if (maxLength && maxLength > 0) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Clamps numeric values to a safe min/max boundary and prevents NaN / Infinity.
 */
export function clampNumber(value: number, min: number, max: number, fallback?: number): number {
  if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
    return fallback !== undefined ? fallback : min;
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats currency safely using Intl.NumberFormat with fallback.
 */
export function formatSafeCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  locale = 'en-US'
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(safeAmount);
  } catch {
    return `$${Math.round(safeAmount).toLocaleString()}`;
  }
}

/**
 * Recursively sanitizes all text fields within an EventPlan to prevent XSS.
 */
export function sanitizePlan(plan: EventPlan): EventPlan {
  return {
    ...plan,
    executiveSummary: sanitizeString(plan.executiveSummary),
    assumptions: (plan.assumptions || []).map(sanitizeString),
    budget: {
      ...plan.budget,
      summary: sanitizeString(plan.budget.summary),
      items: plan.budget.items.map((item) => ({
        ...item,
        category: sanitizeString(item.category),
        notes: sanitizeString(item.notes),
        allocatedAmount: Math.max(0, item.allocatedAmount),
        percentage: clampNumber(item.percentage, 0, 100),
      })),
    },
    timeline: {
      ...plan.timeline,
      phases: plan.timeline.phases.map(sanitizeString),
      tasks: plan.timeline.tasks.map((task) => ({
        ...task,
        title: sanitizeString(task.title),
        description: sanitizeString(task.description),
        owner: sanitizeString(task.owner),
        timeOffset: sanitizeString(task.timeOffset),
      })),
      dayOfSchedule: (plan.timeline.dayOfSchedule || []).map((item) => ({
        ...item,
        time: sanitizeString(item.time),
        activity: sanitizeString(item.activity),
        leadRole: item.leadRole ? sanitizeString(item.leadRole) : undefined,
        owner: item.owner ? sanitizeString(item.owner) : undefined,
        location: item.location ? sanitizeString(item.location) : undefined,
        notes: item.notes ? sanitizeString(item.notes) : '',
      })),
    },
    vendors: {
      vendors: plan.vendors.vendors.map((v) => ({
        ...v,
        category: sanitizeString(v.category),
        vendorRole: sanitizeString(v.vendorRole),
        estimatedCostRange: sanitizeString(v.estimatedCostRange),
        questionsToAsk: v.questionsToAsk.map(sanitizeString),
        comparisonCriteria: v.comparisonCriteria.map(sanitizeString),
      })),
    },
    ideas: {
      themeDetails: {
        concept: sanitizeString(plan.ideas.themeDetails.concept),
        colorPalette: plan.ideas.themeDetails.colorPalette.map(sanitizeString),
        decorElements: plan.ideas.themeDetails.decorElements.map(sanitizeString),
      },
      activities: plan.ideas.activities.map((a) => ({
        title: sanitizeString(a.title),
        description: sanitizeString(a.description),
        targetAudience: sanitizeString(a.targetAudience),
      })),
      customMenu: {
        signatureCocktailMocktail: sanitizeString(plan.ideas.customMenu.signatureCocktailMocktail),
        appetizers: plan.ideas.customMenu.appetizers.map(sanitizeString),
        mains: plan.ideas.customMenu.mains.map(sanitizeString),
        dessert: sanitizeString(plan.ideas.customMenu.dessert),
        dietaryNotes: sanitizeString(plan.ideas.customMenu.dietaryNotes),
      },
      moneySavingHacks: plan.ideas.moneySavingHacks.map((h) => ({
        tip: sanitizeString(h.tip),
        estimatedSavings: sanitizeString(h.estimatedSavings),
        implementation: sanitizeString(h.implementation),
      })),
    },
  };
}
