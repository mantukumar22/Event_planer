'use client';

/**
 * Single Responsibility: Interactive Timeline tab featuring Countdown Milestones,
 * Day-of Run-of-Show (hour-by-hour agenda), direct .ics export, and local feedback.
 */
import React, { useState } from 'react';
import {
  Clock,
  Filter,
  Sparkles,
  User,
  CalendarDays,
  CalendarPlus,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { TimelinePlan, Priority, DayOfScheduleItem } from '@/lib/schemas';
import { downloadIcsFile } from '@/lib/ics-export';

interface TimelineTabProps {
  timeline: TimelinePlan;
  eventDate: string;
  eventTitle?: string;
  onUpdateTimeline: (updated: TimelinePlan) => void;
  onOpenRegenerate: () => void;
}

export function TimelineTab({
  timeline,
  eventDate,
  eventTitle = 'Event',
  onUpdateTimeline,
  onOpenRegenerate,
}: TimelineTabProps) {
  const tasks = timeline.tasks;
  const dayOfItems: DayOfScheduleItem[] = timeline.dayOfSchedule || [];

  const [activeView, setActiveView] = useState<'milestones' | 'runOfShow'>('milestones');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'pending' | 'completed'>('all');
  const [lastToggledTask, setLastToggledTask] = useState<string | null>(null);
  const [sectionRating, setSectionRating] = useState<'up' | 'down' | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return (localStorage.getItem('rating_timeline') as 'up' | 'down') || null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        setLastToggledTask(`Task "${t.title}" marked as ${nextState ? 'completed' : 'pending'}`);
        return { ...t, completed: nextState };
      }
      return t;
    });

    onUpdateTimeline({
      ...timeline,
      tasks: updated,
    });
  };

  const handleRate = (rating: 'up' | 'down') => {
    setSectionRating(rating);
    try {
      localStorage.setItem('rating_timeline', rating);
    } catch {
      // safe fallback
    }
  };

  const handleExportIcs = () => {
    // Generate dummy plan object conforming to EventPlan for ICS export
    downloadIcsFile({
      createdAt: new Date().toISOString(),
      intake: {
        eventType: 'wedding',
        eventTitle,
        eventDate,
        guestCount: 100,
        totalBudget: 10000,
        currency: 'USD',
        location: 'Venue',
        themeVibe: 'Celebration',
        venueSetting: 'indoor',
      },
      executiveSummary: '',
      budget: {
        totalBudget: 10000,
        currency: 'USD',
        contingencyAmount: 1000,
        items: [],
        summary: '',
      },
      timeline,
      vendors: { vendors: [], tips: [] },
      ideas: {
        themeDetails: { concept: 'Celebration', colorPalette: ['#6D28D9'], decorElements: [] },
        activities: [],
        customMenu: { signatureCocktailMocktail: '', appetizers: [], mains: [], dessert: '', dietaryNotes: '' },
        moneySavingHacks: [],
      },
    });
  };

  // Group tasks by phase
  const filteredTasks = tasks.filter((task) => {
    if (selectedPhase !== 'all' && task.phase !== selectedPhase) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (filterCompleted === 'pending' && task.completed) return false;
    if (filterCompleted === 'completed' && !task.completed) return false;
    return true;
  });

  const allPhases =
    timeline.phases.length > 0
      ? timeline.phases
      : Array.from(new Set(tasks.map((t) => t.phase)));

  const priorityStyles: Record<Priority, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-rose-950/60', text: 'text-rose-300', border: 'border-rose-500/40' },
    Medium: { bg: 'bg-amber-950/60', text: 'text-amber-300', border: 'border-amber-500/40' },
    Low: { bg: 'bg-emerald-950/60', text: 'text-emerald-300', border: 'border-emerald-500/40' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & View Switcher */}
      <div className="royal-glass rounded-3xl p-5 sm:p-6 border border-[var(--royal)]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--gold)]/30">
              Schedule & Run-of-Show
            </span>
            <span className="text-xs font-semibold text-[var(--cyan)] bg-[var(--surface-2)] px-3 py-1 rounded-full border border-[var(--cyan)]/30">
              Target: {eventDate || 'Upcoming'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 min-w-[200px] max-w-xs">
              <div className="flex justify-between text-xs text-[var(--muted)] font-semibold mb-1">
                <span>Milestone Progress</span>
                <span className="text-[var(--gold)] font-bold">{progressPercent}%</span>
              </div>
              <div
                className="w-full h-2.5 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--royal)]/30"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Milestone progress: ${completedCount} of ${totalCount} completed`}
              >
                <div
                  className="h-full bg-gradient-to-r from-[var(--royal-light)] via-[var(--magenta)] to-[var(--gold)] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-xs text-[var(--muted)] whitespace-nowrap">
              {completedCount}/{totalCount} Completed
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* View Toggle */}
          <div className="flex rounded-xl bg-[var(--surface-2)] p-1 border border-[var(--royal)]/40">
            <button
              type="button"
              onClick={() => setActiveView('milestones')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'milestones'
                  ? 'bg-[var(--cyan)] text-[#04121A]'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Countdown Milestones
            </button>
            <button
              type="button"
              onClick={() => setActiveView('runOfShow')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'runOfShow'
                  ? 'bg-[var(--cyan)] text-[#04121A]'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Day-of Run of Show ({dayOfItems.length || 7})
            </button>
          </div>

          <button
            type="button"
            onClick={handleExportIcs}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/40 text-[var(--cyan)] border border-[var(--cyan)]/40 text-xs font-bold transition-all cursor-pointer"
            title="Download Apple / Google Calendar .ics file"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Export .ics</span>
          </button>

          <button
            type="button"
            onClick={onOpenRegenerate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--royal)]/30 text-[var(--gold)] border border-[var(--gold)]/40 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Regenerate Timeline</span>
          </button>
        </div>
      </div>

      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite">
        {lastToggledTask}
      </div>

      {activeView === 'milestones' ? (
        <>
          {/* Filters Row */}
          <div className="royal-glass rounded-2xl p-4 border border-[var(--royal)]/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Filter className="w-4 h-4 text-[var(--cyan)]" aria-hidden="true" />
              <span>Filter Milestones:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Phase Filter */}
              <div>
                <label htmlFor="filter-phase" className="sr-only">
                  Filter by Phase
                </label>
                <select
                  id="filter-phase"
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--royal)]/40 text-xs text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="all">All Phases ({tasks.length})</option>
                  {allPhases.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label htmlFor="filter-priority" className="sr-only">
                  Filter by Priority
                </label>
                <select
                  id="filter-priority"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--royal)]/40 text-xs text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="all">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="filter-status" className="sr-only">
                  Filter by Status
                </label>
                <select
                  id="filter-status"
                  value={filterCompleted}
                  onChange={(e) => setFilterCompleted(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--royal)]/40 text-xs text-white bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Only</option>
                  <option value="completed">Completed Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Timeline Tasks List */}
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="p-12 text-center royal-glass rounded-3xl border border-[var(--royal)]/30 text-[var(--muted)]">
                <CalendarDays className="w-8 h-8 text-[var(--cyan)] mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">No milestone tasks match your filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhase('all');
                    setSelectedPriority('all');
                    setFilterCompleted('all');
                  }}
                  className="mt-3 text-xs font-bold text-[var(--cyan)] underline cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 rounded-3xl royal-glass border transition-all ${
                    task.completed
                      ? 'border-emerald-500/30 bg-emerald-950/10 opacity-70'
                      : 'border-[var(--royal)]/30 hover:border-[var(--royal-light)] shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5 mt-1 rounded text-[var(--cyan)] border-[var(--royal)]/40 bg-[var(--surface)] focus:ring-[var(--cyan)] cursor-pointer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`font-bold text-sm sm:text-base cursor-pointer ${
                            task.completed ? 'line-through text-[var(--muted)]' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </label>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                              priorityStyles[task.priority]?.bg || ''
                            } ${priorityStyles[task.priority]?.text || ''} ${
                              priorityStyles[task.priority]?.border || ''
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                          <span className="text-xs font-semibold text-[var(--cyan)] bg-[var(--surface-2)] px-2.5 py-0.5 rounded-full border border-[var(--cyan)]/30 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.timeOffset}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-[var(--muted)] mt-1.5 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--muted)]">
                        <span className="font-semibold text-[var(--gold)]">
                          Phase: {task.phase}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          Owner: <strong className="text-white">{task.owner}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Day-of Run-of-Show (Hour-by-Hour) View */
        <div className="royal-glass rounded-3xl p-6 border border-[var(--cyan)]/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--royal)]/20 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--cyan)]" />
                <span>Day-of Event Run-of-Show Agenda</span>
              </h3>
              <p className="text-xs text-[var(--muted)] mt-1">
                Precision hour-by-hour timeline for vendors, wedding party, and event coordinators.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportIcs}
              className="btn-cyan px-4 py-2 text-xs font-bold"
            >
              Export Schedule to Calendar
            </button>
          </div>

          <div className="relative pl-6 border-l-2 border-[var(--royal)]/40 space-y-6">
            {(dayOfItems.length > 0
              ? dayOfItems
              : [
                  {
                    time: '08:00 AM',
                    activity: 'Vendor Load-In & Technical Walkthrough',
                    leadRole: 'Lead Coordinator / Production',
                    location: 'Main Ballroom / Loading Bay',
                    notes: 'Stage, sound check, and lighting programming begin.',
                  },
                  {
                    time: '11:00 AM',
                    activity: 'Floral, Decor & Table Installations',
                    leadRole: 'Florist & Styling Team',
                    location: 'Reception & Ceremony Spaces',
                    notes: 'Floral arches, signage, and place cards arranged.',
                  },
                  {
                    time: '02:00 PM',
                    activity: 'Catering Prep & Bar Setup',
                    leadRole: 'Head Chef & Bar Lead',
                    location: 'Kitchen & Beverage Stations',
                    notes: 'Ice delivery, appetizers staged, glassware polished.',
                  },
                  {
                    time: '04:30 PM',
                    activity: 'Guest Arrival & Welcome Cocktails',
                    leadRole: 'Hospitality Staff / Host',
                    location: 'Welcome Lounge',
                    notes: 'Signature drinks passed, background soundtrack active.',
                  },
                  {
                    time: '05:30 PM',
                    activity: 'Main Ceremony / Formal Opening',
                    leadRole: 'Officiant / MC',
                    location: 'Grand Stage',
                    notes: 'Main program spotlight and vows / keynote address.',
                  },
                  {
                    time: '07:00 PM',
                    activity: 'Seated Dinner & Speeches',
                    leadRole: 'Catering Captain / MC',
                    location: 'Dining Hall',
                    notes: 'Multi-course service with designated speech breaks.',
                  },
                  {
                    time: '09:00 PM',
                    activity: 'Dance Floor & Nightlife Experience',
                    leadRole: 'DJ / Live Band',
                    location: 'Dance Floor & Lounge',
                    notes: 'High-energy royal Gen Z nightlife beats until close.',
                  },
                  {
                    time: '11:30 PM',
                    activity: 'Late-Night Snacks & Grand Sparkler Send-Off',
                    leadRole: 'Coordinator & Security',
                    location: 'Grand Exit',
                    notes: 'Tacos / sliders served, transportation buses staged.',
                  },
                ]
            ).map((item, idx) => (
              <div key={idx} className="relative group">
                {/* Dot marker */}
                <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--cyan)] border-4 border-[#0A0612] group-hover:scale-125 transition-transform" />

                <div className="p-4 rounded-2xl bg-[var(--surface-2)]/80 border border-[var(--royal)]/30 space-y-1.5 hover:border-[var(--cyan)]/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display font-extrabold text-sm text-[var(--gold)]">
                      {item.time}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--cyan)] border border-[var(--cyan)]/30">
                      Lead: {item.leadRole || item.owner || 'Coordinator'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white">{item.activity}</h4>

                  {item.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                      <MapPin className="w-3 h-3 text-[var(--magenta)]" />
                      <span>{item.location}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-[var(--muted)] pt-1 border-t border-[var(--royal)]/20 leading-relaxed">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Was This Helpful? Local Feedback Control */}
      <div className="p-4 rounded-2xl royal-glass border border-[var(--royal)]/30 flex items-center justify-between text-xs text-[var(--muted)]">
        <span>Was this schedule breakdown helpful?</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRate('up')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionRating === 'up'
                ? 'bg-[var(--cyan)] text-[#04121A] border-[var(--cyan)] font-bold'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--royal)]/30 hover:text-white'
            }`}
            aria-label="Thumbs up for timeline section"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes</span>
          </button>
          <button
            type="button"
            onClick={() => handleRate('down')}
            className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              sectionRating === 'down'
                ? 'bg-rose-500 text-white border-rose-500 font-bold'
                : 'bg-[var(--surface-2)] text-[var(--muted)] border-[var(--royal)]/30 hover:text-white'
            }`}
            aria-label="Thumbs down for timeline section"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Needs work</span>
          </button>
        </div>
      </div>
    </div>
  );
}
