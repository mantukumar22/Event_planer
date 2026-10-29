import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/plan/generate/route';
import { NextRequest } from 'next/server';
import { globalRateLimiter } from '@/lib/rate-limiter';
import { ai } from '@/lib/gemini';

vi.mock('@/lib/gemini', () => ({
  ai: {
    models: {
      generateContent: vi.fn(),
    },
  },
}));

describe('/api/plan/generate Route Handler', () => {
  beforeEach(() => {
    globalRateLimiter.reset();
    vi.clearAllMocks();
  });

  const validPayload = {
    eventType: 'birthday',
    eventTitle: 'Maya 30th Birthday',
    eventDate: '2027-05-20',
    guestCount: 50,
    totalBudget: 5000,
    currency: 'USD',
    location: 'Denver, CO',
    themeVibe: 'Mountain Chic',
    culturalTraditions: '',
    mustHaves: 'Craft beer tasting',
    dietaryRestrictions: 'Vegetarian',
    accessibilityNeeds: 'Ramp',
    venueSetting: 'indoor',
  };

  it('returns 200 with complete structured plan on valid input', async () => {
    const mockModelResponse = {
      text: JSON.stringify({
        executiveSummary: 'An unforgettable alpine 30th birthday.',
        budget: {
          summary: 'Efficient allocation.',
          contingencyAmount: 300,
          items: [
            { id: '1', category: 'Venue', percentage: 40, allocatedAmount: 2000, notes: 'Lodge' },
            { id: '2', category: 'Catering', percentage: 40, allocatedAmount: 2000, notes: 'Food truck' },
            { id: '3', category: 'Music', percentage: 20, allocatedAmount: 1000, notes: 'Acoustic duo' },
          ],
        },
        timeline: {
          phases: ['Phase 1', 'Phase 2'],
          tasks: [
            {
              id: 'task-1',
              phase: 'Phase 1',
              timeOffset: '6 weeks',
              title: 'Book lodge',
              description: 'Sign contract',
              owner: 'Host',
              priority: 'High',
            },
          ],
        },
        vendors: {
          vendors: [
            {
              id: 'vendor-1',
              category: 'Venue',
              vendorRole: 'Lodge Manager',
              estimatedCostRange: '$1,800 - $2,200',
              questionsToAsk: ['Are outside food trucks permitted?'],
              comparisonCriteria: ['Included furniture'],
            },
          ],
        },
        ideas: {
          themeDetails: {
            concept: 'Mountain Chic',
            colorPalette: ['Pine Green', 'Copper'],
            decorElements: ['Pinecone centerpieces'],
          },
          activities: [{ title: 'Trivia', description: 'Fun trivia', targetAudience: 'Guests' }],
          customMenu: {
            signatureCocktailMocktail: 'Spiced Mule',
            appetizers: ['Colorado pretzel bites'],
            mains: ['Artisan pizza'],
            dessert: 'Smores bar',
            dietaryNotes: 'Vegetarian pizza available',
          },
          moneySavingHacks: [{ tip: 'Digital invites', estimatedSavings: '$150', implementation: 'Paperless' }],
        },
      }),
    };

    (ai.models.generateContent as any).mockResolvedValue(mockModelResponse);

    const req = new NextRequest('http://localhost:3000/api/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.data.intake.eventTitle).toBe('Maya 30th Birthday');
    expect(json.data.budget.totalBudget).toBe(5000);
  });

  it('returns 400 when input fails Zod schema validation', async () => {
    const invalidPayload = {
      ...validPayload,
      eventTitle: 'A', // too short
    };

    const req = new NextRequest('http://localhost:3000/api/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toContain('Validation failed');
  });

  it('returns 429 when rate limit is exceeded', async () => {
    // Fill up the rate limiter
    for (let i = 0; i < 25; i++) {
      globalRateLimiter.check('127.0.0.1');
    }

    const req = new NextRequest('http://localhost:3000/api/plan/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });
});
