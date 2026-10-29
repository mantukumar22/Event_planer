'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  HelpCircle,
  Scale,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { VendorPlan, VendorItem } from '@/lib/schemas';

interface VendorChecklistTabProps {
  vendors: VendorPlan;
  onUpdateVendors: (updated: VendorPlan) => void;
  onOpenRegenerate: () => void;
}

export function VendorChecklistTab({
  vendors,
  onUpdateVendors,
  onOpenRegenerate,
}: VendorChecklistTabProps) {
  const items = vendors.vendors;
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(vendors.vendors.slice(0, 2).map((v) => v.id))
  );

  const bookedCount = items.filter((v) => v.booked).length;
  const totalCount = items.length;

  const handleToggleBooked = (id: string) => {
    const updated = items.map((v) => {
      if (v.id === id) {
        return { ...v, booked: !v.booked };
      }
      return v;
    });

    onUpdateVendors({
      ...vendors,
      vendors: updated,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Vendor Sourcing Roadmap
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
              {bookedCount} of {totalCount} Booked
            </span>
          </div>

          <p className="mt-2 text-sm text-stone-600 max-w-2xl">
            Key questions to ask during interviews, specific metrics to compare competing bids, and estimated market price ranges.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ml-auto md:ml-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Regenerate Vendor Checklist</span>
        </button>
      </div>

      {/* Vendor Cards */}
      <div className="grid grid-cols-1 gap-4">
        {items.map((vendor) => {
          const isExpanded = expandedIds.has(vendor.id);
          const checkboxId = `vendor-checkbox-${vendor.id}`;

          return (
            <div
              key={vendor.id}
              className={`bg-white rounded-2xl border transition-all shadow-xs ${
                vendor.booked
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={vendor.booked}
                    onChange={() => handleToggleBooked(vendor.id)}
                    className="w-5 h-5 rounded-md border-stone-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                    aria-label={`Mark ${vendor.vendorRole} as ${vendor.booked ? 'not booked' : 'booked'}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={checkboxId}
                        className={`font-bold text-sm sm:text-base cursor-pointer ${
                          vendor.booked ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {vendor.vendorRole}
                      </label>
                      <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                        {vendor.category}
                      </span>
                      {vendor.booked && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          Booked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-xl">
                    Est. {vendor.estimatedCostRange}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleExpand(vendor.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`vendor-details-${vendor.id}`}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                    title={isExpanded ? 'Collapse vendor questionnaire' : 'Expand vendor questionnaire'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Questions & Comparison Details */}
              {isExpanded && (
                <div
                  id={`vendor-details-${vendor.id}`}
                  className="px-5 pb-5 pt-2 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Questions to ask */}
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      <span>Essential Questions to Ask</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                      {vendor.questionsToAsk.map((q, i) => (
                        <li key={i} className="leading-relaxed">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Comparison Criteria */}
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5 mb-2.5">
                      <Scale className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                      <span>What to Compare in Quotes</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                      {vendor.comparisonCriteria.map((c, i) => (
                        <li key={i} className="leading-relaxed">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
