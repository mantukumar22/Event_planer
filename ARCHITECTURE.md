# EventCraft AI — Architecture & System Design Document

## 1. System Overview
EventCraft AI is a full-stack Next.js (App Router) web application designed with strict separation of concerns, high resiliency, and zero client-side secret exposure.

```
├── app/
│   ├── api/
│   │   ├── plan/
│   │   │   ├── generate/route.ts      # Generates full event plan
│   │   │   ├── regenerate/route.ts    # Re-generates isolated section
│   │   │   ├── trim-budget/route.ts   # Rebalances budget with trade-offs
│   │   │   └── chat/route.ts          # Streaming contextual planner chat
│   ├── accessibility/page.tsx         # WCAG 2.2 AA methodology documentation
│   ├── layout.tsx                     # App shell, fonts, meta tags
│   └── page.tsx                       # Main page (Landing, Intake, PlanView)
├── components/
│   ├── IntakeForm.tsx                 # Guided intake with bot mitigation
│   ├── PlanView.tsx                   # Master plan container with assumptions
│   ├── ExportModal.tsx                # .ICS, CSV, JSON export dialog
│   ├── AskPlannerChat.tsx             # Floating streaming chat panel
│   └── tabs/
│       ├── BudgetTab.tsx              # What-If guest slider & donut chart
│       ├── TimelineTab.tsx            # Milestones & day-of run-of-show
│       ├── VendorChecklistTab.tsx     # Vendor criteria & checklist
│       └── PersonalizedIdeasTab.tsx   # Curated decor, menus, & hacks
├── lib/
│   ├── schemas.ts                     # Zod source of truth for inputs & outputs
│   ├── guardrails.ts                  # Sanitization, HTML strip, control char clean
│   ├── budget-math.ts                 # What-if rescaling & severity calculation
│   ├── ics-export.ts                  # Pure RFC 5545 iCalendar generation
│   ├── gemini-fallback.ts             # Model fallback chain & timeout handler
│   ├── template-plans.ts              # Deterministic offline rule-based plans
│   └── rate-limiter.ts                # Sliding-window IP rate limiter
└── middleware.ts                      # Nonce-based CSP & security headers
```

---

## 2. Server / Client Boundary
- **Zero Client Keys:** `GEMINI_API_KEY` is strictly accessed within server Route Handlers (`app/api/*`). It is never passed or prefixed with `NEXT_PUBLIC_`.
- **Server Route Responsibilities:**
  1. Rate limiting via client IP.
  2. Honeypot and timing validation to reject automated bots.
  3. Schema validation using Zod.
  4. Resilient Gemini API calls with graceful degradation.
  5. Post-generation guardrails and output sanitization.

---

## 3. Resilience & Degradation Strategy
1. **Primary Model:** `gemini-3.8-flash` with a 25-second AbortController timeout.
2. **Fallback Model:** If primary fails or times out, immediately retries with `gemini-2.5-flash`.
3. **Offline Rule-Based Templates:** If both model attempts fail, network is down, or `MOCK_AI=true`, the system falls back to `lib/template-plans.ts`. The UI displays an &quot;Offline Template Blueprint&quot; badge so the user is aware of the deterministic fallback.

---

## 4. State Management & Persistence
- **Client State:** React local state manages active tabs, task toggles, and slider inputs.
- **Persistence:** All edits and plan states are auto-saved to `localStorage['eventcraft_saved_plan']` wrapped in `try/catch` with runtime Zod re-validation upon reload.
- **Local Privacy:** Feedback thumbs ratings are stored strictly in local browser storage (`localStorage['rating_*']`) without external telemetry.
