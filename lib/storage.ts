import { EventPlan, EventPlanSchema } from './schemas';

const STORAGE_KEY = 'eventcraft_current_plan';
const DRAFT_INTAKE_KEY = 'eventcraft_draft_intake';

/**
 * Safely loads and parses the stored EventPlan from localStorage.
 * Validates against Zod schema to ensure backwards compatibility and data integrity.
 */
export function loadPlanFromStorage(): EventPlan | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const result = EventPlanSchema.safeParse(parsed);

    if (!result.success) {
      console.warn('Stored plan failed schema validation:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
}

/**
 * Safely saves the EventPlan to localStorage.
 */
export function savePlanToStorage(plan: EventPlan): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const validated = EventPlanSchema.parse(plan);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    return true;
  } catch (error) {
    console.error('Failed to write plan to localStorage:', error);
    return false;
  }
}

/**
 * Removes the stored plan from localStorage.
 */
export function clearPlanFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear plan from localStorage:', error);
  }
}
