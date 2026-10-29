export * from './schemas';

export type PlanTabId = 'budget' | 'timeline' | 'vendors' | 'ideas';

export interface PlanTabItem {
  id: PlanTabId;
  label: string;
  badge?: string | number;
}
