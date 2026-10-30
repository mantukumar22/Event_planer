'use client';

/**
 * Single Responsibility: Interactive Vendor Checklist tab with criteria comparisons,
 * booking progress tracking, and local section feedback.
 */
import React, { useState } from 'react';
import {
  HelpCircle,
  Scale,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
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
  const [sectionRating, setSectionRating] = useState<'up' | 'down' | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return (localStorage.getItem('rating_vendors') as 'up' | 'down') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

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

  const handleRate = (rating: 'up' | 'down') => {
    setSectionRating(rating);
    try {
      localStorage.setItem('rating_vendors', rating);
    } catch {
      // safe fallback
    }
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
            <span className="text-xs font-semibold text-emerald-400 bg-[var(--surface-2)] px-3 py-1 rounded-full border border-emerald-500/30">
              {bookedCount} of {totalCount} Booked
            </span>
          </div>

          <p className="mt-2.5 text-sm text-[var(--muted)] max-w-2xl leading-relaxed">
            Interview questions and contract comparison criteria curated specifically for your event scale and vibe.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/40 text-xs font-bold transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Regenerate Vendors</span>
        </button>
      </div>

      {/* General Sourcing Tips */}
      {vendors.tips && vendors.tips.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--surface-2)]/60 border border-[var(--royal)]/30">
          <h4 className="text-xs font-bold text-[var(--cyan)] uppercase tracking-wider mb-2">
            Pro Vendor Sourcing Strategy
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[var(--text)]">
            {vendors.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[var(--gold)] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vendors List */}
      <div className="space-y-4">
        {items.map((vendor) => {
          const isExpanded = expandedIds.has(vendor.id);
          return (
            <div
              key={vendor.id}
              className={`rounded-3xl royal-glass border transition-all ${
                vendor.booked
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-[var(--royal)]/30 hover:border-[var(--royal-light)] shadow-lg'
              }`}
            >
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    id={`booked-${vendor.id}`}
                    checked={vendor.booked}
                    onChange={() => handleToggleBooked(vendor.id)}
                    className="w-5 h-5 mt-1 rounded text-[var(--cyan)] border-[var(--royal)]/40 bg-[var(--surface)] focus:ring-[var(--cyan)] cursor-pointer"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={`booked-${vendor.id}`}
                        className={`font-bold text-base cursor-pointer ${
                          vendor.booked ? 'line-through text-[var(--muted)]' : 'text-white'
                        }`}
                      >
                        {vendor.category}
                      </label>
                      {vendor.booked && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Booked & Confirmed
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--gold)] font-semibold mt-1">
                      Estimated Cost: {vendor.estimatedCostRange}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => toggleExpand(vendor.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--surface-2)] text-xs font-semibold text-[var(--cyan)] border border-[var(--royal)]/40 hover:border-[var(--cyan)] transition-colors cursor-pointer"
                    aria-expanded={isExpanded}
                    aria-controls={`vendor-details-${vendor.id}`}
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Criteria & Questions'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

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

      {/* Was This Helpful? Local Feedback Control */}
      <div className="p-4 rounded-2xl royal-glass border border-[var(--royal)]/30 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Was this vendor checklist helpful?</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRate('up')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionRating === 'up'
                ? 'bg-[var(--cyan)] text-[#04121A] border-[var(--cyan)] font-bold'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--royal)]/30 hover:text-white'
            }`}
            aria-label="Thumbs up for vendor checklist section"
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
            aria-label="Thumbs down for vendor checklist section"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Needs work</span>
          </button>
        </div>
      </div>
    </div>
  );
}
