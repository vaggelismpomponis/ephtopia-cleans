import { AlertTriangle } from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';
import {
  CLEANING_PRIORITY_CONFIG,
  hasAccessPin,
  formatPropertyTitle,
  formatFloor,
  formatClientInfo,
} from '@/lib/types/cleanings';

interface PrintDispatchSlipCardProps {
  rec: CleaningRecord;
  index: number;
  totalCount: number;
  isSingle: boolean;
}

export function PrintDispatchSlipCard({
  rec,
  index,
  totalCount,
  isSingle,
}: PrintDispatchSlipCardProps) {
  const priorityConfig = CLEANING_PRIORITY_CONFIG[rec.priority];
  const isLast = index === totalCount - 1;
  const propTitle = formatPropertyTitle(rec.property_name, rec.address);
  const hasInstructions = !!rec.entry_instructions?.trim();
  const hasPin = hasAccessPin(rec.access_code);
  const formattedDate = new Date(rec.scheduled_date).toLocaleDateString('el-GR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  return (
    <article
      className={`vertical-dispatch-card bg-white border border-slate-900 p-5 sm:p-6 space-y-4 print:border-black print:p-5 ${!isLast && !isSingle ? 'print-break-after' : ''
        }`}
    >
      {/* Document Header */}
      <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-4 print:border-black">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
            Ephtopia Cleans · Δελτίο Αποστολής {totalCount > 1 ? `#${index + 1}` : ''}
          </p>
          <h3 className="text-lg sm:text-xl font-extrabold font-heading text-slate-900 mt-0.5">
            {propTitle}
          </h3>
          <p className="text-xs text-slate-700 mt-0.5">
            {rec.address}
            {rec.area ? ` · ${rec.area}` : ''} · {formatFloor(rec.floor)}
          </p>
        </div>

        <div className="text-right shrink-0 text-xs">
          <div className="font-bold uppercase text-slate-900">
            {rec.category === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
          </div>
          <div className="text-slate-500 font-mono mt-0.5">#{rec.id.slice(0, 8).toUpperCase()}</div>
        </div>
      </div>

      {/* Priority Alert */}
      {rec.priority !== 'normal' && (
        <div className="border border-slate-900 px-3 py-2 flex items-center gap-2 text-slate-900">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <div className="text-xs">
            <span className="font-bold uppercase">Προσοχή ({priorityConfig.label})</span>
            {rec.special_notes && <span className="ml-2 font-medium">{rec.special_notes}</span>}
          </div>
        </div>
      )}

      {/* Property, Client & Schedule Grid */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-300 pb-3.5">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ημερομηνία</dt>
          <dd className="font-bold text-slate-900 mt-0.5">{formattedDate}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Ωράριο</dt>
          <dd className="font-bold text-slate-900 tabular-nums mt-0.5">
            {rec.scheduled_time || '11:00 - 14:00'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Συνεργείο</dt>
          <dd className="font-bold text-slate-900 mt-0.5">
            {rec.cleaner_name && rec.cleaner_name !== '-' ? rec.cleaner_name : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Οδηγός</dt>
          <dd className="font-bold text-slate-900 mt-0.5">
            {rec.driver_name && rec.driver_name !== '-' ? rec.driver_name : '—'}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-4 pt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-2">
            Πελάτης / Επαφή:
          </span>
          <span className="font-semibold text-slate-900">
            {formatClientInfo(rec.client_name, rec.client_phone)}
          </span>
        </div>
      </dl>

      {/* Access PIN & Instructions */}
      {(hasPin || hasInstructions) && (
        <div className="border-b border-slate-300 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {hasInstructions && (
            <div className="text-xs text-slate-800 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                Οδηγίες Πρόσβασης
              </span>
              {rec.entry_instructions}
            </div>
          )}
          {hasPin && (
            <div className="shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Κωδικός / PIN
              </span>
              <span className="text-lg font-mono font-extrabold text-slate-900 border border-slate-900 px-3 py-1 inline-block print:border-black">
                {rec.access_code}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Linen Checklist */}
      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Ιματισμός &amp; Είδη
          </span>
          <p className="font-semibold text-slate-900 mt-0.5">
            {rec.linen_requirements || 'Standard σετ κλινοσκεπασμάτων & πετσετών'}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1 text-slate-800">
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border border-slate-500 rounded-xs inline-block" />
            Παράδοση καθαρών λευκών ειδών
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-3.5 border border-slate-500 rounded-xs inline-block" />
            Παραλαβή σάκου άπλυτων
          </span>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <div>
          <span>Οδηγός</span>
          <div className="h-5 border-b border-dashed border-slate-400 mt-1" />
        </div>
        <div>
          <span>Παραλαβή / Έλεγχος</span>
          <div className="h-5 border-b border-dashed border-slate-400 mt-1" />
        </div>
        <div>
          <span>Ώρα Ολοκλήρωσης</span>
          <div className="h-5 border-b border-dashed border-slate-400 mt-1 text-center font-mono text-slate-400 pt-1">
            ___ : ___
          </div>
        </div>
      </div>
    </article>
  );
}

