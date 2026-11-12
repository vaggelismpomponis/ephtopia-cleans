'use client';

import { Search, X } from 'lucide-react';

interface ClientsToolbarProps {
  categoryFilter: 'all' | 'airbnb' | 'hotel';
  onCategoryFilterChange: (cat: 'all' | 'airbnb' | 'hotel') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  counts: {
    all: number;
    airbnb: number;
    hotel: number;
    filtered: number;
  };
}

export function ClientsToolbar({
  categoryFilter,
  onCategoryFilterChange,
  searchQuery,
  onSearchChange,
  counts,
}: ClientsToolbarProps) {
  const tabs = [
    { id: 'all' as const, label: `Όλοι (${counts.all})` },
    { id: 'airbnb' as const, label: `Airbnb (${counts.airbnb})` },
    { id: 'hotel' as const, label: `Ξενοδοχεία (${counts.hotel})` },
  ];

  return (
    <div className="bg-white border border-border rounded-xl p-3 flex flex-col lg:flex-row lg:items-center gap-2.5">
      <div className="relative flex-1 min-w-0">
        <Search className="w-4 h-4 text-muted-light absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Αναζήτηση πελάτη, τηλεφώνου, καταλύματος ή κωδικού..."
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

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <div className="inline-flex items-center p-0.5 bg-warm-white rounded-lg border border-border text-xs font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onCategoryFilterChange(tab.id)}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${categoryFilter === tab.id ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-muted font-medium tabular-nums px-1">
          {counts.filtered} από {counts.all}
        </span>
      </div>
    </div>
  );
}

