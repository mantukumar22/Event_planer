'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Printer, Download, PlusCircle, Check, Menu, X, ArrowRight } from 'lucide-react';
import { EventPlan } from '@/lib/schemas';
import { CrownIcon } from './CrownIcon';

interface HeaderProps {
  currentPlan: EventPlan | null;
  onNewPlan: () => void;
  onOpenExport: () => void;
  onPrint: () => void;
  onStartPlanning?: () => void;
  isSavedLocally?: boolean;
}

export function Header({
  currentPlan,
  onNewPlan,
  onOpenExport,
  onPrint,
  onStartPlanning,
  isSavedLocally = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Event Types', href: '#event-types' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Planner', href: '#planner' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--ink)]/85 backdrop-blur-xl border-b border-[var(--royal)]/25 text-[var(--text)] transition-colors print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-xl py-1 px-1.5"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--royal)] via-[var(--surface-2)] to-[var(--magenta)]/30 border border-[var(--royal-light)]/30 flex items-center justify-center shadow-lg shadow-[var(--royal)]/20 group-hover:border-[var(--gold)]/60 transition-all">
            <CrownIcon size={22} className="text-[var(--gold)] drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-[var(--cyan)] transition-colors">
                EventCraft AI
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-0.5 rounded-full">
                Royal Edition
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] font-medium hidden sm:block">
              Intelligent event producer & live budget architect
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[var(--muted)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cyan)] rounded-md px-1.5 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentPlan && isSavedLocally && (
            <div
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full"
              title="Plan is saved in your local browser storage"
            >
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Autosaved</span>
            </div>
          )}

          {currentPlan ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[var(--surface-2)] hover:bg-[var(--royal)]/40 rounded-xl transition-all border border-[var(--royal)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
                aria-label="Print or save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-[var(--muted)]" aria-hidden="true" />
                <span className="hidden sm:inline">Print / PDF</span>
              </button>

              <button
                type="button"
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-[var(--surface-2)] hover:bg-[var(--royal)]/40 rounded-xl transition-all border border-[var(--royal)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
                aria-label="Export plan as CSV or JSON"
              >
                <Download className="w-3.5 h-3.5 text-[var(--cyan)]" aria-hidden="true" />
                <span>Export</span>
              </button>

              <button
                type="button"
                onClick={onNewPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#04121A] bg-[var(--cyan)] hover:bg-[#55EEFF] rounded-xl transition-all shadow-md shadow-[var(--cyan)]/25 focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>New Event</span>
              </button>
            </div>
          ) : (
            <a
              href="#planner"
              onClick={onStartPlanning}
              className="btn-cyan px-5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <span>Start Planning</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[var(--muted)] hover:text-white hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Focus Management */}
      {mobileMenuOpen && (
        <div
          ref={mobileNavRef}
          className="lg:hidden bg-[var(--surface)]/95 backdrop-blur-2xl border-b border-[var(--royal)]/40 px-6 py-6 animate-in slide-in-from-top-4"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-base font-semibold text-stone-200 hover:text-[var(--cyan)] py-2 border-b border-[var(--royal)]/20 transition-colors"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#planner"
              onClick={() => {
                handleLinkClick();
                onStartPlanning?.();
              }}
              className="btn-cyan w-full mt-2 text-center py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <span>Plan My Event Now</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
