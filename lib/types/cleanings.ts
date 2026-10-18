export type CleaningCategory = 'airbnb' | 'hotel';

export type CleaningStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type CleaningPriority = 'normal' | 'high' | 'urgent';

export interface CleaningProperty {
  id: string;
  client_id: string;
  name: string; // π.χ. "Acropolis Suite", "Δωμάτιο 204"
  address: string; // Οδός & Αριθμός
  area?: string; // Περιοχή / Πόλη
  floor?: string; // π.χ. "3ος όροφος", "Ισόγειο"
  access_code?: string; // π.χ. "Lockbox 4821#"
  entry_instructions?: string; // Οδηγίες για τον οδηγό και την καθαρίστρια
  cleaning_instructions?: string; // Ειδικές σημειώσεις καθαρισμού
  created_at?: string;
  updated_at?: string;
}

export interface CleaningClient {
  id: string;
  category: CleaningCategory;
  name: string;
  contact_person?: string;
  phone: string;
  email?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  properties?: CleaningProperty[];
  total_cleanings?: number;
}

export interface CleaningRecord {
  id: string;
  category: CleaningCategory;
  client_id?: string | null;
  property_id?: string | null;
  // Snapshot / Display fields
  client_name: string;
  client_phone?: string;
  property_name: string;
  address: string;
  area?: string;
  floor?: string;
  access_code?: string;
  entry_instructions?: string;
  cleaning_instructions?: string;
  // Operational fields
  scheduled_date: string; // 'YYYY-MM-DD'
  scheduled_time?: string; // π.χ. "11:00 - 14:00"
  status: CleaningStatus;
  priority: CleaningPriority;
  cleaner_name?: string;
  driver_name?: string;
  linen_requirements?: string;
  special_notes?: string;
  price?: number | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string | null;
}

export type ActionResult<T = unknown> = {
  success: boolean;
  error?: string;
  data?: T;
  id?: string;
};

export const CLEANING_STATUS_CONFIG: Record<
  CleaningStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  scheduled: {
    label: 'Προγραμματισμένος',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  in_progress: {
    label: 'Σε Εξέλιξη',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Ολοκληρώθηκε',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Ακυρώθηκε',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
};

export const CLEANING_PRIORITY_CONFIG: Record<
  CleaningPriority,
  { label: string; bg: string; text: string; border: string }
> = {
  normal: {
    label: 'Κανονική',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
  },
  high: {
    label: 'Υψηλή',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
  },
  urgent: {
    label: 'Επείγον!',
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-300',
  },
};
