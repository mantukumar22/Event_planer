'use client';

import React from 'react';
import { CalendarHeart, Sparkles, Printer, Download, PlusCircle, Check } from 'lucide-react';
import { EventPlan } from '@/lib/schemas';

interface HeaderProps {
  currentPlan: EventPlan | null;
  onNewPlan: () => void;
  onOpenExport: () => void;
  onPrint: () => void;
  isSavedLocally?: boolean;
}

export function Header({
  currentPlan,
  onNewPlan,
  onOpenExport,
  onPrint,
  isSavedLocally = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <CalendarHeart className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-white">
                EventCraft AI
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                Assistant
              </span>
            </div>
            <p className="text-xs text-stone-400 hidden sm:block">
              Intelligent event producer & budgeting planner
            </p>
          </div>
        </div>

        {/* Plan Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPlan && isSavedLocally && (
            <div
              className="hidden md:flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-full"
              title="Plan is saved in your browser"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Autosaved</span>
            </div>
          )}

          {currentPlan ? (
            <>
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Print or save as PDF"
              >
                <Printer className="w-4 h-4 text-stone-400" aria-hidden="true" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Export plan as CSV or JSON"
              >
                <Download className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={onNewPlan}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                <span className="font-semibold">New Event</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-stone-400">
              Create an event below
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
