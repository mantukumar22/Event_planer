'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Table as TableIcon,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { BudgetPlan, BudgetItem, CurrencyCode } from '@/lib/schemas';
import {
  formatCurrency,
  formatPercentage,
  normalizeBudgetItems,
  updateBudgetItemAmount,
} from '@/lib/budget-math';
import { COLOR_SWATCHES } from '@/lib/constants';

interface BudgetTabProps {
  budget: BudgetPlan;
  currency: CurrencyCode;
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
  onUpdateBudget,
  onOpenRegenerate,
}: BudgetTabProps) {
  const items = budget.items;
  const [activeItem, setActiveItem] = useState<BudgetItem | null>(null);

  const totalAllocated = Math.round(
    items.reduce((sum, item) => sum + item.allocatedAmount, 0) * 100
  ) / 100;
  const difference = Math.round((budget.totalBudget - totalAllocated) * 100) / 100;
  const isExact = Math.abs(difference) <= 0.05;

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

  // SVG Donut Chart Calculations
  const radius = 80;
  const strokeWidth = 30;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = calculateChartSegments(items, budget.totalBudget, circumference);

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Summary */}
      <div className="royal-glass rounded-3xl p-5 sm:p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--gold)]/30">
              Budget Allocation
            </span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                isExact
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isExact ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>100% Balanced ({formatCurrency(budget.totalBudget, currency)})</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {difference > 0
                      ? `${formatCurrency(difference, currency)} Unallocated`
                      : `${formatCurrency(Math.abs(difference), currency)} Over Budget`}
                  </span>
                </>
              )}
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            {budget.summary}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {!isExact && (
            <button
              type="button"
              onClick={handleAutoBalance}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/40 text-white text-xs font-bold transition-all border border-[var(--royal)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
              title="Automatically adjust line items to match the exact total budget"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Auto-Balance</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRegenerate}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/40 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)] cursor-pointer ml-auto md:ml-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
            <span>Regenerate with Instructions</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart + Line Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Donut Chart Card */}
        <div className="lg:col-span-5 royal-glass rounded-3xl p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-[var(--royal)]/20 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
              <span>Allocation Breakdown</span>
            </h3>
            <span className="text-xs text-[var(--muted)]">High Contrast SVG</span>
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
                  <span className="text-xs text-[var(--gold)] font-medium">{items.length} Categories</span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend with Keyboard Support */}
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
                  className={`flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    activeItem?.id === item.id
                      ? 'bg-[var(--surface-2)] ring-1 ring-[var(--gold)]'
                      : 'hover:bg-[var(--surface-2)]/60'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color || COLOR_SWATCHES[idx % COLOR_SWATCHES.length] }}
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-white truncate" title={item.category}>
                    {item.category}
                  </span>
                  <span className="ml-auto font-bold text-[var(--muted)]">
                    {formatPercentage(item.percentage)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Editable Line Items & Accessible Data Table */}
        <div className="lg:col-span-7 royal-glass rounded-3xl p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--royal)]/20 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                <span>Line Items & Live Adjustments</span>
              </h3>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Edit any amount directly. Recalculates live.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[var(--muted)] block">Total Allocated</span>
              <span
                className={`text-sm font-black ${
                  isExact ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCurrency(totalAllocated, currency)} / {formatCurrency(budget.totalBudget, currency)}
              </span>
            </div>
          </div>

          {/* Accessible Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-left text-xs sm:text-sm text-[var(--text)] border-collapse"
              aria-label="Editable budget category allocation table"
            >
              <thead>
                <tr className="border-b border-[var(--royal)]/25 text-[var(--muted)] font-bold text-[11px] uppercase tracking-wider bg-[var(--surface-2)]/50">
                  <th scope="col" className="py-2.5 px-3">
                    Category
                  </th>
                  <th scope="col" className="py-2.5 px-2 text-right">
                    Share
                  </th>
                  <th scope="col" className="py-2.5 px-3 text-right">
                    Amount ({currency})
                  </th>
                  <th scope="col" className="py-2.5 px-3 hidden sm:table-cell">
                    Guidance & Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--royal)]/15">
                {items.map((item, idx) => {
                  const inputId = `budget-item-${item.id}`;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[var(--surface-2)]/70 transition-colors group"
                    >
                      <th
                        scope="row"
                        className="py-3 px-3 font-bold text-white flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color || COLOR_SWATCHES[idx % COLOR_SWATCHES.length] }}
                          aria-hidden="true"
                        />
                        <span>{item.category}</span>
                      </th>

                      <td className="py-3 px-2 text-right font-medium text-[var(--muted)] text-xs sm:text-sm">
                        {formatPercentage(item.percentage)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          <label htmlFor={inputId} className="sr-only">
                            Allocated amount for {item.category}
                          </label>
                          <input
                            id={inputId}
                            type="number"
                            min="0"
                            step="10"
                            value={item.allocatedAmount}
                            onChange={(e) =>
                              handleAmountChange(item.id, parseFloat(e.target.value) || 0)
                            }
                            className="w-24 sm:w-28 text-right px-2.5 py-1.5 rounded-lg border border-[var(--royal)]/40 font-bold text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:border-[var(--gold)] bg-[var(--surface-2)]"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-[var(--muted)] text-xs hidden sm:table-cell max-w-xs">
                        <span className="line-clamp-2" title={item.notes}>
                          {item.notes}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-[var(--royal)]/30 font-bold bg-[var(--surface-2)]/60 text-white">
                  <th scope="row" className="py-3 px-3">
                    Total
                  </th>
                  <td className="py-3 px-2 text-right">
                    {formatPercentage(
                      items.reduce((acc, curr) => acc + curr.percentage, 0)
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-[var(--gold)] font-display">
                    {formatCurrency(totalAllocated, currency)}
                  </td>
                  <td className="py-3 px-3 text-xs text-[var(--muted)] hidden sm:table-cell">
                    Buffer: {formatCurrency(budget.contingencyAmount, currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
