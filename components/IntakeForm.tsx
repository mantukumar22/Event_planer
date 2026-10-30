'use client';

import React, { useState } from 'react';
import {
  Users,
  MapPin,
  Sparkles,
  HeartHandshake,
  Loader2,
} from 'lucide-react';
import {
  IntakeFormData,
  IntakeFormSchema,
  EventType,
  CurrencyCode,
  VenueSetting,
} from '@/lib/schemas';
import { CURRENCY_SYMBOLS } from '@/lib/constants';
import { CrownIcon } from './CrownIcon';

interface IntakeFormProps {
  initialData?: IntakeFormData;
  onSubmit: (data: IntakeFormData) => void;
  isLoading: boolean;
}

export function IntakeForm({ initialData, onSubmit, isLoading }: IntakeFormProps) {
  const [formData, setFormData] = useState<IntakeFormData>(
    initialData || {
      eventType: 'wedding',
      eventTitle: '',
      eventDate: '',
      guestCount: 100,
      totalBudget: 20000,
      currency: 'USD',
      location: '',
      themeVibe: '',
      culturalTraditions: '',
      mustHaves: '',
      dietaryRestrictions: '',
      accessibilityNeeds: '',
      venueSetting: 'indoor',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    field: keyof IntakeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = IntakeFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);

      // Focus first error field
      const firstField = Object.keys(fieldErrors)[0];
      const el = document.getElementById(firstField);
      if (el) {
        el.focus();
      }
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form
      id="intake-form"
      onSubmit={handleSubmit}
      noValidate
      className="royal-glass rounded-3xl shadow-2xl p-6 sm:p-10 border border-[var(--royal)]/40 text-[var(--text)]"
      aria-labelledby="intake-form-heading"
    >
      <div className="border-b border-[var(--royal)]/25 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--gold)]/30 mb-3">
          <CrownIcon size={14} className="text-[var(--gold)]" />
          <span className="font-display font-bold text-[11px] uppercase tracking-wider text-[var(--gold)]">
            Royal Event Architect
          </span>
        </div>
        <h2
          id="intake-form-heading"
          className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight"
        >
          Event Vision & Specifications
        </h2>
        <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">
          Provide your event parameters. Our AI planner will calculate an accurate budget,
          build a milestone timeline, and prepare a custom vendor roadmap.
        </p>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Section 1: Event Type */}
        <div>
          <fieldset>
            <legend className="text-sm font-bold text-white mb-3">
              Select Event Type <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'wedding', label: 'Wedding', desc: 'Vows, reception, ceremony' },
                { type: 'birthday', label: 'Birthday', desc: 'Milestone or kid’s party' },
                { type: 'community', label: 'Community', desc: 'Fundraiser or block party' },
              ].map(({ type, label, desc }) => {
                const isSelected = formData.eventType === type;
                return (
                  <label
                    key={type}
                    className={`relative flex flex-col p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[var(--cyan)] bg-[var(--royal)]/25 ring-2 ring-[var(--cyan)]/40 shadow-lg shadow-[var(--cyan)]/10'
                        : 'border-[var(--royal)]/30 bg-[var(--surface-2)]/60 hover:border-[var(--royal-light)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={type}
                      checked={isSelected}
                      onChange={() => handleChange('eventType', type as EventType)}
                      className="sr-only"
                      aria-describedby={`desc-${type}`}
                    />
                    <span className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{label}</span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[var(--cyan)] text-[#04121A] flex items-center justify-center text-xs font-black">
                          ✓
                        </span>
                      )}
                    </span>
                    <span id={`desc-${type}`} className="text-xs text-[var(--muted)] mt-1.5 font-medium">
                      {desc}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Event Title & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="eventTitle"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Event Title <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="eventTitle"
              name="eventTitle"
              value={formData.eventTitle}
              onChange={(e) => handleChange('eventTitle', e.target.value)}
              placeholder="e.g. Maya & Alex’s Spring Celebration"
              aria-describedby={errors.eventTitle ? 'eventTitle-error' : 'eventTitle-help'}
              aria-invalid={!!errors.eventTitle}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 placeholder-[var(--muted)]/50 transition-all focus:outline-none focus:ring-2 ${
                errors.eventTitle
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-950/20'
                  : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
              }`}
            />
            {errors.eventTitle ? (
              <p id="eventTitle-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.eventTitle}
              </p>
            ) : (
              <p id="eventTitle-help" className="text-xs text-[var(--muted)] mt-1.5">
                Give your event a memorable title.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Target Event Date <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              aria-describedby={errors.eventDate ? 'eventDate-error' : 'eventDate-help'}
              aria-invalid={!!errors.eventDate}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 transition-all focus:outline-none focus:ring-2 ${
                errors.eventDate
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-950/20'
                  : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
              }`}
            />
            {errors.eventDate ? (
              <p id="eventDate-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.eventDate}
              </p>
            ) : (
              <p id="eventDate-help" className="text-xs text-[var(--muted)] mt-1.5">
                Used to calculate timeline countdown intervals.
              </p>
            )}
          </div>
        </div>

        {/* Guests, Budget & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="guestCount"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Guest Count <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="guestCount"
                name="guestCount"
                min="5"
                max="10000"
                value={formData.guestCount || ''}
                onChange={(e) => handleChange('guestCount', parseInt(e.target.value, 10) || 0)}
                aria-describedby={errors.guestCount ? 'guestCount-error' : 'guestCount-help'}
                aria-invalid={!!errors.guestCount}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 transition-all focus:outline-none focus:ring-2 ${
                  errors.guestCount
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
                }`}
              />
              <Users
                className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-3.5 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.guestCount ? (
              <p id="guestCount-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.guestCount}
              </p>
            ) : (
              <p id="guestCount-help" className="text-xs text-[var(--muted)] mt-1.5">
                Total estimated attendees.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalBudget"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Total Budget <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                id="totalBudget"
                name="totalBudget"
                min="100"
                step="50"
                value={formData.totalBudget || ''}
                onChange={(e) => handleChange('totalBudget', parseFloat(e.target.value) || 0)}
                aria-describedby={errors.totalBudget ? 'totalBudget-error' : 'totalBudget-help'}
                aria-invalid={!!errors.totalBudget}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 transition-all focus:outline-none focus:ring-2 ${
                  errors.totalBudget
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
                }`}
              />
              <span className="absolute left-3.5 top-3 text-sm font-bold text-[var(--gold)] pointer-events-none">
                {CURRENCY_SYMBOLS[formData.currency]}
              </span>
            </div>
            {errors.totalBudget ? (
              <p id="totalBudget-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.totalBudget}
              </p>
            ) : (
              <p id="totalBudget-help" className="text-xs text-[var(--muted)] mt-1.5">
                Allocated across all vendors.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value as CurrencyCode)}
              aria-describedby="currency-help"
              className="w-full px-4 py-3 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)]"
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="CAD">CAD (CA$ - Canadian Dollar)</option>
              <option value="AUD">AUD (AU$ - Australian Dollar)</option>
              <option value="JPY">JPY (¥ - Japanese Yen)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
            </select>
            <p id="currency-help" className="text-xs text-[var(--muted)] mt-1.5">
              Display & calculation currency.
            </p>
          </div>
        </div>

        {/* Location & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Location / City <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g. San Diego, CA or London, UK"
                aria-describedby={errors.location ? 'location-error' : 'location-help'}
                aria-invalid={!!errors.location}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 placeholder-[var(--muted)]/50 transition-all focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-rose-500 focus:ring-rose-500'
                    : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
                }`}
              />
              <MapPin
                className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-3.5 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.location ? (
              <p id="location-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.location}
              </p>
            ) : (
              <p id="location-help" className="text-xs text-[var(--muted)] mt-1.5">
                Guides local vendor rates and climate tips.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="themeVibe"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Theme or Aesthetic Vibe <span className="text-[var(--cyan)]" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="themeVibe"
              name="themeVibe"
              value={formData.themeVibe}
              onChange={(e) => handleChange('themeVibe', e.target.value)}
              placeholder="e.g. Modern Boho Chic, Neon Cyberpunk, Royal Velvet"
              aria-describedby={errors.themeVibe ? 'themeVibe-error' : 'themeVibe-help'}
              aria-invalid={!!errors.themeVibe}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-white bg-[var(--surface-2)]/80 placeholder-[var(--muted)]/50 transition-all focus:outline-none focus:ring-2 ${
                errors.themeVibe
                  ? 'border-rose-500 focus:ring-rose-500'
                  : 'border-[var(--royal)]/40 focus:border-[var(--gold)] focus:ring-[var(--gold)]/30'
              }`}
            />
            {errors.themeVibe ? (
              <p id="themeVibe-error" className="text-xs text-rose-400 mt-1.5 font-semibold" role="alert">
                {errors.themeVibe}
              </p>
            ) : (
              <p id="themeVibe-help" className="text-xs text-[var(--muted)] mt-1.5">
                Drives color palette, decor, and mood recommendations.
              </p>
            )}
          </div>
        </div>

        {/* Venue Setting */}
        <div>
          <fieldset>
            <legend className="text-sm font-bold text-white mb-2">
              Venue Setting
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { val: 'indoor', label: 'Indoor', sub: 'Ballroom, restaurant, hall' },
                { val: 'outdoor', label: 'Outdoor', sub: 'Garden, beach, park' },
                { val: 'hybrid', label: 'Hybrid', sub: 'Indoor pavilion with patio' },
              ].map(({ val, label, sub }) => (
                <label
                  key={val}
                  className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    formData.venueSetting === val
                      ? 'border-[var(--gold)] bg-[var(--royal)]/25 ring-1 ring-[var(--gold)]'
                      : 'border-[var(--royal)]/30 bg-[var(--surface-2)]/50 hover:border-[var(--royal-light)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="venueSetting"
                    value={val}
                    checked={formData.venueSetting === val}
                    onChange={() => handleChange('venueSetting', val as VenueSetting)}
                    className="sr-only"
                  />
                  <span className="font-bold text-sm text-white">{label}</span>
                  <span className="text-[11px] text-[var(--muted)] mt-0.5">{sub}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Cultural Preferences & Must-Haves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="culturalTraditions"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Cultural or Family Traditions <span className="text-xs font-normal text-[var(--muted)]">(Optional)</span>
            </label>
            <textarea
              id="culturalTraditions"
              name="culturalTraditions"
              rows={2}
              value={formData.culturalTraditions}
              onChange={(e) => handleChange('culturalTraditions', e.target.value)}
              placeholder="e.g. Sangeet evening, Polish bridal dance, tea ceremony"
              aria-describedby="culturalTraditions-help"
              className="w-full px-4 py-3 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] placeholder-[var(--muted)]/50"
            />
            <p id="culturalTraditions-help" className="text-xs text-[var(--muted)] mt-1.5">
              Customs you want woven into the schedule and decor.
            </p>
          </div>

          <div>
            <label
              htmlFor="mustHaves"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Non-Negotiable Must-Haves <span className="text-xs font-normal text-[var(--muted)]">(Optional)</span>
            </label>
            <textarea
              id="mustHaves"
              name="mustHaves"
              rows={2}
              value={formData.mustHaves}
              onChange={(e) => handleChange('mustHaves', e.target.value)}
              placeholder="e.g. Live band, photo booth, espresso cart, late-night taco truck"
              aria-describedby="mustHaves-help"
              className="w-full px-4 py-3 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] placeholder-[var(--muted)]/50"
            />
            <p id="mustHaves-help" className="text-xs text-[var(--muted)] mt-1.5">
              Prioritized in the budget and vendor allocation.
            </p>
          </div>
        </div>

        {/* Dietary & Accessibility Constraints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="dietaryRestrictions"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Dietary Restrictions & Allergies <span className="text-xs font-normal text-[var(--muted)]">(Optional)</span>
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
              placeholder="e.g. Vegan, Gluten-Free, Halal, Nut-free"
              aria-describedby="dietaryRestrictions-help"
              className="w-full px-4 py-3 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] placeholder-[var(--muted)]/50"
            />
            <p id="dietaryRestrictions-help" className="text-xs text-[var(--muted)] mt-1.5">
              Integrated into the custom menu and catering checklist.
            </p>
          </div>

          <div>
            <label
              htmlFor="accessibilityNeeds"
              className="block text-sm font-bold text-white mb-1.5"
            >
              Accessibility & Guest Care <span className="text-xs font-normal text-[var(--muted)]">(Optional)</span>
            </label>
            <input
              type="text"
              id="accessibilityNeeds"
              name="accessibilityNeeds"
              value={formData.accessibilityNeeds}
              onChange={(e) => handleChange('accessibilityNeeds', e.target.value)}
              placeholder="e.g. Wheelchair ramp, quiet sensory room, shaded seating"
              aria-describedby="accessibilityNeeds-help"
              className="w-full px-4 py-3 rounded-xl border border-[var(--royal)]/40 text-sm text-white bg-[var(--surface-2)]/80 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] placeholder-[var(--muted)]/50"
            />
            <p id="accessibilityNeeds-help" className="text-xs text-[var(--muted)] mt-1.5">
              Ensures inclusive venue and logistics questions.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="mt-8 pt-4 border-t border-[var(--royal)]/25 flex items-start gap-3 text-xs text-[var(--muted)] bg-[var(--surface-2)]/50 p-4 rounded-2xl border border-[var(--royal)]/20">
        <HeartHandshake className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong className="text-white">Privacy Notice:</strong> We only use your event parameters to craft your custom plan and never sell or share your data. All calculations and personalizations are processed securely.
        </p>
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[var(--muted)] font-medium">
          <span className="text-[var(--cyan)] font-bold">*</span> Required fields
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-cyan w-full sm:w-auto px-9 py-4 text-sm font-extrabold flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-h-[48px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#04121A]" aria-hidden="true" />
              <span>Generating Bespoke Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#04121A]" aria-hidden="true" />
              <span>Craft Complete Event Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite">
        {isLoading ? 'Generating your personalized event plan with AI, please wait.' : ''}
      </div>
    </form>
  );
}
