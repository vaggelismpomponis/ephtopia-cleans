'use client';

import Link from 'next/link';
import { Home, Building, Users, Printer, Plus } from 'lucide-react';
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
    <header className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      {/* Title & Segment Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 min-w-0">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center shrink-0 border ${
              isAirbnb
                ? 'bg-teal/10 text-teal border-teal/20'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}
          >
            {isAirbnb ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading tracking-tight truncate">
                {isAirbnb ? 'Καθαρισμοί Airbnb' : 'Καθαρισμοί Ξενοδοχείων'}
              </h1>
              <span
                className={`hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                  isAirbnb
                    ? 'bg-teal/10 text-teal border-teal/25'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}
              >
                {isAirbnb ? 'Turnovers & Check-ins' : 'Housekeeping & Units'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              {isAirbnb
                ? 'Διαχείριση καταλυμάτων, lockbox κωδικών & δελτίων αποστολής'
                : 'Διαχείριση δωματίων, ορόφων & παραδόσεων ιματισμού'}
            </p>
          </div>
        </div>

        {/* Quick Segment Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200/80 self-start sm:self-auto shrink-0">
          <Link
            href="/admin/cleanings/airbnb"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              isAirbnb
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isAirbnb ? 'text-teal' : 'text-slate-400'}`} />
            <span>Airbnb</span>
          </Link>

          <Link
            href="/admin/cleanings/hotels"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              !isAirbnb
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className={`w-3.5 h-3.5 ${!isAirbnb ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>Ξενοδοχεία</span>
          </Link>

          <Link
            href="/admin/cleanings/clients"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Πελατολόγιο</span>
            <span className="sm:hidden">Πελάτες</span>
          </Link>
        </div>
      </div>

      {/* Primary Action Buttons (matching equal width and height) */}
      <div className="flex items-center gap-2.5 w-full sm:w-auto">
        <button
          type="button"
          onClick={onOpenPrintDaily}
          className="flex-1 sm:flex-none sm:w-52 h-10 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-4 rounded-lg text-xs sm:text-sm border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors whitespace-nowrap cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600 shrink-0" />
          <span>Ημερήσιο Πρόγραμμα</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewModal}
          className="flex-1 sm:flex-none sm:w-52 h-10 inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold px-4 rounded-lg text-xs sm:text-sm shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Νέος Καθαρισμός</span>
        </button>
      </div>
    </header>
  );
}

