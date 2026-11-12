'use client';

import { Check, Copy } from 'lucide-react';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';
import { StatusDropdown } from './StatusDropdown';
import { CleaningRowActions } from './CleaningRowActions';
import {
  getCleaningDisplayName,
  formatCleaningDateShort,
  getCleaningCrewLabel,
} from './cleaningDisplayHelpers';

interface CleaningCardProps {
  cleaning: CleaningRecord;
  isCopied: boolean;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onSelect: (c: CleaningRecord) => void;
  onStatusChange: (id: string, newStatus: CleaningStatus) => void;
  onPrint: (c: CleaningRecord, e: React.MouseEvent) => void;
  onEdit: (c: CleaningRecord, e: React.MouseEvent) => void;
  onDelete: (c: CleaningRecord, e: React.MouseEvent) => void;
}

export function CleaningCard({
  cleaning,
  isCopied,
  onCopyCode,
  onSelect,
  onStatusChange,
  onPrint,
  onEdit,
  onDelete,
}: CleaningCardProps) {
  const c = cleaning;
  const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];

  return (
    <div
      onClick={() => onSelect(c)}
      className="bg-white border border-border hover:border-navy/30 rounded-xl p-4 sm:p-5 transition-colors cursor-pointer flex flex-col justify-between gap-4 group min-w-0"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-bold text-base text-navy group-hover:text-teal-dark transition-colors font-heading truncate">
                {getCleaningDisplayName(c)}
              </h3>
              {c.priority !== 'normal' && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
                  {priorityConfig.label}
                </span>
              )}
            </div>
            <p className="text-xs text-muted truncate mt-0.5">
              {c.client_name} · {c.floor || 'Ισόγειο'}
            </p>
          </div>

          <div onClick={(e) => e.stopPropagation()} className="shrink-0">
            <StatusDropdown status={c.status} onChange={(s) => onStatusChange(c.id, s)} />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 pt-3 border-t border-border/70 text-xs">
          <div className="min-w-0">
            <dt className="text-[11px] text-muted">Ημερομηνία &amp; Ώρα</dt>
            <dd className="font-semibold text-navy tabular-nums truncate mt-0.5">
              {formatCleaningDateShort(c.scheduled_date)} · {c.scheduled_time || '11:00 - 14:00'}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[11px] text-muted">Συνεργείο</dt>
            <dd className="font-semibold text-navy truncate mt-0.5">{getCleaningCrewLabel(c)}</dd>
          </div>
        </dl>

        {c.access_code && (
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-muted">Κωδικός Lockbox</span>
            <button
              type="button"
              onClick={(e) => onCopyCode(c.id, c.access_code || '', e)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-border bg-warm-white hover:bg-white font-mono font-semibold text-navy cursor-pointer"
            >
              <span>{c.access_code}</span>
              {isCopied ? <Check className="w-3 h-3 text-teal-dark" strokeWidth={2} /> : <Copy className="w-3 h-3 text-muted" strokeWidth={1.75} />}
            </button>
          </div>
        )}
      </div>

      <div
        className="flex items-center justify-between gap-2 pt-3 border-t border-border/70 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-muted truncate" title={c.address}>
          {c.address || c.area || '—'}
        </span>
        <CleaningRowActions
          cleaning={c}
          isCopied={isCopied}
          onCopyCode={onCopyCode}
          onPrint={onPrint}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
