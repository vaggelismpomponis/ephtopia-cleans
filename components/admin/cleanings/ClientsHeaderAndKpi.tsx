'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ClientsHeaderAndKpiProps {
  stats: {
    totalClients: number;
    totalProperties: number;
    airbnbClients: number;
    hotelClients: number;
  };
  categoryFilter: 'all' | 'airbnb' | 'hotel';
  onCategoryFilterChange: (cat: 'all' | 'airbnb' | 'hotel') => void;
  onOpenNewClient: () => void;
}

export function ClientsHeaderAndKpi({
  stats,
  categoryFilter,
  onCategoryFilterChange,
  onOpenNewClient,
}: ClientsHeaderAndKpiProps) {
  const cards = [
    {
      key: 'all' as const,
      label: 'Σύνολο Πελατών',
      value: stats.totalClients,
      meta: 'Ενεργό πελατολόγιο',
      active: categoryFilter === 'all',
      onClick: () => onCategoryFilterChange('all'),
    },
    {
      key: 'props' as const,
      label: 'Καταλύματα & Μονάδες',
      value: stats.totalProperties,
      meta: 'Καταχωρημένα ακίνητα',
      active: false,
      onClick: undefined,
    },
    {
      key: 'airbnb' as const,
      label: 'Airbnb Hosts',
      value: stats.airbnbClients,
      meta: 'Ιδιοκτήτες & διαχειριστές',
      active: categoryFilter === 'airbnb',
      onClick: () => onCategoryFilterChange(categoryFilter === 'airbnb' ? 'all' : 'airbnb'),
    },
    {
      key: 'hotel' as const,
      label: 'Ξενοδοχεία',
      value: stats.hotelClients,
      meta: 'Ξενοδοχειακές μονάδες',
      active: categoryFilter === 'hotel',
      onClick: () => onCategoryFilterChange(categoryFilter === 'hotel' ? 'all' : 'hotel'),
    },
  ];

  return (
    <>
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
            Πελατολόγιο &amp; Καταλύματα
          </h2>

          <nav
            aria-label="Κατηγορία καθαρισμών"
            className="inline-flex items-center p-0.5 bg-white border border-border rounded-lg text-xs"
          >
            <Link
              href="/admin/cleanings/airbnb"
              className="px-3 py-1 rounded-md font-semibold text-muted hover:text-navy transition-colors"
            >
              Airbnb
            </Link>
            <Link
              href="/admin/cleanings/hotels"
              className="px-3 py-1 rounded-md font-semibold text-muted hover:text-navy transition-colors"
            >
              Ξενοδοχεία
            </Link>
            <Link
              href="/admin/cleanings/clients"
              className="px-3 py-1 rounded-md font-semibold bg-navy text-white transition-colors"
            >
              Πελατολόγιο
            </Link>
          </nav>
        </div>

        <button
          type="button"
          onClick={onOpenNewClient}
          className="inline-flex items-center justify-center gap-1.5 min-h-10 px-4 py-2 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg text-xs sm:text-sm transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>Νέος Πελάτης</span>
        </button>
      </header>

      <section aria-label="Στατιστικά πελατολογίου">
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-border rounded-xl bg-white divide-y lg:divide-y-0 sm:divide-x divide-border overflow-hidden">
          {cards.map((card) => {
            const inner = (
              <>
                {card.active && (
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-teal-dark" aria-hidden="true" />
                )}
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block truncate">
                  {card.label}
                </span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
                    {card.value}
                  </span>
                </div>
                <p className="text-xs text-muted mt-1 truncate">{card.meta}</p>
              </>
            );

            return card.onClick ? (
              <button
                key={card.key}
                type="button"
                onClick={card.onClick}
                aria-pressed={card.active}
                className={`text-left p-4 sm:p-5 transition-colors cursor-pointer min-w-0 relative ${card.active ? 'bg-warm-white' : 'hover:bg-warm-white/60'
                  }`}
              >
                {inner}
              </button>
            ) : (
              <div key={card.key} className="p-4 sm:p-5 min-w-0 relative">
                {inner}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

