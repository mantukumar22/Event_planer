/**
 * @file lib/schemas.ts
 * @description Single responsibility: Zod validation schemas and TypeScript types for event intake,
 * budget, timeline, vendors, personalized ideas, assumptions, and API requests.
 */

import { z } from 'zod';

export const EventTypeEnum = z.enum(['wedding', 'birthday', 'community']);
export type EventType = z.infer<typeof EventTypeEnum>;

export const CurrencyCodeEnum = z.enum([
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'INR',
]);
export type CurrencyCode = z.infer<typeof CurrencyCodeEnum>;

export const VenueSettingEnum = z.enum(['indoor', 'outdoor', 'hybrid']);
export type VenueSetting = z.infer<typeof VenueSettingEnum>;

export const PriorityEnum = z.enum(['High', 'Medium', 'Low']);
export type Priority = z.infer<typeof PriorityEnum>;

export const BirthdayAgeGroupEnum = z.enum(['kids', 'teens', 'adults', 'milestone']);
export type BirthdayAgeGroup = z.infer<typeof BirthdayAgeGroupEnum>;

/**
 * Intake Form Schema with event-specific intelligence fields
 */
export const IntakeFormSchema = z.object({
  eventType: EventTypeEnum,
  eventTitle: z
    .string()
    .trim()
    .min(2, 'Event title must be at least 2 characters')
    .max(80, 'Event title must be under 80 characters'),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date in YYYY-MM-DD format'),
  guestCount: z
    .number()
    .int('Must be a whole number')
    .min(5, 'Guest count must be at least 5')
    .max(10000, 'Guest count cannot exceed 10,000'),
  totalBudget: z
    .number()
    .min(100, 'Budget must be at least 100')
    .max(10000000, 'Budget cannot exceed 10,000,000'),
  currency: CurrencyCodeEnum.default('USD'),
  location: z
    .string()
    .trim()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be under 100 characters'),
  themeVibe: z
    .string()
    .trim()
    .min(2, 'Theme or vibe must be at least 2 characters')
    .max(120, 'Theme must be under 120 characters'),
  culturalTraditions: z
    .string()
    .trim()
    .max(300, 'Cultural preferences must be under 300 characters')
    .optional(),
  mustHaves: z
    .string()
    .trim()
    .max(300, 'Must-haves must be under 300 characters')
    .optional(),
  dietaryRestrictions: z
    .string()
    .trim()
    .max(200, 'Dietary restrictions must be under 200 characters')
    .optional(),
  accessibilityNeeds: z
    .string()
    .trim()
    .max(200, 'Accessibility needs must be under 200 characters')
    .optional(),
  venueSetting: VenueSettingEnum.default('indoor'),

  // Event-specific intelligence extensions (optional for full backwards compatibility)
  // Wedding specific
  isMultiDay: z.boolean().optional(),
  weddingCeremonies: z
    .string()
    .trim()
    .max(200, 'Ceremonies description must be under 200 characters')
    .optional(),

  // Birthday specific
  birthdayAgeGroup: BirthdayAgeGroupEnum.optional(),
  celebrantAge: z
    .number()
    .int()
    .min(1)
    .max(120)
    .optional(),

  // Community event specific
  communityFocus: z
    .array(z.enum(['permits', 'volunteers', 'sponsors', 'insurance', 'accessibility']))
    .optional(),

  // Bot mitigation: honeypot (should remain empty)
  honeypot: z.string().optional(),
});

export type IntakeFormData = z.infer<typeof IntakeFormSchema>;

/**
 * Budget Category Line Item Schema
 */
export const BudgetItemSchema = z.object({
  id: z.string(),
  category: z.string().min(1),
  percentage: z.number().min(0).max(100),
  allocatedAmount: z.number().min(0),
  notes: z.string(),
  color: z.string().optional(),
  isPerGuest: z.boolean().optional(),
});
export type BudgetItem = z.infer<typeof BudgetItemSchema>;

export const BudgetPlanSchema = z.object({
  totalBudget: z.number().min(1),
  currency: CurrencyCodeEnum,
  contingencyAmount: z.number().min(0),
  items: z.array(BudgetItemSchema).min(3),
  summary: z.string(),
});
export type BudgetPlan = z.infer<typeof BudgetPlanSchema>;

/**
 * Timeline Task Schema
 */
export const TimelineTaskSchema = z.object({
  id: z.string(),
  phase: z.string().min(1),
  timeOffset: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  owner: z.string().default('Host'),
  priority: PriorityEnum.default('Medium'),
  completed: z.boolean().default(false),
});
export type TimelineTask = z.infer<typeof TimelineTaskSchema>;

/**
 * Run-of-Show Day-Of Schedule Item
 */
export const DayOfScheduleItemSchema = z.object({
  time: z.string(),
  activity: z.string(),
  leadRole: z.string().optional(),
  owner: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});
export type DayOfScheduleItem = z.infer<typeof DayOfScheduleItemSchema>;

export const TimelinePlanSchema = z.object({
  phases: z.array(z.string()).min(2),
  tasks: z.array(TimelineTaskSchema).min(5),
  dayOfSchedule: z.array(DayOfScheduleItemSchema).optional(),
});
export type TimelinePlan = z.infer<typeof TimelinePlanSchema>;

/**
 * Vendor Checklist Item Schema
 */
export const VendorItemSchema = z.object({
  id: z.string(),
  category: z.string().min(1),
  vendorRole: z.string().min(1),
  estimatedCostRange: z.string().min(1),
  questionsToAsk: z.array(z.string()).min(2),
  comparisonCriteria: z.array(z.string()).min(2),
  booked: z.boolean().default(false),
  selectedVendorName: z.string().optional(),
  notes: z.string().optional(),
});
export type VendorItem = z.infer<typeof VendorItemSchema>;

export const VendorPlanSchema = z.object({
  vendors: z.array(VendorItemSchema).min(3),
  tips: z.array(z.string()).optional(),
});
export type VendorPlan = z.infer<typeof VendorPlanSchema>;

/**
 * Personalized Ideas Schema
 */
export const IdeasPlanSchema = z.object({
  themeDetails: z.object({
    concept: z.string(),
    colorPalette: z.array(z.string()),
    decorElements: z.array(z.string()),
  }),
  activities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      targetAudience: z.string(),
    })
  ),
  customMenu: z.object({
    signatureCocktailMocktail: z.string(),
    appetizers: z.array(z.string()),
    mains: z.array(z.string()),
    dessert: z.string(),
    dietaryNotes: z.string(),
  }),
  moneySavingHacks: z.array(
    z.object({
      tip: z.string(),
      estimatedSavings: z.string(),
      implementation: z.string(),
    })
  ),
});
export type IdeasPlan = z.infer<typeof IdeasPlanSchema>;

/**
 * Complete Event Plan Schema
 */
export const EventPlanSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  intake: IntakeFormSchema,
  executiveSummary: z.string(),
  budget: BudgetPlanSchema,
  timeline: TimelinePlanSchema,
  vendors: VendorPlanSchema,
  ideas: IdeasPlanSchema,
  assumptions: z.array(z.string()).optional(),
  isTemplateFallback: z.boolean().optional(),
});
export type EventPlan = z.infer<typeof EventPlanSchema>;

/**
 * Regenerate Section Request Schema
 */
export const RegenerateSectionSchema = z.object({
  section: z.enum(['budget', 'timeline', 'vendors', 'ideas']),
  instruction: z.string().trim().min(3).max(300),
  currentPlan: EventPlanSchema,
});
export type RegenerateSectionRequest = z.infer<typeof RegenerateSectionSchema>;

/**
 * Budget Trim Request Schema
 */
export const TrimBudgetSchema = z.object({
  currentPlan: EventPlanSchema,
  targetBudget: z.number().min(100),
  priorities: z.array(z.string()).optional().default([]),
});
export type TrimBudgetRequest = z.infer<typeof TrimBudgetSchema>;

/**
 * Chat Request Schema
 */
export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  planContext: z.object({
    eventType: EventTypeEnum,
    eventTitle: z.string(),
    totalBudget: z.number(),
    currency: CurrencyCodeEnum,
    guestCount: z.number(),
    location: z.string(),
    themeVibe: z.string(),
    completedTasksCount: z.number().int(),
    totalTasksCount: z.number().int(),
  }),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(1000),
      })
    )
    .max(10)
    .default([]),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

/**
 * Generic API Response wrapper
 */
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown };
