'use client';

import React from 'react';
import { Download, FileText, Table, Printer, X, Check } from 'lucide-react';
import { EventPlan } from '@/lib/schemas';
import { exportPlanAsCsv, exportPlanAsJson } from '@/lib/export-utils';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700">
              <Download className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="export-modal-title" className="text-base font-bold text-stone-900">
                Export & Share Plan
              </h3>
              <p className="text-xs text-stone-500">Download formatted reports or print</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Close export modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Option 1: CSV Spreadsheet */}
          <button
            type="button"
            onClick={handleCsv}
            className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100 transition-colors shrink-0">
              <Table className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">
                  CSV Spreadsheet (.csv)
                </span>
                {downloadedFormat === 'csv' && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Downloaded
                  </span>
                )}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                Multi-section formatted sheet for Excel, Google Sheets, or Numbers. Includes Budget, Timeline, and Vendors.
              </span>
            </span>
          </button>

          {/* Option 2: JSON Backup */}
          <button
            type="button"
            onClick={handleJson}
            className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 transition-colors shrink-0">
              <FileText className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">
                  Structured JSON (.json)
                </span>
                {downloadedFormat === 'json' && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" aria-hidden="true" />
                    Downloaded
                  </span>
                )}
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
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
            className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex items-start gap-3.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <span className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-100 transition-colors shrink-0">
              <Printer className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="flex-1 block">
              <span className="font-bold text-sm text-stone-900 block">
                Printable Executive View / PDF
              </span>
              <span className="text-xs text-stone-500 mt-1 block">
                Formats the entire multi-section plan into a clean document binder ready for printing or saving as PDF.
              </span>
            </span>
          </button>
        </div>

        <div className="mt-5 pt-4 border-t border-stone-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
