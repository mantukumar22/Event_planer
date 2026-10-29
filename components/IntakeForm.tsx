'use client';

import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Sparkles,
  HeartHandshake,
  ShieldAlert,
  HelpCircle,
  Loader2,
  Check,
} from 'lucide-react';
import {
  IntakeFormData,
  IntakeFormSchema,
  EventType,
  CurrencyCode,
  VenueSetting,
} from '@/lib/schemas';
import { CURRENCY_SYMBOLS } from '@/lib/constants';

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
      className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200 p-6 sm:p-8"
      aria-labelledby="intake-form-heading"
    >
      <div className="border-b border-stone-200 pb-5 mb-6">
        <h2
          id="intake-form-heading"
          className="text-xl sm:text-2xl font-serif font-bold text-stone-900"
        >
          Event Vision & Specifications
        </h2>
        <p className="text-sm text-stone-600 mt-1">
          Provide your event parameters. Our AI planner will calculate an accurate budget,
          build a milestone timeline, and prepare a custom vendor roadmap.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Event Type & Basics */}
        <div>
          <fieldset>
            <legend className="text-sm font-semibold text-stone-900 mb-2">
              Select Event Type <span className="text-rose-600" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'wedding', label: 'Wedding', desc: 'Vows, reception, ceremony' },
                { type: 'birthday', label: 'Birthday', desc: 'Milestone or kid’s party' },
                { type: 'community', label: 'Community', desc: 'Fundraiser or block party' },
              ].map(({ type, label, desc }) => {
                const isSelected = formData.eventType === type;
                return (
                  <label
                    key={type}
                    className={`relative flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
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
                      <span className="font-semibold text-sm text-stone-900">{label}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                          ✓
                        </span>
                      )}
                    </span>
                    <span id={`desc-${type}`} className="text-xs text-stone-500 mt-1">
                      {desc}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        {/* Event Title & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="eventTitle"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Event Title <span className="text-rose-600" aria-hidden="true">*</span>
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
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                errors.eventTitle
                  ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
            {errors.eventTitle ? (
              <p id="eventTitle-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.eventTitle}
              </p>
            ) : (
              <p id="eventTitle-help" className="text-xs text-stone-500 mt-1">
                Give your event a memorable title.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="eventDate"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Target Event Date <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={(e) => handleChange('eventDate', e.target.value)}
              aria-describedby={errors.eventDate ? 'eventDate-error' : 'eventDate-help'}
              aria-invalid={!!errors.eventDate}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                errors.eventDate
                  ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                  : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
            {errors.eventDate ? (
              <p id="eventDate-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.eventDate}
              </p>
            ) : (
              <p id="eventDate-help" className="text-xs text-stone-500 mt-1">
                Used to calculate timeline countdown intervals.
              </p>
            )}
          </div>
        </div>

        {/* Guests, Budget & Currency */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="guestCount"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Guest Count <span className="text-rose-600" aria-hidden="true">*</span>
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
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                  errors.guestCount
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                }`}
              />
              <Users
                className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.guestCount ? (
              <p id="guestCount-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.guestCount}
              </p>
            ) : (
              <p id="guestCount-help" className="text-xs text-stone-500 mt-1">
                Total estimated attendees.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalBudget"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Total Budget <span className="text-rose-600" aria-hidden="true">*</span>
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
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                  errors.totalBudget
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                }`}
              />
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-stone-500 pointer-events-none">
                {CURRENCY_SYMBOLS[formData.currency]}
              </span>
            </div>
            {errors.totalBudget ? (
              <p id="totalBudget-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.totalBudget}
              </p>
            ) : (
              <p id="totalBudget-help" className="text-xs text-stone-500 mt-1">
                Allocated across all vendors.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value as CurrencyCode)}
              aria-describedby="currency-help"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="USD">USD ($ - US Dollar)</option>
              <option value="EUR">EUR (€ - Euro)</option>
              <option value="GBP">GBP (£ - British Pound)</option>
              <option value="CAD">CAD (CA$ - Canadian Dollar)</option>
              <option value="AUD">AUD (AU$ - Australian Dollar)</option>
              <option value="JPY">JPY (¥ - Japanese Yen)</option>
              <option value="INR">INR (₹ - Indian Rupee)</option>
            </select>
            <p id="currency-help" className="text-xs text-stone-500 mt-1">
              Display & calculation currency.
            </p>
          </div>
        </div>

        {/* Location & Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Location / City <span className="text-rose-600" aria-hidden="true">*</span>
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
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                  errors.location
                    ? 'border-rose-400 focus:ring-rose-400'
                    : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
                }`}
              />
              <MapPin
                className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none"
                aria-hidden="true"
              />
            </div>
            {errors.location ? (
              <p id="location-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.location}
              </p>
            ) : (
              <p id="location-help" className="text-xs text-stone-500 mt-1">
                Guides local vendor rates and climate tips.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="themeVibe"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Theme or Aesthetic Vibe <span className="text-rose-600" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="themeVibe"
              name="themeVibe"
              value={formData.themeVibe}
              onChange={(e) => handleChange('themeVibe', e.target.value)}
              placeholder="e.g. Modern Boho Chic, Neon Cyberpunk, Warm Rustic"
              aria-describedby={errors.themeVibe ? 'themeVibe-error' : 'themeVibe-help'}
              aria-invalid={!!errors.themeVibe}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 ${
                errors.themeVibe
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-stone-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
            />
            {errors.themeVibe ? (
              <p id="themeVibe-error" className="text-xs text-rose-600 mt-1.5 font-medium" role="alert">
                {errors.themeVibe}
              </p>
            ) : (
              <p id="themeVibe-help" className="text-xs text-stone-500 mt-1">
                Drives color palette, decor, and mood recommendations.
              </p>
            )}
          </div>
        </div>

        {/* Setting / Venue Type */}
        <div>
          <fieldset>
            <legend className="text-sm font-semibold text-stone-900 mb-2">
              Venue Setting
            </legend>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'indoor', label: 'Indoor', sub: 'Ballroom, restaurant, hall' },
                { val: 'outdoor', label: 'Outdoor', sub: 'Garden, beach, park' },
                { val: 'hybrid', label: 'Hybrid', sub: 'Indoor pavilion with patio' },
              ].map(({ val, label, sub }) => (
                <label
                  key={val}
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.venueSetting === val
                      ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                      : 'border-stone-200 hover:border-stone-300'
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
                  <span className="font-semibold text-xs sm:text-sm text-stone-900">{label}</span>
                  <span className="text-[11px] text-stone-500 mt-0.5">{sub}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Cultural Preferences & Must-Haves */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="culturalTraditions"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Cultural or Family Traditions <span className="text-xs font-normal text-stone-500">(Optional)</span>
            </label>
            <textarea
              id="culturalTraditions"
              name="culturalTraditions"
              rows={2}
              value={formData.culturalTraditions}
              onChange={(e) => handleChange('culturalTraditions', e.target.value)}
              placeholder="e.g. Sangeet evening, Polish bridal dance, tea ceremony"
              aria-describedby="culturalTraditions-help"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p id="culturalTraditions-help" className="text-xs text-stone-500 mt-1">
              Customs you want woven into the schedule and decor.
            </p>
          </div>

          <div>
            <label
              htmlFor="mustHaves"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Non-Negotiable Must-Haves <span className="text-xs font-normal text-stone-500">(Optional)</span>
            </label>
            <textarea
              id="mustHaves"
              name="mustHaves"
              rows={2}
              value={formData.mustHaves}
              onChange={(e) => handleChange('mustHaves', e.target.value)}
              placeholder="e.g. Live band, photo booth, espresso cart, late-night taco truck"
              aria-describedby="mustHaves-help"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p id="mustHaves-help" className="text-xs text-stone-500 mt-1">
              Prioritized in the budget and vendor allocation.
            </p>
          </div>
        </div>

        {/* Dietary & Accessibility Constraints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="dietaryRestrictions"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Dietary Restrictions & Allergies <span className="text-xs font-normal text-stone-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={(e) => handleChange('dietaryRestrictions', e.target.value)}
              placeholder="e.g. Vegan, Gluten-Free, Halal, Nut-free"
              aria-describedby="dietaryRestrictions-help"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p id="dietaryRestrictions-help" className="text-xs text-stone-500 mt-1">
              Integrated into the custom menu and catering checklist.
            </p>
          </div>

          <div>
            <label
              htmlFor="accessibilityNeeds"
              className="block text-sm font-semibold text-stone-900 mb-1"
            >
              Accessibility & Guest Care <span className="text-xs font-normal text-stone-500">(Optional)</span>
            </label>
            <input
              type="text"
              id="accessibilityNeeds"
              name="accessibilityNeeds"
              value={formData.accessibilityNeeds}
              onChange={(e) => handleChange('accessibilityNeeds', e.target.value)}
              placeholder="e.g. Wheelchair ramp, quiet sensory room, shaded seating"
              aria-describedby="accessibilityNeeds-help"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <p id="accessibilityNeeds-help" className="text-xs text-stone-500 mt-1">
              Ensures inclusive venue and logistics questions.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice Requirement */}
      <div className="mt-8 pt-4 border-t border-stone-200 flex items-start gap-2.5 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl">
        <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <p>
          <strong className="text-stone-700">Privacy Notice:</strong> We only use your event parameters to craft your custom plan and never sell or share your data. All calculations and personalizations are processed securely.
        </p>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-500">
          <span className="text-rose-600 font-bold">*</span> Required fields
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-stone-950 font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer min-h-[44px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-stone-900" aria-hidden="true" />
              <span>Generating Bespoke Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-stone-950" aria-hidden="true" />
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
