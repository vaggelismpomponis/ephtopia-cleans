import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export interface DashboardKpiBarProps {
  todayTotal: number;
  todayCompleted: number;
  completionRate: number;
  inProgressCount: number;
  upcomingCount: number;
  totalClients: number;
  totalProperties: number;
  activeJobsCount: number;
  newApplicationsCount: number;
}

export function DashboardKpiBar({
  todayTotal,
  todayCompleted,
  completionRate,
  inProgressCount,
  upcomingCount,
  totalClients,
  totalProperties,
  activeJobsCount,
  newApplicationsCount,
}: DashboardKpiBarProps) {
  const cards = [
    {
      label: 'Σημερινοί Καθαρισμοί',
      value: todayTotal.toString(),
      subtext:
        todayTotal > 0
          ? `${todayCompleted} ολοκληρωμένοι (${completionRate}%)`
          : 'Καμία προγραμματισμένη εργασία σήμερα',
      href: '/admin/cleanings/airbnb',
      highlight: false,
    },
    {
      label: 'Σε Εξέλιξη & Προσεχώς',
      value: (inProgressCount + upcomingCount).toString(),
      subtext: `${inProgressCount} σε εξέλιξη · ${upcomingCount} προσεχείς`,
      href: '/admin/cleanings/hotels',
      highlight: inProgressCount > 0,
    },
    {
      label: 'Πελάτες & Ακίνητα',
      value: totalProperties.toString(),
      subtext: `Σε ${totalClients} ενεργούς πελάτες`,
      href: '/admin/cleanings/clients',
      highlight: false,
    },
    {
      label: 'Αιτήσεις & Θέσεις',
      value: newApplicationsCount.toString(),
      subtext: `Νέες αιτήσεις · ${activeJobsCount} ενεργές θέσεις`,
      href: '/admin/applications',
      highlight: newApplicationsCount > 0,
    },
  ];

  return (
    <section aria-label="Βασικοί δείκτες λειτουργίας">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 border border-border rounded-xl bg-white divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group p-5 flex flex-col justify-between gap-3 hover:bg-warm-white transition-colors min-w-0"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted truncate">
                {card.label}
              </span>
              <ArrowUpRight
                className="w-4 h-4 text-muted-light group-hover:text-teal-dark transition-colors shrink-0"
                strokeWidth={1.75}
              />
            </div>

            <div className="flex items-baseline gap-2.5">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
                {card.value}
              </span>
              {card.highlight && (
                <span className="text-[11px] font-semibold text-teal-dark uppercase tracking-wider">
                  Ενεργό
                </span>
              )}
            </div>

            <p className="text-xs text-muted truncate">{card.subtext}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

