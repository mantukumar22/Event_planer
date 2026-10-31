/**
 * @file lib/ics-export.ts
 * @description Single responsibility: Pure function generator for standard iCalendar (.ics) files
 * conforming to RFC 5545 for importing event milestones and day-of schedules into Google Calendar, Apple Calendar, or Outlook.
 */

import { EventPlan } from './schemas';

function formatIcsDateTime(dateStr: string, timeStr?: string): string {
  // Expected dateStr: YYYY-MM-DD
  const cleanDate = dateStr.replace(/-/g, '');

  if (!timeStr) {
    // All day date
    return `${cleanDate}`;
  }

  // Parse time e.g. "09:00 AM", "14:30", "05:30 PM"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) {
    return `${cleanDate}T090000Z`;
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = match[3]?.toUpperCase();

  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;

  const paddedH = String(hours).padStart(2, '0');
  return `${cleanDate}T${paddedH}${minutes}00`;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Pure function: Generates standard RFC 5545 iCalendar format text from an EventPlan.
 */
export function generateIcsContent(plan: EventPlan): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EventCraft AI//Event Schedule RFC 5545//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(plan.intake.eventTitle)}`,
  ];

  // 1. Add Main Event Day entry
  const mainEventStart = formatIcsDateTime(plan.intake.eventDate, '10:00 AM');
  const mainEventEnd = formatIcsDateTime(plan.intake.eventDate, '23:00 PM');
  lines.push(
    'BEGIN:VEVENT',
    `UID:main-${plan.id}@eventcraft.ai`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${mainEventStart}`,
    `DTEND:${mainEventEnd}`,
    `SUMMARY:${escapeIcsText(plan.intake.eventTitle)}`,
    `DESCRIPTION:${escapeIcsText(
      `${plan.executiveSummary}\\n\\nBudget: ${plan.budget.totalBudget} ${plan.budget.currency}\\nGuests: ${plan.intake.guestCount}`
    )}`,
    `LOCATION:${escapeIcsText(plan.intake.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT'
  );

  // 2. Add Day-Of Run of Show entries if available
  const dayOf = plan.timeline.dayOfSchedule || [];
  dayOf.forEach((item, idx) => {
    const itemStart = formatIcsDateTime(plan.intake.eventDate, item.time);
    lines.push(
      'BEGIN:VEVENT',
      `UID:runofshow-${plan.id}-${idx}@eventcraft.ai`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${itemStart}`,
      `SUMMARY:[${item.time}] ${escapeIcsText(item.activity)}`,
      `DESCRIPTION:${escapeIcsText(`Owner: ${item.owner}\\nNotes: ${item.notes || 'Run of show milestone'}`)}`,
      `LOCATION:${escapeIcsText(plan.intake.location)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  // 3. Add Planning Milestones
  plan.timeline.tasks.forEach((task, idx) => {
    lines.push(
      'BEGIN:VEVENT',
      `UID:task-${task.id || idx}@eventcraft.ai`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART;VALUE=DATE:${plan.intake.eventDate.replace(/-/g, '')}`,
      `SUMMARY:Milestone: ${escapeIcsText(task.title)}`,
      `DESCRIPTION:${escapeIcsText(
        `Phase: ${task.phase}\\nOffset: ${task.timeOffset}\\nOwner: ${task.owner}\\nPriority: ${task.priority}\\nDetails: ${task.description}`
      )}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Client-side helper to trigger direct .ics download in the browser.
 */
export function downloadIcsFile(plan: EventPlan): void {
  const content = generateIcsContent(plan);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeTitle = plan.intake.eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `${safeTitle || 'event'}-schedule.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
