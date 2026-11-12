'use client';

import { Home, Building, Plus, RotateCcw } from 'lucide-react';
import type { CleaningCategory } from '@/lib/types/cleanings';

interface CleaningsEmptyStateProps {
  category: CleaningCategory;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onOpenNewModal: () => void;
}

export function CleaningsEmptyState({
  category,
  hasActiveFilters,
  onResetFilters,
  onOpenNewModal,
}: CleaningsEmptyStateProps) {
  const isAirbnb = category === 'airbnb';

  return (
    <div className="bg-white border border-border rounded-xl p-8 sm:p-12 text-center">
      {isAirbnb ? (
        <Home className="w-6 h-6 text-muted-light mx-auto mb-3" strokeWidth={1.75} />
      ) : (
        <Building className="w-6 h-6 text-muted-light mx-auto mb-3" strokeWidth={1.75} />
      )}
      <h3 className="text-base sm:text-lg font-bold text-navy font-heading mb-1">
        Δεν βρέθηκαν καθαρισμοί
      </h3>
      <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mb-5">
        {hasActiveFilters
          ? 'Δεν υπάρχουν αποστολές που να ταιριάζουν με τα επιλεγμένα κριτήρια αναζήτησης ή ημερομηνίας.'
          : 'Δεν έχει καταχωρηθεί ακόμα κανένας καθαρισμός για αυτήν την κατηγορία.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 min-h-10 px-3.5 py-2 rounded-lg text-xs font-semibold text-navy bg-warm-white border border-border hover:border-navy/40 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-muted" strokeWidth={1.75} />
            <span>Επαναφορά φίλτρων</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenNewModal}
          className="inline-flex items-center gap-1.5 min-h-10 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-teal-dark hover:bg-navy transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span>Νέος Καθαρισμός</span>
        </button>
      </div>
    </div>
  );
}

