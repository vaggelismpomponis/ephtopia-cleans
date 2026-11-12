'use client';

import { Search, X, LayoutGrid, List, RotateCcw } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { CLEANING_STATUS_OPTIONS } from './cleaningDisplayHelpers';

interface CleaningsToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  dateFilter: string;
  onDateFilterChange: (df: string) => void;
  customDate: string;
  onCustomDateChange: (date: string) => void;
  statusFilter: string;
  onStatusFilterChange: (sf: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (vm: 'table' | 'grid') => void;
  totalFiltered: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const DATE_TABS = [
  { id: 'today', label: 'Σήμερα' },
  { id: 'tomorrow', label: 'Αύριο' },
  { id: 'all', label: 'Όλες' },
] as const;

export function CleaningsToolbar({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  customDate,
  onCustomDateChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  onResetFilters,
  hasActiveFilters,
}: CleaningsToolbarProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-3 flex flex-col xl:flex-row xl:items-center gap-2.5">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Αναζήτηση καταλύματος, πελάτη, διεύθυνσης ή κωδικού..."
          className="w-full h-9 bg-warm-white/60 focus:bg-white border border-border rounded-lg pl-9 pr-8 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Καθαρισμός αναζήτησης"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-muted hover:text-navy cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <div className="inline-flex items-center p-0.5 bg-warm-white rounded-lg border border-border text-xs font-semibold">
          {DATE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onDateFilterChange(tab.id);
                onCustomDateChange('');
              }}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                dateFilter === tab.id ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          type="date"
          value={customDate}
          onChange={(e) => {
            const val = e.target.value;
            onCustomDateChange(val);
            onDateFilterChange(val ? 'custom' : 'all');
          }}
          aria-label="Επιλογή ημερομηνίας"
          className={`h-9 text-xs px-2.5 rounded-lg border cursor-pointer transition-colors ${
            dateFilter === 'custom' && customDate
              ? 'border-teal text-teal-dark font-semibold bg-warm-white'
              : 'border-border bg-white text-muted hover:text-navy'
          }`}
        />

        <div className="min-w-[155px]">
          <CustomSelect value={statusFilter} onChange={onStatusFilterChange} size="sm" variant="filter" options={CLEANING_STATUS_OPTIONS} />
        </div>

        <div className="inline-flex items-center p-0.5 bg-warm-white rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            aria-label="Προβολή Πίνακα"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
            }`}
          >
            <List className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            aria-label="Προβολή Καρτών"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
            }`}
          >
            <LayoutGrid className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <span className="text-xs text-muted font-medium tabular-nums px-1">{totalFiltered}</span>

        {hasActiveFilters && (
          <button type="button" onClick={onResetFilters} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-dark hover:underline cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span className="hidden sm:inline">Επαναφορά</span>
          </button>
        )}
      </div>
    </div>
  );
}
