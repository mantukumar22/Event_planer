'use client';

/**
 * Single Responsibility: Master Plan View assembling Budget, Timeline, Vendors, Ideas,
 * AI Assumptions transparency panel, template fallback badges, and ARIA-compliant tabs.
 */
import React, { useState, useRef } from 'react';
import {
  DollarSign,
  Calendar,
  CheckSquare,
  Sparkles,
  MapPin,
  Users,
  Printer,
  FileSpreadsheet,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { EventPlan, BudgetPlan, TimelinePlan, VendorPlan } from '@/lib/schemas';
import { PlanTabId, PlanTabItem } from '@/lib/types';
import { formatCurrency } from '@/lib/budget-math';
import { BudgetTab } from './tabs/BudgetTab';
import { TimelineTab } from './tabs/TimelineTab';
import { VendorChecklistTab } from './tabs/VendorChecklistTab';
import { PersonalizedIdeasTab } from './tabs/PersonalizedIdeasTab';
import { CrownIcon } from './CrownIcon';

interface PlanViewProps {
  plan: EventPlan;
  onUpdateBudget: (updated: BudgetPlan) => void;
  onUpdateTimeline: (updated: TimelinePlan) => void;
  onUpdateVendors: (updated: VendorPlan) => void;
  onOpenRegenerate: (section: PlanTabId) => void;
  onOpenExport: () => void;
  onPrint: () => void;
}

export function PlanView({
  plan,
  onUpdateBudget,
  onUpdateTimeline,
  onUpdateVendors,
  onOpenRegenerate,
  onOpenExport,
  onPrint,
}: PlanViewProps) {
  const [activeTab, setActiveTab] = useState<PlanTabId>('budget');
  const [showAssumptions, setShowAssumptions] = useState(false);
  const tabRefs = useRef<Map<PlanTabId, HTMLButtonElement | null>>(new Map());

  const completedTasksCount = plan.timeline.tasks.filter((t) => t.completed).length;
  const bookedVendorsCount = plan.vendors.vendors.filter((v) => v.booked).length;

  const defaultAssumptions = [
    `Assumed catering and beverage allocation is scaled for ${plan.intake.guestCount} guests at standard local pricing in ${plan.intake.location}.`,
    `Reserved a guaranteed contingency buffer of ${formatCurrency(plan.budget.contingencyAmount, plan.budget.currency)} (~${Math.round((plan.budget.contingencyAmount / plan.budget.totalBudget) * 100)}%) for overages.`,
    `Timeline intervals assume an event date of ${plan.intake.eventDate} with major vendor contracts finalized at least 8-12 weeks prior.`,
    `Decor and production scaled to reflect the "${plan.intake.themeVibe}" vibe with a high-contrast nightlife finish.`,
  ];

  const displayAssumptions =
    plan.assumptions && plan.assumptions.length > 0 ? plan.assumptions : defaultAssumptions;

  const tabs: PlanTabItem[] = [
    {
      id: 'budget',
      label: 'Budget Allocation',
      badge: formatCurrency(plan.budget.totalBudget, plan.budget.currency),
    },
    {
      id: 'timeline',
      label: 'Timeline & Milestones',
      badge: `${completedTasksCount}/${plan.timeline.tasks.length}`,
    },
    {
      id: 'vendors',
      label: 'Vendor Checklist',
      badge: `${bookedVendorsCount}/${plan.vendors.vendors.length} Booked`,
    },
    {
      id: 'ideas',
      label: 'Personalized Ideas',
      badge: `${plan.ideas.moneySavingHacks.length} Hacks`,
    },
  ];

  // ARIA keyboard navigation for tabs
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = index;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = tabs.length - 1;
    } else {
      return;
    }

    const nextTab = tabs[targetIndex].id;
    setActiveTab(nextTab);
    tabRefs.current.get(nextTab)?.focus();
  };

  return (
    <div className="space-y-8">
      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        Viewing {tabs.find((t) => t.id === activeTab)?.label} section.
      </div>

      {/* Offline Template Plan Fallback Notice */}
      {plan.isTemplateFallback && (
        <div
          role="status"
          className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-white">Offline Template Blueprint:</strong> Generated via deterministic rule-based algorithms with guaranteed 8% contingency fund.
            </span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
            Rule-Based
          </span>
        </div>
      )}

      {/* Executive Overview Header */}
      <section
        aria-labelledby="event-overview-title"
        className="royal-glass rounded-3xl p-6 sm:p-8 border border-[var(--royal)]/40 shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--gold)]/30">
                <CrownIcon size={12} className="text-[var(--gold)]" />
                <span>{plan.intake.eventType} Plan</span>
              </span>
              <span className="text-xs text-[var(--muted)] font-medium">
                Created {plan.createdAt.split('T')[0]}
              </span>
            </div>

            <h2
              id="event-overview-title"
              className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight"
            >
              {plan.intake.eventTitle}
            </h2>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              {plan.executiveSummary}
            </p>

            {/* Quick Metrics Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2 bg-[var(--surface-2)]/80 text-white px-3.5 py-2 rounded-xl border border-[var(--royal)]/30">
                <Calendar className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>{plan.intake.eventDate}</span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface-2)]/80 text-[var(--gold)] px-3.5 py-2 rounded-xl border border-[var(--gold)]/30">
                <DollarSign className="w-4 h-4 text-[var(--gold)]" aria-hidden="true" />
                <span className="font-bold">
                  {formatCurrency(plan.budget.totalBudget, plan.budget.currency)} {plan.budget.currency}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface-2)]/80 text-white px-3.5 py-2 rounded-xl border border-[var(--royal)]/30">
                <Users className="w-4 h-4 text-[var(--magenta)]" aria-hidden="true" />
                <span>{plan.intake.guestCount} Guests</span>
              </div>
              <div className="flex items-center gap-2 bg-[var(--surface-2)]/80 text-white px-3.5 py-2 rounded-xl border border-[var(--royal)]/30">
                <MapPin className="w-4 h-4 text-[var(--royal-light)]" aria-hidden="true" />
                <span>{plan.intake.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 print:hidden">
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-white text-xs font-bold transition-all border border-[var(--royal)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
              <span>Print Binder View</span>
            </button>
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--cyan)] hover:bg-[#55EEFF] text-[#04121A] text-xs font-extrabold transition-all shadow-md shadow-[var(--cyan)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#04121A]" aria-hidden="true" />
              <span>Export CSV / .ICS</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Assumptions & Transparency Panel */}
      <div className="royal-glass rounded-3xl p-5 border border-[var(--royal)]/30 print:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[var(--cyan)]" />
            <h3 className="text-sm font-bold text-white">AI Planning Assumptions & Transparency</h3>
            <span className="text-xs text-[var(--muted)]">({displayAssumptions.length} assumptions made)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="text-xs text-[var(--cyan)] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            aria-expanded={showAssumptions}
          >
            <span>{showAssumptions ? 'Hide Details' : 'View Assumptions'}</span>
            {showAssumptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAssumptions && (
          <div className="mt-4 pt-3 border-t border-[var(--royal)]/20 space-y-2 text-xs text-[var(--muted)] animate-in fade-in">
            <p className="text-white font-medium mb-1">
              To verify and adjust the plan, here is what our model assumed based on your event inputs:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1">
              {displayAssumptions.map((assumption, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="text-[var(--text)]">{assumption}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 text-[11px] text-[var(--gold)]">
              Need to change an assumption? Use &quot;Regenerate&quot; on any section with custom instructions or chat with &quot;Ask the Planner&quot;.
            </p>
          </div>
        )}
      </div>

      {/* Screen Interactive Tabs */}
      <div className="print:hidden">
        {/* ARIA tablist with dark royal pills and gold underline */}
        <div
          role="tablist"
          aria-label="Event plan sections"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 border-b border-[var(--royal)]/25 focus:outline-none"
        >
          {tabs.map((tab, idx) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current.set(tab.id, el);
                }}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] ${
                  isSelected
                    ? 'bg-[var(--cyan)] text-[#04121A] shadow-lg shadow-[var(--cyan)]/20 scale-[1.02]'
                    : 'bg-[var(--surface-2)]/60 text-[var(--muted)] hover:text-white hover:bg-[var(--surface-2)] border border-[var(--royal)]/30'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-[#04121A]/20 text-[#04121A]'
                        : 'bg-[var(--surface)] text-[var(--gold)] border border-[var(--gold)]/20'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="mt-6">
          <div
            role="tabpanel"
            id="panel-budget"
            aria-labelledby="tab-budget"
            hidden={activeTab !== 'budget'}
            tabIndex={0}
            className="focus:outline-none"
          >
            {activeTab === 'budget' && (
              <BudgetTab
                budget={plan.budget}
                currency={plan.budget.currency}
                guestCount={plan.intake.guestCount}
                onUpdateBudget={onUpdateBudget}
                onOpenRegenerate={() => onOpenRegenerate('budget')}
              />
            )}
          </div>

          <div
            role="tabpanel"
            id="panel-timeline"
            aria-labelledby="tab-timeline"
            hidden={activeTab !== 'timeline'}
            tabIndex={0}
            className="focus:outline-none"
          >
            {activeTab === 'timeline' && (
              <TimelineTab
                timeline={plan.timeline}
                eventDate={plan.intake.eventDate}
                eventTitle={plan.intake.eventTitle}
                onUpdateTimeline={onUpdateTimeline}
                onOpenRegenerate={() => onOpenRegenerate('timeline')}
              />
            )}
          </div>

          <div
            role="tabpanel"
            id="panel-vendors"
            aria-labelledby="tab-vendors"
            hidden={activeTab !== 'vendors'}
            tabIndex={0}
            className="focus:outline-none"
          >
            {activeTab === 'vendors' && (
              <VendorChecklistTab
                vendors={plan.vendors}
                onUpdateVendors={onUpdateVendors}
                onOpenRegenerate={() => onOpenRegenerate('vendors')}
              />
            )}
          </div>

          <div
            role="tabpanel"
            id="panel-ideas"
            aria-labelledby="tab-ideas"
            hidden={activeTab !== 'ideas'}
            tabIndex={0}
            className="focus:outline-none"
          >
            {activeTab === 'ideas' && (
              <PersonalizedIdeasTab
                ideas={plan.ideas}
                themeVibe={plan.intake.themeVibe}
                onOpenRegenerate={() => onOpenRegenerate('ideas')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Printable Binder View: Render all 4 sections in order when printing */}
      <div className="hidden print:block space-y-8 text-black">
        <div className="border-b-2 border-stone-900 pb-4 mb-6">
          <h2 className="text-xl font-bold font-serif">Comprehensive Event Plan Binder</h2>
          <p className="text-sm text-stone-600">Generated by EventCraft AI</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">1. Budget Allocation Breakdown</h3>
          <BudgetTab
            budget={plan.budget}
            currency={plan.budget.currency}
            guestCount={plan.intake.guestCount}
            onUpdateBudget={onUpdateBudget}
            onOpenRegenerate={() => {}}
          />
        </section>

        <section className="space-y-4 pt-6">
          <h3 className="text-lg font-bold border-b pb-2">2. Timeline & Countdown Milestones</h3>
          <TimelineTab
            timeline={plan.timeline}
            eventDate={plan.intake.eventDate}
            eventTitle={plan.intake.eventTitle}
            onUpdateTimeline={onUpdateTimeline}
            onOpenRegenerate={() => {}}
          />
        </section>

        <section className="space-y-4 pt-6">
          <h3 className="text-lg font-bold border-b pb-2">3. Vendor Sourcing & Criteria Checklist</h3>
          <VendorChecklistTab
            vendors={plan.vendors}
            onUpdateVendors={onUpdateVendors}
            onOpenRegenerate={() => {}}
          />
        </section>

        <section className="space-y-4 pt-6">
          <h3 className="text-lg font-bold border-b pb-2">4. Personalized Ideas & Menus</h3>
          <PersonalizedIdeasTab
            ideas={plan.ideas}
            themeVibe={plan.intake.themeVibe}
            onOpenRegenerate={() => {}}
          />
        </section>
      </div>
    </div>
  );
}
