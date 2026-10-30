import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Eye, Keyboard, ShieldCheck, Sparkles } from 'lucide-react';
import { CrownIcon } from '@/components/CrownIcon';

export const metadata = {
  title: 'Accessibility Statement & Methodology | EventCraft AI',
  description:
    'Comprehensive documentation of EventCraft AI’s accessibility methodology, WCAG 2.2 Level AA conformance, and automated testing suite.',
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-[var(--text)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--cyan)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] rounded px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to EventCraft AI Planner</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className="royal-glass rounded-3xl p-8 border border-[var(--royal)]/40 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--gold)]/30">
            <CrownIcon size={14} className="text-[var(--gold)]" />
            <span className="font-display font-bold text-[11px] uppercase tracking-wider text-[var(--gold)]">
              Digital Accessibility Commitment
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Accessibility Statement & Engineering Methodology
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            EventCraft AI is engineered to meet and exceed <strong>WCAG 2.2 Level AA</strong> standards. We believe world-class event planning tools must be fully usable by everyone, regardless of physical ability, neurodivergence, or assistive technology.
          </p>
        </header>

        {/* Core Conformance Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1 */}
          <div className="royal-glass rounded-3xl p-6 border border-[var(--royal)]/30 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <Keyboard className="w-5 h-5 text-[var(--cyan)]" />
              <h3>Full Keyboard Operability</h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Every interactive element, modal dialog, and tab strip is navigable without a mouse.
            </p>
            <ul className="text-xs text-[var(--text)] space-y-1.5 list-disc list-inside">
              <li>Skip to main content anchor on all entry pages.</li>
              <li>WAI-ARIA Tablist Pattern: Arrow keys switch tabs, Home/End jump to bounds.</li>
              <li>Modal traps keyboard focus and dismisses seamlessly on Escape key.</li>
              <li>Visible 3px royal focus rings with high contrast.</li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="royal-glass rounded-3xl p-6 border border-[var(--royal)]/30 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <Eye className="w-5 h-5 text-[var(--gold)]" />
              <h3>Contrast & High-Visibility Design</h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Color is never used as the sole conveyor of information.
            </p>
            <ul className="text-xs text-[var(--text)] space-y-1.5 list-disc list-inside">
              <li>All body copy achieves &gt;= 7:1 contrast against deep ink surfaces.</li>
              <li>Primary CTA buttons maintain 8.5:1 contrast against dark royal themes.</li>
              <li>Windows High Contrast mode (<code>forced-colors: active</code>) fully supported with system Canvas borders.</li>
              <li>Text scales smoothly up to 200% zoom without truncation or layout breakage.</li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="royal-glass rounded-3xl p-6 border border-[var(--royal)]/30 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <ShieldCheck className="w-5 h-5 text-[var(--magenta)]" />
              <h3>Form Accessibility & Error Handling</h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              WCAG 2.2 AA compliant intake workflow for stress-free event organization.
            </p>
            <ul className="text-xs text-[var(--text)] space-y-1.5 list-disc list-inside">
              <li>Explicit, permanent labels for all form inputs.</li>
              <li>Comprehensive Error Summary card placed at top of form on failed submission.</li>
              <li>Programmatic focus shift directly to the Error Summary on submit.</li>
              <li>In-line error messages linked via <code>aria-describedby</code> and <code>aria-invalid</code>.</li>
            </ul>
          </div>

          {/* Pillar 4 */}
          <div className="royal-glass rounded-3xl p-6 border border-[var(--royal)]/30 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <Sparkles className="w-5 h-5 text-[var(--cyan)]" />
              <h3>Screen Reader & Live Regions</h3>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Real-time dynamic updates are broadcast politely without interrupting speech.
            </p>
            <ul className="text-xs text-[var(--text)] space-y-1.5 list-disc list-inside">
              <li><code>aria-live=&quot;polite&quot;</code> regions announce AI generation progress and task status.</li>
              <li>SVG Donut charts include complete ARIA role description and full data table alternatives.</li>
              <li>Interactive milestone checkboxes update their completion state explicitly.</li>
            </ul>
          </div>
        </div>

        {/* Automated Testing & Auditing Methodology */}
        <section className="royal-glass rounded-3xl p-8 border border-[var(--royal)]/40 shadow-xl space-y-4">
          <h2 className="text-xl font-display font-bold text-white">
            Automated & Manual Verification Suite
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Our codebase is automatically tested against accessibility regressions as part of continuous integration:
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">jest-axe Automated Audit</strong>
                <span className="text-[var(--muted)]">
                  All interactive React components are tested with <code>axe-core</code> rules to guarantee zero detectable violations.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Screen Reader Verification</strong>
                <span className="text-[var(--muted)]">
                  Audited with Apple VoiceOver (macOS / iOS) and NVDA / JAWS (Windows) for seamless speech flow.
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--royal)]/30 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Motion Sensitivity Safeguard</strong>
                <span className="text-[var(--muted)]">
                  All animations and marquee loops honor <code>prefers-reduced-motion: reduce</code> media queries.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback & Contact */}
        <footer className="text-center text-xs text-[var(--muted)] pt-4">
          <p>
            Have feedback on accessibility? Let us know at{' '}
            <span className="text-[var(--cyan)] font-semibold">mantuforwork@gmail.com</span>.
          </p>
        </footer>
      </div>
    </div>
  );
}
