/**
 * Single Responsibility: API Route Handler for intelligent budget trimming and trade-off rebalancing.
 */
import { NextRequest, NextResponse } from 'next/server';
import { TrimBudgetSchema, BudgetPlanSchema, ApiResponse, BudgetPlan, BudgetItem } from '@/lib/schemas';
import { globalRateLimiter, getClientIp } from '@/lib/rate-limiter';
import { callGeminiWithFallback, isMockAiEnabled } from '@/lib/gemini-fallback';
import { normalizeBudgetItems } from '@/lib/budget-math';

export const runtime = 'nodejs';

interface TrimResponse {
  budget: BudgetPlan;
  tradeOffs: string[];
  summary: string;
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const rateCheck = globalRateLimiter.check(clientIp);

    if (!rateCheck.allowed) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'Rate limit exceeded. Please wait a moment.' },
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

    const validation = TrimBudgetSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json<ApiResponse<never>>(
        { ok: false, error: 'Invalid trim request payload', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { currentPlan, targetBudget, priorities } = validation.data;
    const oldTotal = currentPlan.budget.totalBudget;
    const currency = currentPlan.budget.currency;

    // Deterministic rule-based trim fallback
    const generateFallbackTrim = (): TrimResponse => {
      const contingencyPercent = 8;
      const contingencyAmount = Math.round((targetBudget * contingencyPercent) / 100);
      const balancedItems = normalizeBudgetItems(currentPlan.budget.items, targetBudget);

      return {
        budget: {
          currency,
          totalBudget: targetBudget,
          contingencyAmount,
          items: balancedItems,
          summary: `Rebalanced total budget to exactly ${currency} ${targetBudget} with a preserved contingency reserve.`,
        },
        tradeOffs: [
          `Proportionally reduced spend across all categories by ~${Math.round((1 - targetBudget / Math.max(1, oldTotal)) * 100)}%.`,
          `Preserved strict 8% contingency fund (${currency} ${contingencyAmount}) for unexpected expenses.`,
          `Consider selecting off-peak dates or a digital RSVP strategy to offset catering and print costs.`,
        ],
        summary: `Rebalanced total budget to exactly ${currency} ${targetBudget}.`,
      };
    };

    if (isMockAiEnabled()) {
      return NextResponse.json<ApiResponse<TrimResponse>>({
        ok: true,
        data: generateFallbackTrim(),
      });
    }

    const systemInstruction = `You are a world-class financial event planner.
Your mission is to reallocate the provided event budget to strictly meet the new target budget: ${currency} ${targetBudget}.
Current budget was ${currency} ${oldTotal}.
You MUST return valid JSON matching this schema:
{
  "budget": {
    "currency": "${currency}",
    "totalBudget": ${targetBudget},
    "contingencyAmount": ${Math.round(targetBudget * 0.08)},
    "items": [
      {
        "id": "string",
        "category": "string",
        "allocatedAmount": number,
        "percentage": number,
        "notes": "string"
      }
    ],
    "summary": "string"
  },
  "tradeOffs": ["specific trade-off 1", "specific trade-off 2", "specific trade-off 3"],
  "summary": "one concise paragraph explaining the changes made to hit the target"
}
CRITICAL RULES:
1. The sum of all item allocatedAmounts MUST exactly equal ${targetBudget}.
2. Always maintain a contingency buffer of 5-10% of total budget.
3. Offer realistic trade-offs based on priorities: ${priorities.join(', ') || 'balanced cuts'}.
4. Output strictly raw JSON, no markdown codeblocks, no commentary.`;

    const prompt = `Current event: ${currentPlan.intake.eventTitle} (${currentPlan.intake.eventType}).
Current items:
${JSON.stringify(currentPlan.budget.items, null, 2)}

Rebalance budget down to exactly ${currency} ${targetBudget}.`;

    try {
      const responseText = await callGeminiWithFallback(prompt, {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
      });

      const parsed = JSON.parse(responseText.trim());
      const budgetValidation = BudgetPlanSchema.safeParse(parsed.budget);
      if (!budgetValidation.success) {
        console.warn('AI generated budget did not validate in trim, using fallback', budgetValidation.error);
        return NextResponse.json<ApiResponse<TrimResponse>>({
          ok: true,
          data: generateFallbackTrim(),
        });
      }

      return NextResponse.json<ApiResponse<TrimResponse>>({
        ok: true,
        data: {
          budget: budgetValidation.data,
          tradeOffs: Array.isArray(parsed.tradeOffs) ? parsed.tradeOffs : ['Adjusted line items.'],
          summary: parsed.summary || `Budget trimmed to ${currency} ${targetBudget}.`,
        },
      });
    } catch (aiErr) {
      console.warn('Gemini trim call failed, falling back to deterministic trim:', aiErr);
      return NextResponse.json<ApiResponse<TrimResponse>>({
        ok: true,
        data: generateFallbackTrim(),
      });
    }
  } catch (error: any) {
    console.error('Trim budget error:', error);
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: 'Failed to trim budget. Please try again.' },
      { status: 500 }
    );
  }
}
