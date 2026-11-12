'use client';

import Link from 'next/link';
import { Printer, Plus } from 'lucide-react';
import type { CleaningCategory } from '@/lib/types/cleanings';

interface CleaningsHeaderProps {
  category: CleaningCategory;
  onOpenNewModal: () => void;
  onOpenPrintDaily: () => void;
}

export function CleaningsHeader({
  category,
  onOpenNewModal,
  onOpenPrintDaily,
}: CleaningsHeaderProps) {
  const isAirbnb = category === 'airbnb';

  return (
    <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div className="space-y-2 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
            {isAirbnb ? 'Καθαρισμοί Airbnb' : 'Καθαρισμοί Ξενοδοχείων'}
          </h2>

          <nav
            aria-label="Κατηγορία καθαρισμών"
            className="inline-flex items-center p-0.5 bg-white border border-border rounded-lg text-xs"
          >
            <Link
              href="/admin/cleanings/airbnb"
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                isAirbnb ? 'bg-navy text-white' : 'text-muted hover:text-navy'
              }`}
            >
              Airbnb
            </Link>
            <Link
              href="/admin/cleanings/hotels"
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                !isAirbnb ? 'bg-navy text-white' : 'text-muted hover:text-navy'
              }`}
            >
              Ξενοδοχεία
            </Link>
            <Link
              href="/admin/cleanings/clients"
              className="px-3 py-1 rounded-md font-semibold text-muted hover:text-navy transition-colors"
            >
              Πελατολόγιο
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onOpenPrintDaily}
          className="inline-flex items-center justify-center gap-1.5 min-h-10 px-3.5 py-2 bg-white hover:bg-warm-white text-navy font-semibold rounded-lg text-xs sm:text-sm border border-border hover:border-navy/30 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-muted" strokeWidth={1.75} />
          <span>Ημερήσιο Πρόγραμμα</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewModal}
          className="inline-flex items-center justify-center gap-1.5 min-h-10 px-4 py-2 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>Νέος Καθαρισμός</span>
        </button>
      </div>
    </header>
  );
}
