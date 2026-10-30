# EventCraft AI — Testing Strategy & Verification Guide

## 1. Overview
EventCraft AI employs a multi-tiered testing strategy ensuring mathematical accuracy, runtime resilience, accessibility compliance, and security guardrails.

```
Testing Pyramid:
     [ Playwright E2E Flow (e2e/flow.spec.ts) ]
       [ jest-axe WCAG Accessibility Tests ]
         [ Prompt Injection & Security Suite ]
           [ Vitest Unit Tests (Math, ICS, Guardrails) ]
```

---

## 2. Test Commands

### Run All Unit & Integration Tests:
```bash
npm test
```

### Run Tests with Coverage Threshold Verification:
```bash
npm run test:coverage
```
*Note: Configured in `vitest.config.ts` to enforce >= 80% coverage on core library modules.*

### Run TypeScript Type Check:
```bash
npm run typecheck
```

### Run ESLint Verification:
```bash
npm run lint
```

---

## 3. Test Suites Breakdown

### 1. Mathematical Accuracy & What-If Tools (`__tests__/unit/budget-rescaling.test.ts`, `__tests__/unit/budget-math.test.ts`)
- Verifies cent-drift auto-correction on normalized budget items.
- Tests that per-guest categories (catering, open bar, party favors) scale proportionally when simulated guest count changes.
- Tests over/under budget severity threshold calculations (`balanced`, `under`, `caution`, `critical`).

### 2. RFC 5545 iCalendar Calendar Generation (`__tests__/unit/ics-export.test.ts`)
- Asserts strict compliance with `BEGIN:VCALENDAR`, `VERSION:2.0`, `BEGIN:VEVENT`, and `END:VCALENDAR`.
- Validates proper line unfolding, character escaping for commas and semicolons, and full-day event date formatting (`DTSTART;VALUE=DATE:YYYYMMDD`).

### 3. Prompt Injection & Security Boundaries (`__tests__/unit/prompt-injection.test.ts`)
- Tests adversarial inputs: system prompt extraction attempts, jailbreak prefixes, Linux shell emulation requests, and oversized token stuffing.
- Verifies that Zod schemas clamp payload lengths and honeypot traps detect bot automation.

### 4. Guardrails & Output Sanitization (`__tests__/unit/guardrails.test.ts`)
- Tests removal of `<script>` and `<iframe>` HTML tags.
- Verifies stripping of ASCII control characters.
- Validates safe currency formatting across USD, EUR, GBP, CAD, AUD, and INR.

### 5. Automated Accessibility Audits (`__tests__/components/`)
- Audits `IntakeForm`, `PlanView`, `BudgetTab`, `TimelineTab`, `VendorChecklistTab`, and `PersonalizedIdeasTab` with `jest-axe` to guarantee zero WCAG 2.2 AA violations.

### 6. End-to-End User Flow (`e2e/flow.spec.ts`)
- Simulates user journey from landing page hero CTA to intake form completion, budget what-if slider interaction, milestone completion, day-of agenda view, and `.ics` download.
