'use client';

import React, { useState } from 'react';
import { Sparkles, X, Loader2, AlertCircle } from 'lucide-react';
import { PlanTabId } from '@/lib/types';
import { CrownIcon } from './CrownIcon';

interface RegenerateModalProps {
  isOpen: boolean;
  activeTab: PlanTabId;
  onClose: () => void;
  onConfirm: (section: PlanTabId, instruction: string) => Promise<void>;
}

export function RegenerateModal({
  isOpen,
  activeTab,
  onClose,
  onConfirm,
}: RegenerateModalProps) {
  const [section, setSection] = useState<PlanTabId>(activeTab);
  const [instruction, setInstruction] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const sectionLabels: Record<PlanTabId, string> = {
    budget: 'Budget Allocation',
    timeline: 'Timeline & Milestones',
    vendors: 'Vendor Checklist',
    ideas: 'Personalized Ideas & Menu',
  };

  const samplePrompts: Record<PlanTabId, string[]> = {
    budget: [
      'Reduce catering by 15% and reallocate towards live music.',
      'Add a dedicated contingency buffer and adjust other items down.',
      'Shift more allocation into photography and florals.',
    ],
    timeline: [
      'Compress schedule for an event happening in 6 weeks.',
      'Add more checkpoints for DIY crafts and decor assembly.',
      'Include rehearsals and welcome dinner milestones.',
    ],
    vendors: [
      'Focus heavily on eco-friendly and zero-waste vendors.',
      'Include specific questions for self-catered alcohol and BYOB.',
      'Add specific questions for outdoor weather backup tents.',
    ],
    ideas: [
      'Suggest more high-energy interactive games for guests.',
      'Incorporate autumn harvest flavors and hot spiced cider cocktails.',
      'Include more kid-friendly and family entertainment activities.',
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) {
      setError('Please provide instructions for the AI planner.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await onConfirm(section, instruction.trim());
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to regenerate section.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="regenerate-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0612]/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="royal-glass rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[var(--royal)]/40 text-[var(--text)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--royal)]/25 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--gold)]/40 text-[var(--gold)]">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="regenerate-modal-title" className="text-base font-display font-bold text-white">
                Regenerate Plan Section
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Refine a single component with bespoke guidelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--muted)] hover:text-white hover:bg-[var(--surface-2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section Selector */}
          <div>
            <label
              htmlFor="target-section-select"
              className="block text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-1.5"
            >
              Choose Section to Revise
            </label>
            <select
              id="target-section-select"
              value={section}
              onChange={(e) => {
                setSection(e.target.value as PlanTabId);
                setInstruction('');
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40"
            >
              <option value="budget">Budget Allocation</option>
              <option value="timeline">Timeline & Milestones</option>
              <option value="vendors">Vendor Checklist</option>
              <option value="ideas">Personalized Ideas & Menu</option>
            </select>
          </div>

          {/* Quick Prompts */}
          <div>
            <span className="text-xs font-bold text-[var(--muted)] block mb-2">
              Quick Suggestions:
            </span>
            <div className="flex flex-col gap-2">
              {samplePrompts[section]?.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(prompt)}
                  className="text-left text-xs p-2.5 rounded-xl bg-[var(--surface-2)]/80 hover:bg-[var(--surface-2)] border border-[var(--royal)]/30 hover:border-[var(--gold)]/40 text-[var(--text)] transition-colors cursor-pointer"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Prompt input */}
          <div>
            <label
              htmlFor="regenerate-instruction"
              className="block text-xs font-bold text-[var(--gold)] uppercase tracking-wider mb-1.5"
            >
              Your Custom Instruction <span className="text-[var(--cyan)]">*</span>
            </label>
            <textarea
              id="regenerate-instruction"
              rows={3}
              value={instruction}
              onChange={(e) => {
                setInstruction(e.target.value);
                if (error) setError(null);
              }}
              placeholder={`e.g. Make the ${sectionLabels[section].toLowerCase()} more budget-conscious and add outdoor contingency options.`}
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/40 placeholder-[var(--muted)]/50 resize-y overflow-y-auto"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 text-rose-300 border border-rose-500/30 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--royal)]/25">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-[var(--muted)] hover:text-white bg-[var(--surface-2)] hover:bg-[var(--surface-2)]/80 rounded-xl transition-colors cursor-pointer border border-[var(--royal)]/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !instruction.trim()}
              className="btn-cyan px-5 py-2.5 text-xs font-black cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#04121A]" aria-hidden="true" />
                  <span>Revising Section...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#04121A]" aria-hidden="true" />
                  <span>Generate Revisions</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
