import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { ai } from '@/lib/gemini';
import {
  RegenerateSectionSchema,
  BudgetPlanSchema,
  TimelinePlanSchema,
  VendorPlanSchema,
  IdeasPlanSchema,
  ApiResponse,
} from '@/lib/schemas';
import { globalRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { normalizeBudgetItems } from '@/lib/budget-math';
import { CATEGORY_COLORS, COLOR_SWATCHES } from '@/lib/constants';

// Response schemas per section
const sectionSchemas: Record<string, any> = {
  budget: {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING },
      contingencyAmount: { type: Type.NUMBER },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            percentage: { type: Type.NUMBER },
            allocatedAmount: { type: Type.NUMBER },
            notes: { type: Type.STRING },
          },
          required: ['id', 'category', 'percentage', 'allocatedAmount', 'notes'],
        },
      },
    },
    required: ['summary', 'contingencyAmount', 'items'],
  },
  timeline: {
    type: Type.OBJECT,
    properties: {
      phases: { type: Type.ARRAY, items: { type: Type.STRING } },
      tasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            phase: { type: Type.STRING },
            timeOffset: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            owner: { type: Type.STRING },
            priority: { type: Type.STRING },
          },
          required: ['id', 'phase', 'timeOffset', 'title', 'description', 'owner', 'priority'],
        },
      },
    },
    required: ['phases', 'tasks'],
  },
  vendors: {
    type: Type.OBJECT,
    properties: {
      vendors: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            category: { type: Type.STRING },
            vendorRole: { type: Type.STRING },
            estimatedCostRange: { type: Type.STRING },
            questionsToAsk: { type: Type.ARRAY, items: { type: Type.STRING } },
            comparisonCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['id', 'category', 'vendorRole', 'estimatedCostRange', 'questionsToAsk', 'comparisonCriteria'],
        },
      },
    },
    required: ['vendors'],
  },
  ideas: {
    type: Type.OBJECT,
    properties: {
      themeDetails: {
        type: Type.OBJECT,
        properties: {
          concept: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          decorElements: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['concept', 'colorPalette', 'decorElements'],
      },
      activities: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
          },
          required: ['title', 'description', 'targetAudience'],
        },
      },
      customMenu: {
        type: Type.OBJECT,
        properties: {
          signatureCocktailMocktail: { type: Type.STRING },
          appetizers: { type: Type.ARRAY, items: { type: Type.STRING } },
          mains: { type: Type.ARRAY, items: { type: Type.STRING } },
          dessert: { type: Type.STRING },
          dietaryNotes: { type: Type.STRING },
        },
        required: ['signatureCocktailMocktail', 'appetizers', 'mains', 'dessert', 'dietaryNotes'],
      },
      moneySavingHacks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            tip: { type: Type.STRING },
            estimatedSavings: { type: Type.STRING },
            implementation: { type: Type.STRING },
          },
          required: ['tip', 'estimatedSavings', 'implementation'],
        },
      },
    },
    required: ['themeDetails', 'activities', 'customMenu', 'moneySavingHacks'],
  },
};

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = globalRateLimiter.check(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'Too many requests. Please wait a moment.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetSeconds) } }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'Missing request body' },
        { status: 400 }
      );
    }

    const validation = RegenerateSectionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'Invalid regeneration request', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { section, instruction, currentPlan } = validation.data;
    const intake = currentPlan.intake;

    const prompt = `You are updating only the "${section}" section of an event plan.
EVENT CONTEXT:
- Type: ${intake.eventType}
- Title: ${intake.eventTitle}
- Guest Count: ${intake.guestCount}
- Total Budget: ${intake.totalBudget} ${intake.currency}
- Location: ${intake.location}
- Theme: ${intake.themeVibe}

USER REFINEMENT INSTRUCTION:
"${instruction}"

Output ONLY the revised "${section}" JSON adhering to the specified schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are an expert event planner. Update the specific section according to the user instructions. Maintain total budget consistency if revising budget. Return strictly valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: sectionSchemas[section],
        temperature: 0.7,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'No response from model' },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(rawText);

    // Validate and normalize according to section type
    if (section === 'budget') {
      const rawItems = (parsed.items || []).map((item: any, idx: number) => ({
        ...item,
        id: item.id || `budget-${idx + 1}`,
        color:
          CATEGORY_COLORS[item.category] ||
          COLOR_SWATCHES[idx % COLOR_SWATCHES.length] ||
          '#6366F1',
      }));
      const normalizedItems = normalizeBudgetItems(rawItems, intake.totalBudget);
      const budgetResult = BudgetPlanSchema.parse({
        totalBudget: intake.totalBudget,
        currency: intake.currency,
        contingencyAmount: parsed.contingencyAmount ?? Math.round(intake.totalBudget * 0.05),
        items: normalizedItems,
        summary: parsed.summary || 'Updated budget allocation.',
      });

      return NextResponse.json<ApiResponse<typeof budgetResult>>({
        ok: true,
        data: budgetResult,
      });
    }

    if (section === 'timeline') {
      const timelineResult = TimelinePlanSchema.parse({
        phases: parsed.phases || ['Phase 1', 'Phase 2'],
        tasks: (parsed.tasks || []).map((t: any, i: number) => ({
          ...t,
          id: t.id || `task-${i + 1}`,
          completed: false,
          priority: ['High', 'Medium', 'Low'].includes(t.priority) ? t.priority : 'Medium',
          owner: t.owner || 'Host',
        })),
      });

      return NextResponse.json<ApiResponse<typeof timelineResult>>({
        ok: true,
        data: timelineResult,
      });
    }

    if (section === 'vendors') {
      const vendorResult = VendorPlanSchema.parse({
        vendors: (parsed.vendors || []).map((v: any, i: number) => ({
          ...v,
          id: v.id || `vendor-${i + 1}`,
          booked: false,
        })),
      });

      return NextResponse.json<ApiResponse<typeof vendorResult>>({
        ok: true,
        data: vendorResult,
      });
    }

    if (section === 'ideas') {
      const ideasResult = IdeasPlanSchema.parse(parsed);
      return NextResponse.json<ApiResponse<typeof ideasResult>>({
        ok: true,
        data: ideasResult,
      });
    }

    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: 'Unknown section requested' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Section regeneration error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: 'Failed to regenerate section. Please try again.' },
      { status: 500 }
    );
  }
}
