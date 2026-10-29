'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Sparkles,
  User,
  AlertCircle,
} from 'lucide-react';
import { TimelinePlan, TimelineTask, Priority } from '@/lib/schemas';

interface TimelineTabProps {
  timeline: TimelinePlan;
  eventDate: string;
  onUpdateTimeline: (updated: TimelinePlan) => void;
  onOpenRegenerate: () => void;
}

export function TimelineTab({
  timeline,
  eventDate,
  onUpdateTimeline,
  onOpenRegenerate,
}: TimelineTabProps) {
  const tasks = timeline.tasks;
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'pending' | 'completed'>('all');
  const [lastToggledTask, setLastToggledTask] = useState<string | null>(null);

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

  // Group tasks by phase
  const filteredTasks = tasks.filter((task) => {
    if (selectedPhase !== 'all' && task.phase !== selectedPhase) return false;
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;
    if (filterCompleted === 'pending' && task.completed) return false;
    if (filterCompleted === 'completed' && !task.completed) return false;
    return true;
  });

  // Phases list
  const allPhases = timeline.phases.length > 0
    ? timeline.phases
    : Array.from(new Set(tasks.map((t) => t.phase)));

  const priorityStyles: Record<Priority, { bg: string; text: string; border: string }> = {
    High: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    Low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Meter */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Schedule & Milestones
            </span>
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full">
              Target: {eventDate || 'Upcoming'}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 min-w-[200px] max-w-xs">
              <div className="flex justify-between text-xs text-stone-600 font-semibold mb-1">
                <span>Milestone Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div
                className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Milestone progress: ${completedCount} of ${totalCount} completed`}
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <span className="text-xs text-stone-500 font-medium">
              {completedCount} of {totalCount} tasks completed
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenRegenerate}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer ml-auto md:ml-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Regenerate Timeline</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold uppercase tracking-wider mr-2">
          <Filter className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>Filters:</span>
        </div>

        {/* Phase Filter */}
        <div>
          <label htmlFor="filter-phase" className="sr-only">
            Filter by Phase
          </label>
          <select
            id="filter-phase"
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Phases ({allPhases.length})</option>
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
            className="px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
            Filter by Completion
          </label>
          <select
            id="filter-status"
            value={filterCompleted}
            onChange={(e) => setFilterCompleted(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-medium text-stone-800 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>

        <span className="text-xs text-stone-500 ml-auto">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {/* Task List Grouped by Phase */}
      <div className="space-y-6">
        {allPhases
          .filter((phase) => selectedPhase === 'all' || selectedPhase === phase)
          .map((phase) => {
            const phaseTasks = filteredTasks.filter((t) => t.phase === phase);
            if (phaseTasks.length === 0) return null;

            const phaseCompleted = phaseTasks.filter((t) => t.completed).length;

            return (
              <section
                key={phase}
                aria-labelledby={`phase-heading-${phase.replace(/\s+/g, '-').toLowerCase()}`}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
              >
                <div className="bg-stone-50/80 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
                  <h3
                    id={`phase-heading-${phase.replace(/\s+/g, '-').toLowerCase()}`}
                    className="font-bold text-sm text-stone-900 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>{phase}</span>
                  </h3>
                  <span className="text-xs font-semibold text-stone-500 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                    {phaseCompleted} / {phaseTasks.length} done
                  </span>
                </div>

                <ul className="divide-y divide-stone-100">
                  {phaseTasks.map((task) => {
                    const checkId = `task-check-${task.id}`;
                    const pStyle = priorityStyles[task.priority] || priorityStyles.Medium;

                    return (
                      <li
                        key={task.id}
                        className={`p-4 sm:p-5 transition-colors flex items-start gap-3.5 ${
                          task.completed ? 'bg-stone-50/50' : 'hover:bg-amber-50/30'
                        }`}
                      >
                        <div className="pt-0.5">
                          <input
                            id={checkId}
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="w-5 h-5 rounded-md border-stone-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <label
                              htmlFor={checkId}
                              className={`text-sm font-bold cursor-pointer ${
                                task.completed
                                  ? 'line-through text-stone-400'
                                  : 'text-stone-900'
                              }`}
                            >
                              {task.title}
                            </label>

                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}
                            >
                              {task.priority} Priority
                            </span>

                            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Clock className="w-3 h-3 text-stone-400" aria-hidden="true" />
                              {task.timeOffset}
                            </span>

                            <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <User className="w-3 h-3 text-stone-400" aria-hidden="true" />
                              {task.owner}
                            </span>
                          </div>

                          <p
                            className={`text-xs mt-1 leading-relaxed ${
                              task.completed ? 'text-stone-400' : 'text-stone-600'
                            }`}
                          >
                            {task.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
      </div>

      {/* Screen Reader ARIA Live Region for Task Updates */}
      <div className="sr-only" aria-live="polite">
        {lastToggledTask || ''}
      </div>
    </div>
  );
}
