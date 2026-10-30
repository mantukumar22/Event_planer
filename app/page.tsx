'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { MarqueeStrip } from '@/components/MarqueeStrip';
import { AboutStats } from '@/components/AboutStats';
import { EventCards } from '@/components/EventCards';
import { HowItWorks } from '@/components/HowItWorks';
import { SamplePlanMockup } from '@/components/SamplePlanMockup';
import { IntakeForm } from '@/components/IntakeForm';
import { PlanView } from '@/components/PlanView';
import { ChatPlanner } from '@/components/ChatPlanner';
import { ExportModal } from '@/components/ExportModal';
import { RegenerateModal } from '@/components/RegenerateModal';
import { Footer } from '@/components/Footer';
import {
  EventPlan,
  IntakeFormData,
  BudgetPlan,
  TimelinePlan,
  VendorPlan,
} from '@/lib/schemas';
import { PlanTabId } from '@/lib/types';
import {
  loadPlanFromStorage,
  savePlanToStorage,
} from '@/lib/storage';
import { SAMPLE_EVENT_PLAN } from '@/lib/samplePlan';
import { AlertCircle, WifiOff, CheckCircle2, Crown, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [currentPlan, setCurrentPlan] = useState<EventPlan | null>(null);
  const [formData, setFormData] = useState<IntakeFormData | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [regenerateTarget, setRegenerateTarget] = useState<PlanTabId | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [hasLoadedInitialStorage, setHasLoadedInitialStorage] = useState(false);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const planSectionRef = useRef<HTMLDivElement>(null);
  const sampleSectionRef = useRef<HTMLDivElement>(null);

  // Load plan from localStorage on initial client mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadPlanFromStorage();
      if (saved) {
        setCurrentPlan(saved);
        setFormData(saved.intake);
      }
      setHasLoadedInitialStorage(true);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setIsOffline(true);
      }
    }, 0);

    // Track online/offline status
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  // Autosave plan to localStorage whenever it changes
  useEffect(() => {
    if (hasLoadedInitialStorage && currentPlan) {
      savePlanToStorage(currentPlan);
    }
  }, [currentPlan, hasLoadedInitialStorage]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPlan = () => {
    planSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSample = () => {
    sampleSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Preset Selection from EventCards
  const handleSelectPreset = (presetData: IntakeFormData) => {
    setFormData(presetData);
    scrollToForm();
    showToast(`Loaded "${presetData.eventTitle}" blueprint. Customize and generate!`);
  };

  // Load Sample Plan directly
  const handleLoadSample = () => {
    setCurrentPlan(SAMPLE_EVENT_PLAN);
    setFormData(SAMPLE_EVENT_PLAN.intake);
    savePlanToStorage(SAMPLE_EVENT_PLAN);
    showToast('Sample royal wedding plan loaded successfully!');
    setTimeout(() => {
      scrollToPlan();
    }, 100);
  };

  // Submit Intake Form to generate a new plan
  const handleGeneratePlan = async (data: IntakeFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Failed to generate plan. Please try again.');
      }

      setCurrentPlan(result.data);
      savePlanToStorage(result.data);
      showToast('Royal event plan successfully created!');

      setTimeout(() => {
        scrollToPlan();
      }, 100);
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setErrorMsg(
        err?.message || 'A network error occurred while generating your plan. Please check your connection and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update budget items locally
  const handleUpdateBudget = (updated: BudgetPlan) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      budget: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  // Update timeline tasks locally
  const handleUpdateTimeline = (updated: TimelinePlan) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      timeline: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  // Update vendor checklist locally
  const handleUpdateVendors = (updated: VendorPlan) => {
    if (!currentPlan) return;
    setCurrentPlan({
      ...currentPlan,
      vendors: updated,
      updatedAt: new Date().toISOString(),
    });
  };

  // Regenerate section with instruction
  const handleConfirmRegenerate = async (section: PlanTabId, instruction: string) => {
    if (!currentPlan) return;

    const response = await fetch('/api/plan/regenerate-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section,
        instruction,
        currentPlan,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'Failed to regenerate section.');
    }

    setCurrentPlan((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: result.data,
        updatedAt: new Date().toISOString(),
      };
    });

    showToast(`Updated "${section}" section with your custom guidelines.`);
  };

  const handleNewPlan = () => {
    if (
      currentPlan &&
      !window.confirm('Start a new event? Your current plan will remain in your browser storage until overwritten.')
    ) {
      return;
    }
    scrollToForm();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[var(--ink)] text-[var(--text)]">
      {/* Sticky Glass Navbar */}
      <Header
        currentPlan={currentPlan}
        onNewPlan={handleNewPlan}
        onOpenExport={() => setIsExportOpen(true)}
        onPrint={handlePrint}
        onStartPlanning={scrollToForm}
        isSavedLocally={!!currentPlan}
      />

      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          className="bg-[var(--surface-2)] text-[var(--gold)] text-xs sm:text-sm font-bold py-2.5 px-4 text-center flex items-center justify-center gap-2 border-b border-[var(--gold)]/30 print:hidden"
        >
          <WifiOff className="w-4 h-4 text-[var(--gold)]" aria-hidden="true" />
          <span>You appear to be offline. Saved plans remain completely editable locally.</span>
        </div>
      )}

      {/* Full-bleed Moody Hero Section */}
      <Hero
        onScrollToForm={scrollToForm}
        onPreviewSample={scrollToSample}
      />

      {/* Marquee Infinite Scrolling Strip */}
      <MarqueeStrip />

      {/* About + Stats Section */}
      <AboutStats />

      {/* Made for Every Celebration Section */}
      <EventCards onSelectPreset={handleSelectPreset} />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Static Interactive Sample Plan Preview */}
      <div ref={sampleSectionRef}>
        <SamplePlanMockup onLoadSample={handleLoadSample} />
      </div>

      {/* Main Content Landmark: Plan Dashboard & Guided Intake Form */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full focus:outline-none">
        {/* Error Notification Banner */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-start gap-3 shadow-lg"
          >
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-bold text-white">Unable to generate plan</h3>
              <p className="mt-0.5 text-rose-300">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div
            role="status"
            className="fixed top-24 right-5 z-50 bg-[var(--surface-2)] text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[var(--gold)]/40 animate-in fade-in slide-in-from-top-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{successToast}</span>
          </div>
        )}

        {/* Active Plan Dashboard Bento Layout */}
        {currentPlan && (
          <div ref={planSectionRef} className="mb-20 scroll-mt-24">
            <PlanView
              plan={currentPlan}
              onUpdateBudget={handleUpdateBudget}
              onUpdateTimeline={handleUpdateTimeline}
              onUpdateVendors={handleUpdateVendors}
              onOpenRegenerate={(sec) => setRegenerateTarget(sec)}
              onOpenExport={() => setIsExportOpen(true)}
              onPrint={handlePrint}
            />
          </div>
        )}

        {/* Guided Intake Form Section */}
        <section id="planner" ref={formSectionRef} className="scroll-mt-24 max-w-3xl mx-auto">
          {currentPlan && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--gold)]/30 text-xs font-bold text-[var(--gold)] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Create New Blueprint</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                Want to tweak parameters or start another celebration?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
                Fill in the form below to produce a fresh event plan.
              </p>
            </div>
          )}
          <IntakeForm
            key={formData?.eventTitle || 'empty-form'}
            initialData={formData}
            onSubmit={handleGeneratePlan}
            isLoading={isLoading}
          />
        </section>
      </main>

      {/* Floating Chat Planner */}
      {currentPlan && <ChatPlanner plan={currentPlan} />}

      {/* Export Modal */}
      {currentPlan && (
        <ExportModal
          isOpen={isExportOpen}
          plan={currentPlan}
          onClose={() => setIsExportOpen(false)}
          onPrint={handlePrint}
        />
      )}

      {/* Section Regeneration Modal */}
      {currentPlan && regenerateTarget && (
        <RegenerateModal
          isOpen={!!regenerateTarget}
          activeTab={regenerateTarget}
          onClose={() => setRegenerateTarget(null)}
          onConfirm={handleConfirmRegenerate}
        />
      )}

      {/* Final CTA & Royal Dark Footer */}
      <Footer onScrollToForm={scrollToForm} />
    </div>
  );
}
