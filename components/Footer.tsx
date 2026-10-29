import React from 'react';
import { CalendarHeart, ShieldCheck, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto bg-stone-900 text-stone-300 border-t border-stone-800 py-10 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <CalendarHeart className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base">
                EventCraft AI
              </span>
              <p className="text-xs text-stone-400">
                Precision event budgeting, timelines & personalized curation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Client-side persistent storage • Zero tracking</span>
          </div>
        </div>

        {/* Mandatory AI & Estimates Disclaimer */}
        <div className="p-4 rounded-xl bg-stone-800/60 border border-stone-750 text-xs text-stone-400 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-stone-200 mb-1">
              Important Planning Disclaimer
            </p>
            <p>
              Estimates, pricing ranges, and vendor guidance are AI-generated based on typical industry averages and seasonal benchmarks. Real-world costs vary by exact date, venue restrictions, and supplier contracts. Always verify terms, permits, and pricing directly with contracted vendors and local municipal authorities before committing deposits.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} EventCraft AI. Built for stress-free celebrations.</p>
          <div className="flex items-center gap-4">
            <span>WCAG 2.2 AA Accessible</span>
            <span>•</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
