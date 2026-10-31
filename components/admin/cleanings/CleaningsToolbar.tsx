'use client';

import { Search, X, LayoutGrid, List, Filter, RotateCcw } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

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
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 sm:p-3.5 shadow-2xs space-y-2.5">
      {/* Top Row: Search Input + Status Filter + View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Αναζήτηση με όνομα καταλύματος, οδό, πελάτη, κωδικό lockbox..."
            className="w-full bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Καθαρισμός αναζήτησης"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-[165px] sm:min-w-[190px]">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
            <CustomSelect
              value={statusFilter}
              onChange={onStatusFilterChange}
              size="sm"
              variant="filter"
              options={[
                { value: 'all', label: 'Όλες οι καταστάσεις', colorDot: 'bg-slate-400' },
                { value: 'scheduled', label: 'Προγραμματισμένοι', colorDot: 'bg-blue-500' },
                { value: 'in_progress', label: 'Σε εξέλιξη', colorDot: 'bg-amber-500' },
                { value: 'completed', label: 'Ολοκληρωμένοι', colorDot: 'bg-emerald-500' },
                { value: 'cancelled', label: 'Ακυρωμένοι', colorDot: 'bg-slate-400' },
              ]}
            />
          </div>

          {/* View Mode Switcher (Visible on both mobile & desktop) */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              title="Προβολή Καρτών"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              title="Προβολή Πίνακα"
              className={`p-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Date Segment Filter & Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2.5 border-t border-slate-100 text-xs">
        {/* Date Selector Segment Tabs & Dedicated Date Input */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Segment Tabs */}
          <div className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => {
                onDateFilterChange('today');
                onCustomDateChange('');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Σήμερα
            </button>
            <button
              type="button"
              onClick={() => {
                onDateFilterChange('tomorrow');
                onCustomDateChange('');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                dateFilter === 'tomorrow'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Αύριο
            </button>
            <button
              type="button"
              onClick={() => {
                onDateFilterChange('all');
                onCustomDateChange('');
              }}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Όλες οι Ημέρες
            </button>
          </div>

          {/* Dedicated Custom Date Picker Pill */}
          <div className="relative inline-flex items-center">
            <input
              type="date"
              value={customDate}
              onChange={(e) => {
                const val = e.target.value;
                onCustomDateChange(val);
                onDateFilterChange(val ? 'custom' : 'all');
              }}
              title="Επιλογή συγκεκριμένης ημερομηνίας"
              className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                dateFilter === 'custom' && customDate
                  ? 'border-teal bg-teal/10 text-teal font-bold shadow-2xs'
                  : 'border-slate-200/80 bg-white text-slate-600 hover:border-slate-300'
              }`}
            />
            {customDate && dateFilter === 'custom' && (
              <button
                type="button"
                onClick={() => {
                  onCustomDateChange('');
                  onDateFilterChange('all');
                }}
                className="ml-1 p-1 text-slate-400 hover:text-slate-600 rounded"
                title="Καθαρισμός ημερομηνίας"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Counter & Reset Filter Action */}
        <div className="flex items-center gap-3 justify-between sm:justify-end text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span>Σύνολο:</span>
            <span className="bg-slate-100 text-slate-900 font-extrabold px-2 py-0.5 rounded-md tabular-nums border border-slate-200/70">
              {totalFiltered}
            </span>
          </span>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-teal hover:text-teal-dark hover:underline cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Καθαρισμός φίλτρων</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
