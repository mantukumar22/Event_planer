'use client';

import React, { useState, useRef } from 'react';
import {
  DollarSign,
  Calendar,
  CheckSquare,
  Sparkles,
  MapPin,
  Users,
  Clock,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';
import { EventPlan, BudgetPlan, TimelinePlan, VendorPlan } from '@/lib/schemas';
import { PlanTabId, PlanTabItem } from '@/lib/types';
import { formatCurrency } from '@/lib/budget-math';
import { BudgetTab } from './tabs/BudgetTab';
import { TimelineTab } from './tabs/TimelineTab';
import { VendorChecklistTab } from './tabs/VendorChecklistTab';
import { PersonalizedIdeasTab } from './tabs/PersonalizedIdeasTab';

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
  const tabRefs = useRef<Map<PlanTabId, HTMLButtonElement | null>>(new Map());

  const completedTasksCount = plan.timeline.tasks.filter((t) => t.completed).length;
  const bookedVendorsCount = plan.vendors.vendors.filter((v) => v.booked).length;

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
      {/* Executive Overview Header */}
      <section
        aria-labelledby="event-overview-title"
        className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200">
                {plan.intake.eventType} Plan
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Created {plan.createdAt.split('T')[0]}
              </span>
            </div>

            <h2
              id="event-overview-title"
              className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900 tracking-tight"
            >
              {plan.intake.eventTitle}
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {plan.executiveSummary}
            </p>

            {/* Quick Metrics Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <Calendar className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>{plan.intake.eventDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <DollarSign className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>
                  {formatCurrency(plan.budget.totalBudget, plan.budget.currency)} {plan.budget.currency}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <Users className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                <span>{plan.intake.guestCount} Guests</span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
                <MapPin className="w-4 h-4 text-rose-600" aria-hidden="true" />
                <span>{plan.intake.location}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 print:hidden">
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" aria-hidden="true" />
              <span>Print Binder View</span>
            </button>
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>Export CSV / JSON</span>
            </button>
          </div>
        </div>
      </section>

      {/* Screen Interactive Tabs */}
      <div className="print:hidden">
        {/* ARIA tablist */}
        <div
          role="tablist"
          aria-label="Event plan sections"
          className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 focus:outline-none"
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
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950'
                        : 'bg-stone-100 text-stone-600'
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
      <div className="hidden print:block space-y-8">
        <div className="border-b-2 border-stone-900 pb-4 mb-6">
          <h2 className="text-xl font-bold font-serif">Comprehensive Event Plan Binder</h2>
          <p className="text-sm text-stone-600">Generated by EventCraft AI</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">1. Budget Allocation Breakdown</h3>
          <BudgetTab
            budget={plan.budget}
            currency={plan.budget.currency}
            onUpdateBudget={onUpdateBudget}
            onOpenRegenerate={() => {}}
          />
        </section>

        <section className="space-y-4 pt-6">
          <h3 className="text-lg font-bold border-b pb-2">2. Timeline & Countdown Milestones</h3>
          <TimelineTab
            timeline={plan.timeline}
            eventDate={plan.intake.eventDate}
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
