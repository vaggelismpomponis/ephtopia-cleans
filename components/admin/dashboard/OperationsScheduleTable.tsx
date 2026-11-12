import Link from 'next/link';
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { CleaningRecord } from '@/lib/types/cleanings';
import {
  ScheduleMobileCard,
  ScheduleDesktopRow,
} from '@/components/admin/dashboard/ScheduleRowViews';

interface OperationsScheduleTableProps {
  cleanings: CleaningRecord[];
  todayStr: string;
}

export function OperationsScheduleTable({
  cleanings,
  todayStr,
}: OperationsScheduleTableProps) {
  return (
    <section className="bg-white border border-border rounded-xl overflow-hidden flex flex-col min-w-0">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h3 className="font-heading text-base font-bold text-navy">
            Προγραμματισμένοι Καθαρισμοί
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Σημερινό και προσεχές πρόγραμμα συνεργείων (έως 8 εγγραφές)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/cleanings/airbnb"
            className="text-xs font-semibold text-navy hover:text-teal-dark px-2.5 py-1.5 rounded-lg border border-border hover:border-teal/40 transition-colors"
          >
            Airbnb
          </Link>
          <Link
            href="/admin/cleanings/hotels"
            className="text-xs font-semibold text-navy hover:text-teal-dark px-2.5 py-1.5 rounded-lg border border-border hover:border-teal/40 transition-colors"
          >
            Ξενοδοχεία
          </Link>
        </div>
      </div>

      {cleanings.length === 0 ? (
        <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center gap-3">
          <Calendar className="w-6 h-6 text-muted-light" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-semibold text-navy">
              Δεν υπάρχουν προγραμματισμένοι καθαρισμοί
            </p>
            <p className="text-xs text-muted mt-1">
              Δημιουργήστε έναν νέο καθαρισμό Airbnb ή Ξενοδοχείου για να ξεκινήσει το πρόγραμμα.
            </p>
          </div>
          <Link
            href="/admin/cleanings/airbnb"
            className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            Νέος Καθαρισμός
          </Link>
        </div>
      ) : (
        <>
          <div className="divide-y divide-border md:hidden">
            {cleanings.map((cleaning) => (
              <ScheduleMobileCard key={cleaning.id} cleaning={cleaning} todayStr={todayStr} />
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-warm-white/60 text-[11px] font-semibold uppercase tracking-wider text-muted">
                  <th className="py-2.5 px-4">Ακίνητο / Πελάτης</th>
                  <th className="py-2.5 px-3">Τύπος</th>
                  <th className="py-2.5 px-3">Ημερομηνία &amp; Ώρα</th>
                  <th className="py-2.5 px-3">Συνεργείο</th>
                  <th className="py-2.5 px-3">Κατάσταση</th>
                  <th className="py-2.5 px-4 text-right">Ενέργεια</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {cleanings.map((cleaning) => (
                  <ScheduleDesktopRow key={cleaning.id} cleaning={cleaning} todayStr={todayStr} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-border bg-warm-white/40 flex items-center justify-between text-xs">
            <span className="text-muted">Προβολή επόμενων προγραμματισμένων εργασιών</span>
            <Link
              href="/admin/cleanings/airbnb"
              className="inline-flex items-center gap-1 font-semibold text-teal-dark hover:underline"
            >
              Πλήρες πρόγραμμα
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
            </Link>
          </div>
        </>
      )}
    </section>
  );
}
