# EventCraft AI — Intelligent Event Planning Assistant

An AI-powered event producer and planning assistant engineered for weddings, milestone birthdays, and community festivals. EventCraft AI combines Google Gemini 3.8 Flash structured output with mathematical budget balancing, countdown schedules, vendor negotiation roadmaps, and streaming AI advisory.

---

## 1. Problem & Solution

### The Problem
Event planning (weddings, milestone birthdays, community fundraisers) is notoriously stressful:
1. **Budget Chaos**: Spreadsheets get imbalanced, hidden fees appear, and allocations drift away from real vendor market rates.
2. **Timeline Overwhelm**: Hosts lack clarity on what decisions need to happen 6 months out versus 2 weeks out.
3. **Vendor Interview Blindspots**: Hosts don't know what specific questions to ask or what fine print to compare between quotes.
4. **Generic AI Slop**: Typical LLM chats hallucinate numbers, produce markdown text that cannot be edited or calculated, and do not respect dietary or accessibility constraints.

### The Solution
EventCraft AI solves this through a guided, production-grade application:
- **Exact Mathematical Budgeting**: Guaranteed 100% budget sum matching down to the cent with automated rounding drift correction and live re-balancing.
- **Pure SVG Donut Visualization**: Lightweight, zero-dependency SVG chart accompanied by an accessible data table alternative.
- **Countdown Timeline**: Grouped by phase and priority, with interactive task progress tracking.
- **Vendor Sourcing Checklist**: Category-specific interview questions, quote comparison criteria, and price ranges.
- **Personalized Ideas & Menu**: Tailored themes, signature cocktails/mocktails, activities, and concrete money-saving hacks.
- **"Ask the Planner" Streaming Assistant**: Context-grounded chat with live streaming from Gemini.
- **Local Persistence & Multi-Format Export**: LocalStorage persistence with Zod schema verification on load, plus CSV, JSON, and print binder export.

---

## 2. Architecture Diagram (Text)

```
                    ┌────────────────────────────────────────────────────────┐
                    │                    Client (Browser)                    │
                    │  Next.js 15 App Router (React 19) + Tailwind CSS        │
                    └──────────────┬──────────────────────────┬──────────────┘
                                   │                          │
                 HTTP POST (JSON)  │                          │  ReadableStream (SSE)
                                   ▼                          ▼
┌────────────────────────────────────────────────────────┐  ┌────────────────────────────────────┐
│      Route: /api/plan/generate                         │  │  Route: /api/plan/chat             │
│      Route: /api/plan/regenerate-section               │  │  Streaming "Ask the Planner"       │
├────────────────────────────────────────────────────────┤  ├────────────────────────────────────┤
│ 1. MemoryRateLimiter (Sliding Window per IP)           │  │ 1. MemoryRateLimiter               │
│ 2. Zod Payload Validation (Length limits & types)      │  │ 2. Zod Payload Validation          │
│ 3. Request Cache Check (5-min TTL on identical hash)   │  │ 3. Prompt Injection Defense filter │
│ 4. Prompt Construction with Strict Directives          │  │ 4. ai.models.generateContentStream │
│ 5. ai.models.generateContent (gemini-3.8-flash)        │  │    with plan context injection     │
│    - responseMimeType: "application/json"              │  │ 5. Returns HTTP Response Stream    │
│    - responseSchema (Strongly Typed Schema)            │  └────────────────────────────────────┘
│ 6. Validation & 1-shot Repair Retry fallback           │
│ 7. normalizeBudgetItems (cent drift correction)        │
│ 8. Response Cache Set & Return ApiResponse<T>          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                   Google Gemini API                    │
│            Model: models/gemini-3.8-flash              │
│       Headers: 'User-Agent': 'aistudio-build'          │
│       API Key: process.env.GEMINI_API_KEY (Server only)│
└────────────────────────────────────────────────────────┘
```

---

## 3. Getting Started & Environment Variables

### Prerequisites
- Node.js 20+
- An API Key for Google Gemini (accessed through Google AI Studio)

### Environment Variables
EventCraft AI adheres strictly to the rule that API keys are server-only secrets. They are never exposed to the client bundle.

Configure `.env.local` (or supply via environment secrets):
```env
# Server-only secret for Gemini API
GEMINI_API_KEY="your_gemini_api_key_here"

# App URL for absolute references and metadata
APP_URL="http://localhost:3000"
```

### Installation & Running
```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Open in browser: http://localhost:3000
```

---

## 4. How the Gemini Integration Works

### 1. Model Selection
We use `gemini-3.8-flash`, the recommended flagship model for speed, complex structured JSON generation, and high-quality reasoning.

### 2. Structured Output with Strict Schemas
We configure `responseMimeType: "application/json"` and supply a formal `responseSchema` with `@google/genai`'s `Type.OBJECT`, `Type.ARRAY`, `Type.STRING`, `Type.NUMBER`. This prevents the model from generating Markdown backticks, chit-chat, or invalid fields.

### 3. Self-Healing Repair Retry
If the model output fails initial JSON parsing or schema validation, the handler automatically catches the failure and invokes a one-shot repair prompt containing the error context.

### 4. Mathematical Grounding & Drift Correction
Even with prompt instructions, rounding $33,333.33 \times 3$ creates a $\$0.01$ discrepancy against $\$100,000$. Our server-side `normalizeBudgetItems()` function mathematically checks the sum down to two decimal places and automatically adjusts the largest line item so that the total sum equals the user's budget with zero rounding error.

### 5. Prompt Injection Defense
All user inputs (event titles, cultural descriptions, must-haves) are inserted into prompt templates strictly as passive data parameters. The system instruction strictly commands the model to treat all user strings as data, refuse role changes, and never execute instructions embedded in user fields.

### 6. Streaming Chat Endpoint
The `/api/plan/chat` route utilizes `ai.models.generateContentStream` to stream chunks back to the client via `ReadableStream` and `TextEncoder`, ensuring instantaneous responsiveness.

---

## 5. Security Decisions

1. **Server-Side API Key Storage**: `GEMINI_API_KEY` is accessed exclusively in route handlers (`process.env.GEMINI_API_KEY`) and is never sent to the browser or prefixed with `NEXT_PUBLIC_`.
2. **In-Memory Rate Limiting**: Implemented via `MemoryRateLimiter` using a sliding window algorithm based on client IP (`x-forwarded-for` / `x-real-ip`). Exceeding 25 requests/minute returns `429 Too Many Requests` with a compliant `Retry-After` header.
3. **Strict Zod Input Validation**: Every request body is validated against rigorous Zod schemas with string length caps (`max(80)`, `max(300)`), number ranges (`min(5)`, `max(10000)`), and strict enum sets to prevent oversized or malicious payloads.
4. **No `dangerouslySetInnerHTML`**: All AI outputs and user texts are safely rendered through React text nodes, eliminating Cross-Site Scripting (XSS) vectors.
5. **Security Headers in `next.config.ts`**:
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - `Content-Security-Policy`: frame-ancestors configured safely for AI Studio embedding while restricting sources.

---

## 6. Accessibility & Efficiency Decisions (WCAG 2.2 AA)

1. **Semantic HTML Landmarks**: `<header>`, `<main id="main-content">`, `<nav>`, `<footer>`, `<section aria-labelledby="...">`.
2. **Skip-to-Content Link**: Focusable skip link at the very top of `layout.tsx` targeting `#main-content`.
3. **WAI-ARIA Tabs Pattern**: Full arrow key navigation (`ArrowRight`, `ArrowLeft`, `Home`, `End`), `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, and `role="tabpanel"`.
4. **Form Labels & Error Associations**: Every input has an explicit `<label htmlFor="...">`, helper text `<p id="...-help">`, and error messages linked through `aria-describedby` and `aria-invalid`.
5. **Color Contrast & Donut Chart Alternative**: All UI elements maintain contrast ratios $\ge 4.5:1$. The pure SVG donut chart provides full text alternatives and an interactive data table with row headers and numeric inputs.
6. **Screen Reader Live Announcements**: `aria-live="polite"` regions announce loading states, streaming status, and task completion.
7. **Zero Large Bundles / Zero Heavy Chart Dependencies**: Built with native SVG geometry and pure CSS transitions.

---

## 7. Testing Suite

The repository includes a comprehensive test suite covering unit, component, API, and accessibility tests using Vitest, React Testing Library, and jest-axe.

### Available Scripts
```bash
# Run all unit, component, API, and a11y tests
npm test

# Run tests with test coverage reporting
npm run test:coverage

# Run TypeScript typecheck without emitting files
npm run typecheck

# Run ESLint validation
npm run lint

# Build production bundle
npm run build
```

### Test Coverage Highlights
- **`__tests__/unit/budget-math.test.ts`**: Cent drift correction, percentage scaling, tolerance checks, auto-rebalancing.
- **`__tests__/unit/schemas.test.ts`**: Zod parsing of valid and malformed event parameters.
- **`__tests__/unit/rate-limiter.test.ts`**: Window expiration, request limits, retry countdowns, IP header extraction.
- **`__tests__/unit/export-utils.test.ts`**: RFC 4180 CSV escaping, structured plan generation.
- **`__tests__/unit/storage.test.ts`**: LocalStorage read/write, schema validation on reload, corruption recovery.
- **`__tests__/components/IntakeForm.test.tsx`**: Required error messages, field change handling, submit trigger.
- **`__tests__/components/BudgetTab.test.tsx`**: SVG chart rendering, live line item amount recalculation.
- **`__tests__/components/TabsNavigation.test.tsx`**: Arrow-key keyboard navigation and tab switching.
- **`__tests__/api/generate.test.ts`**: Route handler success, rate limit 429 response, Zod 400 rejection with mocked Gemini client.
- **`__tests__/a11y/accessibility.test.tsx`**: Full automated WCAG 2.2 AA audit via `jest-axe` for main views.

---

## 8. Assumptions & Trade-offs
- **In-memory Rate Limiting**: Suitable for serverless / single-instance cloud environments; can be replaced with Redis (`@upstash/ratelimit`) for distributed multi-region clusters.
- **Currency Conversion**: Budget items are calculated and allocated in the user's chosen currency (USD, EUR, GBP, CAD, AUD, JPY, INR) with localized formatting symbols.
- **AI Estimates Disclaimer**: All budget items, vendor ranges, and contract questions are informed estimates; the app explicitly advises hosts to verify contract terms directly with their vendors.
