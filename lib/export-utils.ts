import { EventPlan } from './schemas';
import { formatCurrency } from './budget-math';

/**
 * Escapes a cell value for standard CSV (RFC 4180 compliant).
 */
export function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates an executive structured CSV representation of an EventPlan.
 */
export function generatePlanCsv(plan: EventPlan): string {
  const lines: string[] = [];

  // Header / Metadata
  lines.push(['EVENT PLAN SUMMARY'].map(escapeCsvCell).join(','));
  lines.push(['Title', plan.intake.eventTitle].map(escapeCsvCell).join(','));
  lines.push(['Event Type', plan.intake.eventType].map(escapeCsvCell).join(','));
  lines.push(['Date', plan.intake.eventDate].map(escapeCsvCell).join(','));
  lines.push(['Location', plan.intake.location].map(escapeCsvCell).join(','));
  lines.push(['Guest Count', plan.intake.guestCount].map(escapeCsvCell).join(','));
  lines.push(
    ['Total Budget', `${formatCurrency(plan.budget.totalBudget, plan.budget.currency)} (${plan.budget.currency})`].map(escapeCsvCell).join(',')
  );
  lines.push(['Theme / Vibe', plan.intake.themeVibe].map(escapeCsvCell).join(','));
  lines.push(['Executive Summary', plan.executiveSummary].map(escapeCsvCell).join(','));
  lines.push('');

  // 1. Budget Breakdown
  lines.push(['1. BUDGET BREAKDOWN'].map(escapeCsvCell).join(','));
  lines.push(['Category', 'Percentage (%)', 'Allocated Amount', 'Notes / Guidance'].map(escapeCsvCell).join(','));
  for (const item of plan.budget.items) {
    lines.push([
      item.category,
      `${item.percentage}%`,
      formatCurrency(item.allocatedAmount, plan.budget.currency),
      item.notes,
    ].map(escapeCsvCell).join(','));
  }
  lines.push([
    'TOTAL',
    '100%',
    formatCurrency(plan.budget.totalBudget, plan.budget.currency),
    `Contingency buffer: ${formatCurrency(plan.budget.contingencyAmount, plan.budget.currency)}`,
  ].map(escapeCsvCell).join(','));
  lines.push('');

  // 2. Timeline Tasks
  lines.push(['2. TIMELINE SCHEDULE'].map(escapeCsvCell).join(','));
  lines.push(['Phase', 'Timing', 'Task Title', 'Priority', 'Owner', 'Status', 'Description'].map(escapeCsvCell).join(','));
  for (const task of plan.timeline.tasks) {
    lines.push([
      task.phase,
      task.timeOffset,
      task.title,
      task.priority,
      task.owner,
      task.completed ? 'COMPLETED' : 'PENDING',
      task.description,
    ].map(escapeCsvCell).join(','));
  }
  lines.push('');

  // 3. Vendor Checklist
  lines.push(['3. VENDOR CHECKLIST'].map(escapeCsvCell).join(','));
  lines.push(['Category', 'Vendor Role', 'Estimated Cost', 'Status', 'Key Questions to Ask', 'Comparison Criteria'].map(escapeCsvCell).join(','));
  for (const vendor of plan.vendors.vendors) {
    lines.push([
      vendor.category,
      vendor.vendorRole,
      vendor.estimatedCostRange,
      vendor.booked ? 'BOOKED' : 'NOT BOOKED',
      vendor.questionsToAsk.join(' | '),
      vendor.comparisonCriteria.join(' | '),
    ].map(escapeCsvCell).join(','));
  }
  lines.push('');

  // 4. Personalized Ideas & Menu
  lines.push(['4. PERSONALIZED IDEAS & MENU'].map(escapeCsvCell).join(','));
  lines.push(['Signature Drink', plan.ideas.customMenu.signatureCocktailMocktail].map(escapeCsvCell).join(','));
  lines.push(['Appetizers', plan.ideas.customMenu.appetizers.join('; ')].map(escapeCsvCell).join(','));
  lines.push(['Mains', plan.ideas.customMenu.mains.join('; ')].map(escapeCsvCell).join(','));
  lines.push(['Dessert', plan.ideas.customMenu.dessert].map(escapeCsvCell).join(','));
  lines.push(['Dietary Accommodations', plan.ideas.customMenu.dietaryNotes].map(escapeCsvCell).join(','));
  lines.push('');

  // 5. Personalized Ideas & Hacks
  lines.push(['5. MONEY-SAVING TIPS & HACKS'].map(escapeCsvCell).join(','));
  lines.push(['Tip Title', 'Estimated Savings', 'Actionable Steps'].map(escapeCsvCell).join(','));
  for (const hack of plan.ideas.moneySavingHacks) {
    lines.push([
      hack.tip,
      hack.estimatedSavings,
      hack.implementation,
    ].map(escapeCsvCell).join(','));
  }

  return lines.join('\r\n');
}

/**
 * Triggers browser download of a file with given content, filename, and MIME type.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  if (typeof window === 'undefined') return;

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Exports current plan as formatted JSON file.
 */
export function exportPlanAsJson(plan: EventPlan): void {
  const jsonContent = JSON.stringify(plan, null, 2);
  const safeTitle = plan.intake.eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(jsonContent, `eventcraft-${safeTitle}.json`, 'application/json');
}

/**
 * Exports current plan as CSV file.
 */
export function exportPlanAsCsv(plan: EventPlan): void {
  const csvContent = generatePlanCsv(plan);
  const safeTitle = plan.intake.eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  downloadFile(csvContent, `eventcraft-${safeTitle}.csv`, 'text/csv;charset=utf-8;');
}
