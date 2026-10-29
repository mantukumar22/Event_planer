'use client';

import React, { useState, useId } from 'react';
import {
  DollarSign,
  PieChart,
  Table as TableIcon,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { BudgetPlan, BudgetItem, CurrencyCode } from '@/lib/schemas';
import {
  formatCurrency,
  formatPercentage,
  isBudgetSumAccurate,
  normalizeBudgetItems,
  updateBudgetItemAmount,
} from '@/lib/budget-math';

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
  return items.map((item) => {
    const percentage = totalBudget > 0 ? (item.allocatedAmount / totalBudget) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((runningAngle / 100) * circumference);
    runningAngle += percentage;

    return {
      item,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      color: item.color || '#6366F1',
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
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = calculateChartSegments(items, budget.totalBudget, circumference);

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Summary */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Budget Allocation
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isExact
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
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

          <p className="mt-2 text-sm text-stone-600 max-w-2xl">
            {budget.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {!isExact && (
            <button
              type="button"
              onClick={handleAutoBalance}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              title="Automatically adjust line items to match the exact total budget"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Auto-Balance</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenRegenerate}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ml-auto md:ml-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Regenerate with Instructions</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chart + Line Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Donut Chart Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Allocation Breakdown</span>
            </h3>
            <span className="text-xs text-stone-500">Pure SVG • High Contrast</span>
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
                className="stroke-stone-100"
                strokeWidth={strokeWidth}
                fill="none"
              />

              {/* Data Segments */}
              {chartSegments.map((seg, i) => (
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
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider truncate max-w-[130px]">
                    {activeItem.category}
                  </span>
                  <span className="text-xl font-extrabold text-stone-900 font-serif">
                    {formatCurrency(activeItem.allocatedAmount, currency)}
                  </span>
                  <span className="text-xs font-semibold text-amber-600">
                    {formatPercentage(activeItem.percentage)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xs font-medium text-stone-500">Total Budget</span>
                  <span className="text-xl font-extrabold text-stone-900 font-serif">
                    {formatCurrency(budget.totalBudget, currency)}
                  </span>
                  <span className="text-xs text-stone-500">{items.length} Categories</span>
                </>
              )}
            </div>
          </div>

          {/* Interactive Legend with Keyboard Support */}
          <div className="w-full mt-4 space-y-2 border-t border-stone-100 pt-4">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Category Legend
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveItem(item)}
                  onMouseLeave={() => setActiveItem(null)}
                  onFocus={() => setActiveItem(item)}
                  onBlur={() => setActiveItem(null)}
                  className={`flex items-center gap-2 p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    activeItem?.id === item.id ? 'bg-stone-100 ring-1 ring-stone-300' : 'hover:bg-stone-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: item.color || '#6366F1' }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-stone-800 truncate" title={item.category}>
                    {item.category}
                  </span>
                  <span className="ml-auto font-bold text-stone-600">
                    {formatPercentage(item.percentage)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Editable Line Items & Accessible Data Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <span>Line Items & Live Adjustments</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Edit any amount directly. Recalculates live.
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-stone-500 block">Total Allocated</span>
              <span
                className={`text-sm font-bold ${
                  isExact ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {formatCurrency(totalAllocated, currency)} / {formatCurrency(budget.totalBudget, currency)}
              </span>
            </div>
          </div>

          {/* Accessible Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-left text-xs sm:text-sm text-stone-800 border-collapse"
              aria-label="Editable budget category allocation table"
            >
              <thead>
                <tr className="border-b border-stone-200 text-stone-600 font-semibold text-[11px] uppercase tracking-wider bg-stone-50/50">
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
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => {
                  const inputId = `budget-item-${item.id}`;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 transition-colors group"
                    >
                      <th
                        scope="row"
                        className="py-3 px-3 font-semibold text-stone-900 flex items-center gap-2 text-xs sm:text-sm"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color || '#6366F1' }}
                          aria-hidden="true"
                        />
                        <span>{item.category}</span>
                      </th>

                      <td className="py-3 px-2 text-right font-medium text-stone-600 text-xs sm:text-sm">
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
                            className="w-24 sm:w-28 text-right px-2.5 py-1.5 rounded-lg border border-stone-300 font-semibold text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50 focus:bg-white"
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-stone-500 text-xs hidden sm:table-cell max-w-xs">
                        <span className="line-clamp-2" title={item.notes}>
                          {item.notes}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-stone-300 font-bold bg-stone-50">
                  <th scope="row" className="py-3 px-3 text-stone-900">
                    Total
                  </th>
                  <td className="py-3 px-2 text-right text-stone-900">
                    {formatPercentage(
                      items.reduce((acc, curr) => acc + curr.percentage, 0)
                    )}
                  </td>
                  <td className="py-3 px-3 text-right text-stone-900 font-serif">
                    {formatCurrency(totalAllocated, currency)}
                  </td>
                  <td className="py-3 px-3 text-xs text-stone-500 hidden sm:table-cell">
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
