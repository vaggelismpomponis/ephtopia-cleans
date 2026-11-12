import type { CleaningRecord } from '@/lib/types/cleanings';

export const CLEANING_STATUS_OPTIONS = [
  { value: 'all', label: 'Όλες οι καταστάσεις', colorDot: 'bg-slate-400' },
  { value: 'scheduled', label: 'Προγραμματισμένοι', colorDot: 'bg-blue-500' },
  { value: 'in_progress', label: 'Σε εξέλιξη', colorDot: 'bg-amber-500' },
  { value: 'completed', label: 'Ολοκληρωμένοι', colorDot: 'bg-emerald-500' },
  { value: 'cancelled', label: 'Ακυρωμένοι', colorDot: 'bg-slate-400' },
];

export function getCleaningDisplayName(c: CleaningRecord): string {
  if (!c.property_name || c.property_name.trim() === '-') {
    return c.address || c.client_name || 'Κατάλυμα';
  }
  return c.property_name;
}

export function formatCleaningDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('el-GR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function getCleaningCrewLabel(c: CleaningRecord): string {
  const parts = [c.cleaner_name, c.driver_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' · ') : 'Χωρίς ανάθεση';
}
