'use client';

import { Printer, Pencil, Trash2, Check, Copy } from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';

interface CleaningRowActionsProps {
  cleaning: CleaningRecord;
  isCopied: boolean;
  showInlinePin?: boolean;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onPrint: (c: CleaningRecord, e: React.MouseEvent) => void;
  onEdit: (c: CleaningRecord, e: React.MouseEvent) => void;
  onDelete: (c: CleaningRecord, e: React.MouseEvent) => void;
}

export function CleaningRowActions({
  cleaning,
  isCopied,
  showInlinePin = false,
  onCopyCode,
  onPrint,
  onEdit,
  onDelete,
}: CleaningRowActionsProps) {
  return (
    <div className="inline-flex items-center justify-end gap-1 shrink-0">
      {showInlinePin && cleaning.access_code && (
        <button
          type="button"
          onClick={(e) => onCopyCode(cleaning.id, cleaning.access_code || '', e)}
          title={`Αντιγραφή PIN: ${cleaning.access_code}`}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-warm-white hover:bg-white text-navy font-mono text-[11px] font-semibold cursor-pointer mr-1"
        >
          <span>{cleaning.access_code}</span>
          {isCopied ? (
            <Check className="w-3 h-3 text-teal-dark" strokeWidth={2} />
          ) : (
            <Copy className="w-3 h-3 text-muted" strokeWidth={1.75} />
          )}
        </button>
      )}
      <button
        type="button"
        onClick={(e) => onPrint(cleaning, e)}
        title="Εκτύπωση Δελτίου"
        className="p-1.5 rounded-md text-muted hover:text-navy hover:bg-warm-white transition-colors cursor-pointer"
      >
        <Printer className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={(e) => onEdit(cleaning, e)}
        title="Επεξεργασία"
        className="p-1.5 rounded-md text-muted hover:text-navy hover:bg-warm-white transition-colors cursor-pointer"
      >
        <Pencil className="w-4 h-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={(e) => onDelete(cleaning, e)}
        title="Διαγραφή"
        className="p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

