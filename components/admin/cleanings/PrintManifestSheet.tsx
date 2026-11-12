import type { CleaningRecord } from '@/lib/types/cleanings';
import { hasAccessPin, formatPropertyTitle, formatFloor } from '@/lib/types/cleanings';

interface PrintManifestSheetProps {
  items: CleaningRecord[];
  selectedDate?: string;
}

export function PrintManifestSheet({ items, selectedDate }: PrintManifestSheetProps) {
  return (
    <div className="vertical-dispatch-card border border-slate-900 p-5 bg-white space-y-4 print:border-black">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b-2 border-slate-900 pb-3 print:border-black">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
            Ephtopia Cleans · Ημερήσιο Πρόγραμμα
          </p>
          <h2 className="text-base sm:text-lg font-extrabold font-heading text-slate-900 mt-0.5">
            Συνοπτικός Πίνακας Δρομολογίων ({selectedDate || new Date().toLocaleDateString('el-GR')})
          </h2>
        </div>
        <span className="text-xs font-bold text-slate-900 tabular-nums">
          Σύνολο: {items.length} αποστολές
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-400 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2 pr-2 w-7">#</th>
              <th className="py-2 px-2">Κατάλυμα &amp; Διεύθυνση</th>
              <th className="py-2 px-2">Όροφος</th>
              <th className="py-2 px-2">PIN</th>
              <th className="py-2 px-2">Ωράριο</th>
              <th className="py-2 px-2">Συνεργείο</th>
              <th className="py-2 pl-2 text-center w-14">OK</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, idx) => {
              const propTitle = formatPropertyTitle(item.property_name, item.address);
              const showAddr =
                item.property_name &&
                item.property_name !== '-' &&
                item.property_name.trim() !== item.address?.trim();

              return (
                <tr key={item.id}>
                  <td className="py-2 pr-2 font-bold text-slate-900 tabular-nums">{idx + 1}</td>
                  <td className="py-2 px-2">
                    <div className="font-bold text-slate-900">{propTitle}</div>
                    {showAddr && item.address && (
                      <div className="text-[11px] text-slate-600">
                        {item.address}
                        {item.area ? ` · ${item.area}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-2 text-slate-800">{formatFloor(item.floor)}</td>
                  <td className="py-2 px-2 font-mono font-bold text-slate-900">
                    {hasAccessPin(item.access_code) ? item.access_code : '—'}
                  </td>
                  <td className="py-2 px-2 font-semibold text-slate-900 tabular-nums whitespace-nowrap">
                    {item.scheduled_time || '11:00 - 14:00'}
                  </td>
                  <td className="py-2 px-2 text-[11px] text-slate-700">
                    <div>Καθ: {item.cleaner_name && item.cleaner_name !== '-' ? item.cleaner_name : '—'}</div>
                    <div>Οδηγ: {item.driver_name && item.driver_name !== '-' ? item.driver_name : '—'}</div>
                  </td>
                  <td className="py-2 pl-2 text-center">
                    <span className="inline-block w-3.5 h-3.5 border border-slate-500 rounded-xs" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

