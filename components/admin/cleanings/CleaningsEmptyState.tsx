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
    <div className="bg-white border border-slate-200/90 rounded-xl p-8 sm:p-14 text-center shadow-2xs">
      <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400 border border-slate-200/60">
        {isAirbnb ? <Home className="w-6 h-6" /> : <Building className="w-6 h-6" />}
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-1">
        Δεν βρέθηκαν καθαρισμοί
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5">
        {hasActiveFilters
          ? 'Δεν υπάρχουν αποστολές που να ταιριάζουν με τα επιλεγμένα κριτήρια αναζήτησης ή ημερομηνίας.'
          : 'Δεν έχει καταχωρηθεί ακόμα κανένας καθαρισμός για αυτήν την κατηγορία.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Επαναφορά φίλτρων</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpenNewModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-teal hover:bg-teal-dark shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Νέος Καθαρισμός</span>
        </button>
      </div>
    </div>
  );
}

