import { describe, it, expect } from 'vitest';
import {
  IntakeFormSchema,
  EventPlanSchema,
  RegenerateSectionSchema,
  ChatRequestSchema,
} from '@/lib/schemas';

describe('Zod Schema Validations', () => {
  it('validates a correct intake form payload', () => {
    const validData = {
      eventType: 'wedding',
      eventTitle: 'Julian & Maya Garden Wedding',
      eventDate: '2027-06-19',
      guestCount: 150,
      totalBudget: 35000,
      currency: 'USD',
      location: 'Napa Valley, CA',
      themeVibe: 'Romantic Garden Elegance',
      culturalTraditions: 'Tea ceremony',
      mustHaves: 'Acoustic trio',
      dietaryRestrictions: 'Gluten free',
      accessibilityNeeds: 'Wheelchair access',
      venueSetting: 'outdoor',
    };

    const res = IntakeFormSchema.safeParse(validData);
    expect(res.success).toBe(true);
  });

  it('rejects invalid intake form with helpful errors', () => {
    const invalidData = {
      eventType: 'carnival', // Invalid enum
      eventTitle: 'A', // Too short
      eventDate: 'invalid-date',
      guestCount: 2, // Below min 5
      totalBudget: -50, // Below min 100
      location: '',
      themeVibe: '',
    };

    const res = IntakeFormSchema.safeParse(invalidData);
    expect(res.success).toBe(false);
    if (!res.success) {
      const fieldErrors = res.error.flatten().fieldErrors;
      expect(fieldErrors.eventType).toBeDefined();
      expect(fieldErrors.guestCount).toBeDefined();
      expect(fieldErrors.totalBudget).toBeDefined();
    }
  });

  it('validates a chat request schema', () => {
    const validChat = {
      message: 'Can you recommend ideas for table centerpieces?',
      planContext: {
        eventType: 'birthday',
        eventTitle: 'Sarah 30th Birthday',
        totalBudget: 5000,
        currency: 'USD',
        guestCount: 40,
        location: 'Seattle, WA',
        themeVibe: 'Speakeasy Retro',
        completedTasksCount: 2,
        totalTasksCount: 10,
      },
      history: [{ role: 'user', content: 'Hi' }],
    };

    const res = ChatRequestSchema.safeParse(validChat);
    expect(res.success).toBe(true);
  });
});
