'use client';

import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';
import { StatusDropdown } from './StatusDropdown';
import { CleaningRowActions } from './CleaningRowActions';
import {
  getCleaningDisplayName,
  formatCleaningDateShort,
  getCleaningCrewLabel,
} from './cleaningDisplayHelpers';

interface CleaningsTableProps {
  cleanings: CleaningRecord[];
  copiedCodeId: string | null;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onSelect: (c: CleaningRecord) => void;
  onStatusChange: (id: string, newStatus: CleaningStatus) => void;
  onPrint: (c: CleaningRecord, e: React.MouseEvent) => void;
  onEdit: (c: CleaningRecord, e: React.MouseEvent) => void;
  onDelete: (c: CleaningRecord, e: React.MouseEvent) => void;
}

export function CleaningsTable({
  cleanings,
  copiedCodeId,
  onCopyCode,
  onSelect,
  onStatusChange,
  onPrint,
  onEdit,
  onDelete,
}: CleaningsTableProps) {
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-warm-white text-muted font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-heading">Κατάλυμα</th>
              <th className="py-3 px-4 font-heading">Ημερομηνία &amp; Ώρα</th>
              <th className="py-3 px-4 font-heading hidden lg:table-cell">Διεύθυνση</th>
              <th className="py-3 px-4 font-heading hidden sm:table-cell">Συνεργείο</th>
              <th className="py-3 px-4 font-heading">Κατάσταση</th>
              <th className="py-3 px-4 font-heading text-right">Ενέργειες</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cleanings.map((c) => {
              const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];
              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className="hover:bg-warm-white/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 max-w-[240px]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold text-navy group-hover:text-teal-dark transition-colors text-sm truncate">
                        {getCleaningDisplayName(c)}
                      </span>
                      {c.priority !== 'normal' && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
                          {priorityConfig.label}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-muted truncate mt-0.5">
                      {c.client_name} · {c.floor || 'Ισόγειο'}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-navy tabular-nums">
                      {c.scheduled_time || '11:00 - 14:00'}
                    </div>
                    <div className="text-[11px] text-muted tabular-nums mt-0.5">
                      {formatCleaningDateShort(c.scheduled_date)}
                    </div>
                  </td>

                  <td className="py-3 px-4 max-w-[220px] hidden lg:table-cell">
                    <div className="font-medium text-navy truncate">{c.address || '—'}</div>
                    {c.area && <div className="text-[11px] text-muted truncate mt-0.5">{c.area}</div>}
                  </td>

                  <td className="py-3 px-4 max-w-[180px] hidden sm:table-cell">
                    <span className="text-navy font-medium truncate block">
                      {getCleaningCrewLabel(c)}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown status={c.status} onChange={(s) => onStatusChange(c.id, s)} />
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <CleaningRowActions
                      cleaning={c}
                      isCopied={copiedCodeId === c.id}
                      showInlinePin
                      onCopyCode={onCopyCode}
                      onPrint={onPrint}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
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
