'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Scale,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { VendorPlan } from '@/lib/schemas';

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
      <div className="royal-glass rounded-3xl p-5 sm:p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--gold)]/30">
              Vendor Sourcing Roadmap
            </span>
            <span className="text-xs font-semibold text-[var(--cyan)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--cyan)]/30">
              {bookedCount} of {totalCount} Booked
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Key questions to ask during interviews, specific metrics to compare competing bids, and estimated market price ranges.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/40 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)] cursor-pointer ml-auto md:ml-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" aria-hidden="true" />
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
              className={`royal-glass rounded-3xl border transition-all shadow-md ${
                vendor.booked
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-[var(--royal)]/30 hover:border-[var(--gold)]/40'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={vendor.booked}
                    onChange={() => handleToggleBooked(vendor.id)}
                    className="w-5 h-5 rounded-md border-[var(--royal)]/40 text-emerald-500 focus:ring-emerald-400 cursor-pointer shrink-0"
                    aria-label={`Mark ${vendor.vendorRole} as ${vendor.booked ? 'not booked' : 'booked'}`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label
                        htmlFor={checkboxId}
                        className={`font-display font-bold text-sm sm:text-base cursor-pointer ${
                          vendor.booked ? 'line-through text-[var(--muted)]' : 'text-white'
                        }`}
                      >
                        {vendor.vendorRole}
                      </label>
                      <span className="text-xs font-semibold text-[var(--muted)] bg-[var(--surface-2)] px-3 py-0.5 rounded-full border border-[var(--royal)]/25">
                        {vendor.category}
                      </span>
                      {vendor.booked && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                          Booked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs sm:text-sm font-black text-[var(--cyan)] bg-[var(--surface-2)] px-3.5 py-1.5 rounded-xl border border-[var(--cyan)]/30">
                    Est. {vendor.estimatedCostRange}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleExpand(vendor.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`vendor-details-${vendor.id}`}
                    className="p-2 rounded-xl text-[var(--muted)] hover:text-white hover:bg-[var(--surface-2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
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
                  className="px-6 pb-6 pt-2 border-t border-[var(--royal)]/20 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {/* Questions to ask */}
                  <div className="p-4 rounded-2xl bg-[var(--surface-2)]/70 border border-[var(--gold)]/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] flex items-center gap-1.5 mb-2.5">
                      <HelpCircle className="w-4 h-4 text-[var(--gold)]" aria-hidden="true" />
                      <span>Essential Questions to Ask</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[var(--text)] list-disc list-inside">
                      {vendor.questionsToAsk.map((q, i) => (
                        <li key={i} className="leading-relaxed">
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Comparison Criteria */}
                  <div className="p-4 rounded-2xl bg-[var(--surface-2)]/70 border border-[var(--cyan)]/30">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--cyan)] flex items-center gap-1.5 mb-2.5">
                      <Scale className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
                      <span>What to Compare in Quotes</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[var(--text)] list-disc list-inside">
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
