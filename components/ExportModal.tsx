'use client';

import React from 'react';
import { Download, FileText, Table, Printer, X, Check } from 'lucide-react';
import { EventPlan } from '@/lib/schemas';
import { exportPlanAsCsv, exportPlanAsJson } from '@/lib/export-utils';
import { CrownIcon } from './CrownIcon';

interface ExportModalProps {
  isOpen: boolean;
  plan: EventPlan;
  onClose: () => void;
  onPrint: () => void;
}

export function ExportModal({
  isOpen,
  plan,
  onClose,
  onPrint,
}: ExportModalProps) {
  const [downloadedFormat, setDownloadedFormat] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCsv = () => {
    exportPlanAsCsv(plan);
    setDownloadedFormat('csv');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  const handleJson = () => {
    exportPlanAsJson(plan);
    setDownloadedFormat('json');
    setTimeout(() => setDownloadedFormat(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0612]/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="royal-glass rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[var(--royal)]/40 text-[var(--text)]">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--royal)]/25 mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--cyan)]/40 text-[var(--cyan)]">
              <Download className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="export-modal-title" className="text-base font-display font-bold text-white">
                Export & Share Plan
              </h3>
              <p className="text-xs text-[var(--muted)]">Download formatted reports or print</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--muted)] hover:text-white hover:bg-[var(--surface-2)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3.5">
          {/* Option 1: CSV Spreadsheet */}
          <button
            type="button"
            onClick={handleCsv}
            className="w-full text-left p-4 rounded-2xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/60 bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
          >
            <span className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--cyan)] border border-[var(--cyan)]/30 group-hover:scale-105 transition-all shrink-0">
              <Table className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="flex items-center justify-between">
                <span className="font-bold text-sm text-white group-hover:text-[var(--cyan)] transition-colors">
                  CSV Spreadsheet (.csv)
                </span>
                {downloadedFormat === 'csv' && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Downloaded
                  </span>
                )}
              </span>
              <span className="text-xs text-[var(--muted)] mt-1 block leading-relaxed">
                Multi-section formatted sheet for Excel, Google Sheets, or Numbers. Includes Budget, Timeline, and Vendors.
              </span>
            </span>
          </button>

          {/* Option 2: JSON Backup */}
          <button
            type="button"
            onClick={handleJson}
            className="w-full text-left p-4 rounded-2xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/60 bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
          >
            <span className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--magenta)] border border-[var(--magenta)]/30 group-hover:scale-105 transition-all shrink-0">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="flex items-center justify-between">
                <span className="font-bold text-sm text-white group-hover:text-[var(--magenta)] transition-colors">
                  Structured JSON (.json)
                </span>
                {downloadedFormat === 'json' && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Downloaded
                  </span>
                )}
              </span>
              <span className="text-xs text-[var(--muted)] mt-1 block leading-relaxed">
                Full machine-readable event plan with complete type schema, inputs, and customized allocations.
              </span>
            </span>
          </button>

          {/* Option 3: Printable View */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onPrint();
            }}
            className="w-full text-left p-4 rounded-2xl border border-[var(--royal)]/30 hover:border-[var(--gold)]/60 bg-[var(--surface-2)]/70 hover:bg-[var(--surface-2)] transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--cyan)]"
          >
            <span className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--gold)] border border-[var(--gold)]/30 group-hover:scale-105 transition-all shrink-0">
              <Printer className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="font-bold text-sm text-white group-hover:text-[var(--gold)] transition-colors block">
                Printable Executive View / PDF
              </span>
              <span className="text-xs text-[var(--muted)] mt-1 block leading-relaxed">
                Formats the entire multi-section plan into a clean document binder ready for printing or saving as PDF.
              </span>
            </span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--royal)]/25 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white hover:text-[var(--gold)] bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 rounded-xl transition-colors cursor-pointer border border-[var(--royal)]/30"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
