'use client';

import { useState } from 'react';
import { X, Printer, Pencil, Trash2 } from 'lucide-react';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG, CLEANING_STATUS_CONFIG } from '@/lib/types/cleanings';
import { updateCleaningStatus, deleteCleaning } from '@/app/actions/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { CleaningDetailBody } from './CleaningDetailBody';

interface CleaningDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleaning: CleaningRecord | null;
  onEdit: (cleaning: CleaningRecord) => void;
  onPrint: (cleaning: CleaningRecord) => void;
  onDeleted: (id: string) => void;
  onStatusChanged: (id: string, newStatus: CleaningStatus) => void;
}

const PIPELINE_STATUSES: CleaningStatus[] = ['scheduled', 'in_progress', 'completed'];

export function CleaningDetailModal({
  isOpen,
  onClose,
  cleaning,
  onEdit,
  onPrint,
  onDeleted,
  onStatusChanged,
}: CleaningDetailModalProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !cleaning) return null;

  const priorityConfig = CLEANING_PRIORITY_CONFIG[cleaning.priority];

  const handleStatusChange = async (newStatus: CleaningStatus) => {
    setUpdatingStatus(true);
    const res = await updateCleaningStatus(cleaning.id, newStatus);
    if (res.success) onStatusChanged(cleaning.id, newStatus);
    setUpdatingStatus(false);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const res = await deleteCleaning(cleaning.id);
    if (res.success) {
      setIsDeleteConfirmOpen(false);
      onDeleted(cleaning.id);
      onClose();
    } else {
      alert('Σφάλμα: ' + res.error);
    }
    setDeleting(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/40 overflow-y-auto">
        <div className="bg-white rounded-xl border border-border w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92dvh]">
          <header className="px-5 py-4 border-b border-border flex items-start justify-between gap-3 shrink-0 bg-white">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                  {cleaning.category === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
                </span>
                {cleaning.priority !== 'normal' && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
                    {priorityConfig.label}
                  </span>
                )}
              </div>
              <h2 className="font-heading text-lg font-bold text-navy mt-0.5 truncate">
                {cleaning.property_name || cleaning.address}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Κλείσιμο"
              className="p-1.5 text-muted hover:text-navy hover:bg-warm-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </header>

          <div className="bg-warm-white border-b border-border px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="inline-flex items-center p-0.5 bg-white border border-border rounded-lg text-xs font-semibold">
              {PIPELINE_STATUSES.map((s) => {
                const cfg = CLEANING_STATUS_CONFIG[s];
                const active = cleaning.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(s)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      active ? `${cfg.bg} ${cfg.text} border ${cfg.border}` : 'text-muted hover:text-navy'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onPrint(cleaning)}
                className="inline-flex items-center gap-1.5 bg-white border border-border hover:border-navy/30 text-navy font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-muted" strokeWidth={1.75} />
                <span>Εκτύπωση</span>
              </button>
              <button
                type="button"
                onClick={() => onEdit(cleaning)}
                className="inline-flex items-center gap-1.5 bg-white border border-border hover:border-navy/30 text-navy font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-muted" strokeWidth={1.75} />
                <span className="hidden sm:inline">Επεξεργασία</span>
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setIsDeleteConfirmOpen(true)}
                title="Διαγραφή Καθαρισμού"
                className="p-1.5 text-muted hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <CleaningDetailBody
            cleaning={cleaning}
            copiedCode={copiedCode}
            onCopyCode={() => {
              if (!cleaning.access_code) return;
              navigator.clipboard.writeText(cleaning.access_code);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
          />
        </div>
      </div>

      <ConfirmModal
        open={isDeleteConfirmOpen}
        title="Διαγραφή Καθαρισμού"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά τον προγραμματισμένο καθαρισμό για το κατάλυμα "${cleaning.property_name}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
        confirmLabel="Διαγραφή Καθαρισμού"
        cancelLabel="Ακύρωση"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        variant="danger"
      />
    </>
  );
}
