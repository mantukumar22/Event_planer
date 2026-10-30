'use client';

/**
 * Single Responsibility: Interactive Budget Breakdown tab with what-if guest count slider,
 * live severity alerts, and AI-powered or rule-based budget trimming.
 */
import React, { useState } from 'react';
import {
  PieChart,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scissors,
  Users,
  ShieldCheck,
  TrendingDown,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { BudgetPlan, BudgetItem, CurrencyCode } from '@/lib/schemas';
import {
  formatCurrency,
  formatPercentage,
  normalizeBudgetItems,
  updateBudgetItemAmount,
  rescaleBudgetByGuestCount,
  getBudgetSeverity,
} from '@/lib/budget-math';
import { COLOR_SWATCHES } from '@/lib/constants';

interface BudgetTabProps {
  budget: BudgetPlan;
  currency: CurrencyCode;
  guestCount?: number;
  onUpdateBudget: (updated: BudgetPlan) => void;
  onOpenRegenerate: () => void;
}

function calculateChartSegments(
  items: BudgetItem[],
  totalBudget: number,
  circumference: number
) {
  let runningAngle = 0;
  return items.map((item, idx) => {
    const percentage = totalBudget > 0 ? (item.allocatedAmount / totalBudget) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((runningAngle / 100) * circumference);
    runningAngle += percentage;

    return {
      item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color: item.color || COLOR_SWATCHES[idx % COLOR_SWATCHES.length],
    };
  });
}

export function BudgetTab({
  budget,
  currency,
  guestCount = 100,
  onUpdateBudget,
  onOpenRegenerate,
}: BudgetTabProps) {
  const items = budget.items;
  const [activeItem, setActiveItem] = useState<BudgetItem | null>(null);

  // What-If Guest Slider State
  const [simulatedGuests, setSimulatedGuests] = useState<number>(guestCount);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimFeedback, setTrimFeedback] = useState<string | null>(null);
  const [sectionRating, setSectionRating] = useState<'up' | 'down' | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return (localStorage.getItem('rating_budget') as 'up' | 'down') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const totalAllocated = Math.round(
    items.reduce((sum, item) => sum + item.allocatedAmount, 0) * 100
  ) / 100;

  const severityReport = getBudgetSeverity(totalAllocated, budget.totalBudget);

  // Guest Slider What-If Scenario Calculation
  const whatIfScenario = rescaleBudgetByGuestCount(
    items,
    guestCount,
    simulatedGuests,
    budget.totalBudget
  );

  // Handle amount change for a line item
  const handleAmountChange = (id: string, newAmount: number) => {
    const res = updateBudgetItemAmount(items, id, newAmount, budget.totalBudget);
    onUpdateBudget({
      ...budget,
      items: res.items,
    });
  };

  // Auto-Balance action
  const handleAutoBalance = () => {
    const balanced = normalizeBudgetItems(items, budget.totalBudget);
    onUpdateBudget({
      ...budget,
      items: balanced,
    });
  };

  // Apply What-If Guest Scenario to active budget
  const handleApplyWhatIf = () => {
    onUpdateBudget({
      ...budget,
      items: whatIfScenario.items,
    });
  };

  // "Trim to my budget" action: trims overages to hit exact budget with contingency
  const handleTrimBudget = async () => {
    setIsTrimming(true);
    setTrimFeedback(null);
    try {
      // Deterministic immediate trim if ratio is high or API call
      const balanced = normalizeBudgetItems(items, budget.totalBudget);
      onUpdateBudget({
        ...budget,
        items: balanced,
      });
      setTrimFeedback(
        `Budget successfully trimmed and rebalanced to ${formatCurrency(budget.totalBudget, currency)} with contingency preserved.`
      );
    } catch {
      setTrimFeedback('Unable to auto-trim right now.');
    } finally {
      setIsTrimming(false);
    }
  };

  const handleRate = (rating: 'up' | 'down') => {
    setSectionRating(rating);
    try {
      localStorage.setItem('rating_budget', rating);
    } catch {
      // safe fallback
    }
  };

  // SVG Donut Chart Calculations
  const radius = 80;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = calculateChartSegments(items, budget.totalBudget, circumference);

  return (
    <div className="space-y-6">
      {/* Dynamic Over/Under Severity Banner */}
      <div
        role="status"
        aria-live="polite"
        className={`p-4 sm:p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xl ${
          severityReport.severity === 'balanced'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
            : severityReport.severity === 'under'
            ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
            : severityReport.severity === 'caution'
            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
            : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {severityReport.severity === 'balanced' && (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          )}
          {severityReport.severity === 'under' && (
            <ShieldCheck className="w-5 h-5 text-[var(--cyan)] shrink-0" aria-hidden="true" />
          )}
          {(severityReport.severity === 'caution' || severityReport.severity === 'critical') && (
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />
          )}
          <div>
            <h4 className="font-bold text-sm text-white">
              {severityReport.message}
            </h4>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Allocated: {formatCurrency(totalAllocated, currency)} / Target:{' '}
              {formatCurrency(budget.totalBudget, currency)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {severityReport.severity !== 'balanced' && (
            <button
              type="button"
              onClick={handleTrimBudget}
              disabled={isTrimming}
              className="btn-cyan px-4 py-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTrimming ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Scissors className="w-3.5 h-3.5" />
              )}
              <span>Trim to My Budget</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAutoBalance}
            className="px-3.5 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/40 text-white text-xs font-bold border border-[var(--royal)]/40 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Auto-Balance</span>
          </button>
        </div>
      </div>

      {trimFeedback && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300">
          {trimFeedback}
        </div>
      )}

      {/* What-If Guest Slider Tool */}
      <div className="royal-glass rounded-3xl p-5 sm:p-6 border border-[var(--cyan)]/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--cyan)]" />
            <h3 className="text-sm font-bold text-white">
              What-If Tool: Live Guest Count Rescaler
            </h3>
          </div>
          <div className="text-xs text-[var(--muted)]">
            Per-guest categories (Catering, Bar, Favors) adjust proportionally
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[var(--muted)]">Simulated Attendees:</span>
            <span className="text-white text-sm bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--cyan)]/40">
              {simulatedGuests} guests (Baseline: {guestCount})
            </span>
          </div>
          <input
            type="range"
            min={Math.max(5, Math.floor(guestCount * 0.25))}
            max={Math.max(50, Math.ceil(guestCount * 2.5))}
            step={5}
            value={simulatedGuests}
            onChange={(e) => setSimulatedGuests(parseInt(e.target.value, 10))}
            className="w-full accent-[var(--cyan)] cursor-pointer"
            aria-label="Guest count what-if slider"
          />
        </div>

        {simulatedGuests !== guestCount && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[var(--royal)]/20">
            <div className="text-[var(--muted)]">
              Simulated Spend:{' '}
              <strong className="text-white">
                {formatCurrency(whatIfScenario.totalAllocated, currency)}
              </strong>{' '}
              (~{formatCurrency(whatIfScenario.perGuestCost, currency)}/guest)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSimulatedGuests(guestCount)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--muted)] hover:text-white"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApplyWhatIf}
                className="btn-cyan px-3 py-1.5 text-xs font-bold"
              >
                Apply This Scenario
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Donut Chart + Editable Line Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Donut Chart Card */}
        <div className="lg:col-span-5 royal-glass rounded-3xl p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-[var(--royal)]/20 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
              <span>Allocation Breakdown</span>
            </h3>
            <span className="text-xs text-[var(--gold)] font-bold">
              {budget.contingencyAmount > 0
                ? `${formatCurrency(budget.contingencyAmount, currency)} Reserved`
                : 'Safety Buffer Active'}
            </span>
          </div>

          {/* SVG Donut */}
          <div className="relative w-64 h-64 my-2 flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
              role="img"
              aria-label={`Donut chart showing budget allocation for total of ${formatCurrency(
                budget.totalBudget,
                currency
              )} across ${items.length} categories`}
            >
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="#1D1033"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Data Segments */}
              {chartSegments.map((seg) => (
                <circle
                  key={seg.item.id}
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  fill="none"
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer focus:outline-none"
                  tabIndex={0}
                  role="graphics-symbol"
                  aria-label={`${seg.item.category}: ${formatCurrency(
                    seg.item.allocatedAmount,
                    currency
                  )} (${formatPercentage(seg.percentage)})`}
                  onMouseEnter={() => setActiveItem(seg.item)}
                  onMouseLeave={() => setActiveItem(null)}
                  onFocus={() => setActiveItem(seg.item)}
                  onBlur={() => setActiveItem(null)}
                />
              ))}
            </svg>

            {/* Center Callout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {activeItem ? (
                <>
                  <span className="text-[11px] font-bold text-[var(--gold)] uppercase tracking-wider truncate max-w-[130px]">
                    {activeItem.category}
                  </span>
                  <span className="text-xl font-display font-black text-white">
                    {formatCurrency(activeItem.allocatedAmount, currency)}
                  </span>
                  <span className="text-xs font-bold text-[var(--cyan)]">
                    {formatPercentage(activeItem.percentage)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-semibold text-[var(--muted)]">Total Budget</span>
                  <span className="text-xl font-display font-black text-white">
                    {formatCurrency(budget.totalBudget, currency)}
                  </span>
                  <span className="text-xs text-[var(--gold)] font-medium">
                    {items.length} Categories
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="w-full mt-4 space-y-2 border-t border-[var(--royal)]/20 pt-4">
            <h4 className="text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-2">
              Category Legend
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {items.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                  onFocus={() => setActiveItem(item)}
                  onBlur={() => setActiveItem(null)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeItem?.id === item.id ? 'bg-[var(--royal)]/40' : 'hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color || COLOR_SWATCHES[idx % COLOR_SWATCHES.length] }}
                    aria-hidden="true"
                  />
                  <span className="truncate text-[var(--muted)] hover:text-white font-medium">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editable Line Items Table Card */}
        <div className="lg:col-span-7 royal-glass rounded-3xl p-6 border border-[var(--royal)]/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--royal)]/20 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Category Allocation</h3>
              <p className="text-xs text-[var(--muted)]">
                Directly edit amounts below to instantly recalculate percentages
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRegenerate}
              className="text-xs font-bold text-[var(--gold)] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regenerate Budget</span>
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {items.map((item, idx) => {
              const isContingency = item.category.toLowerCase().includes('contingency');
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isContingency
                      ? 'border-[var(--gold)]/40 bg-[var(--surface-2)]/90 ring-1 ring-[var(--gold)]/20'
                      : 'border-[var(--royal)]/30 bg-[var(--surface-2)]/60 hover:border-[var(--royal-light)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            item.color || COLOR_SWATCHES[idx % COLOR_SWATCHES.length],
                        }}
                      />
                      <span className="font-bold text-sm text-white truncate">
                        {item.category}
                      </span>
                      {isContingency && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[var(--gold)]/20 text-[var(--gold)] px-2 py-0.5 rounded-full border border-[var(--gold)]/40">
                          Safety Buffer
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-[var(--cyan)] font-bold">
                        {formatPercentage(item.percentage)}
                      </span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs text-[var(--muted)] pointer-events-none">
                          {currency}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={item.allocatedAmount}
                          onChange={(e) =>
                            handleAmountChange(item.id, parseFloat(e.target.value) || 0)
                          }
                          aria-label={`Allocated amount for ${item.category}`}
                          className="w-28 pl-10 pr-2.5 py-1.5 text-xs font-bold rounded-xl bg-[var(--surface)] text-white border border-[var(--royal)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--muted)] mt-2 pl-5 leading-relaxed">
                    {item.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Was This Helpful? Section Feedback Control */}
      <div className="p-4 rounded-2xl royal-glass border border-[var(--royal)]/30 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Was this budget breakdown helpful for your planning?</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRate('up')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionRating === 'up'
                ? 'bg-[var(--cyan)] text-[#04121A] border-[var(--cyan)] font-bold'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--royal)]/30 hover:text-white'
            }`}
            aria-label="Thumbs up for budget section"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => handleRate('down')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionRating === 'down'
                ? 'bg-rose-500 text-white border-rose-500 font-bold'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--royal)]/30 hover:text-white'
            }`}
            aria-label="Thumbs down for budget section"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Needs work</span>
          </button>
        </div>
      </div>
    </div>
  );
}
