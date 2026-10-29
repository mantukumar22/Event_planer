'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
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
  clearPlanFromStorage,
} from '@/lib/storage';
import { AlertCircle, WifiOff, CheckCircle2, ArrowUp } from 'lucide-react';

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

  // Preset Selection from Hero cards
  const handleSelectPreset = (presetData: IntakeFormData) => {
    setFormData(presetData);
    scrollToForm();
    showToast(`Loaded "${presetData.eventTitle}" preset. Tweak or submit!`);
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
      showToast('Event plan successfully created!');

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
    <div className="flex-1 flex flex-col">
      {/* Header Landmark */}
      <Header
        currentPlan={currentPlan}
        onNewPlan={handleNewPlan}
        onOpenExport={() => setIsExportOpen(true)}
        onPrint={handlePrint}
        isSavedLocally={!!currentPlan}
      />

      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          className="bg-amber-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 print:hidden"
        >
          <WifiOff className="w-4 h-4" aria-hidden="true" />
          <span>You appear to be offline. Saved plans remain editable locally.</span>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        onSelectPreset={handleSelectPreset}
        onScrollToForm={scrollToForm}
      />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full focus:outline-none">
        {/* Error Notification Banner */}
        {errorMsg && (
          <div
            role="alert"
            className="mb-8 p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <h3 className="font-bold text-rose-900">Unable to generate plan</h3>
              <p className="mt-0.5 text-rose-700">{errorMsg}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-800 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Success Toast */}
        {successToast && (
          <div
            role="status"
            className="fixed top-20 right-5 z-50 bg-stone-900 text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-stone-700 animate-in fade-in slide-in-from-top-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Plan Section if generated */}
        {currentPlan && (
          <div ref={planSectionRef} className="mb-14 scroll-mt-20">
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
        <div ref={formSectionRef} className="scroll-mt-20 max-w-3xl mx-auto">
          {currentPlan && (
            <div className="mb-4 text-center">
              <h2 className="text-lg font-bold text-stone-800">
                Want to tweak parameters or start another event?
              </h2>
              <p className="text-xs text-stone-500">
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
        </div>
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

      {/* Footer Landmark */}
      <Footer />
    </div>
  );
}
