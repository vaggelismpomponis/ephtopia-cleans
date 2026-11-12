'use client';

import type {
  CleaningRecord,
  CleaningCategory,
  CleaningClient,
  CleaningStatus,
} from '@/lib/types/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { CleaningModal } from './CleaningModal';
import { CleaningDetailModal } from './CleaningDetailModal';
import { PrintSlipModal } from './PrintSlipModal';

interface CleaningsModalsProps {
  category: CleaningCategory;
  clients: CleaningClient[];
  filteredCleanings: CleaningRecord[];
  selectedDate: string;
  isCleaningModalOpen: boolean;
  onCloseCleaningModal: () => void;
  onCleaningSaved: (saved: CleaningRecord) => void;
  cleaningToEdit: CleaningRecord | null;
  detailCleaning: CleaningRecord | null;
  onCloseDetailModal: () => void;
  onEditFromDetail: (rec: CleaningRecord) => void;
  onPrintFromDetail: (rec: CleaningRecord) => void;
  onDeleted: (id: string) => void;
  onStatusChanged: (id: string, status: CleaningStatus) => void;
  isPrintModalOpen: boolean;
  onClosePrintModal: () => void;
  printCleaning: CleaningRecord | null;
  cleaningToDelete: CleaningRecord | null;
  isDeletingCleaning: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function CleaningsModals({
  category,
  clients,
  filteredCleanings,
  selectedDate,
  isCleaningModalOpen,
  onCloseCleaningModal,
  onCleaningSaved,
  cleaningToEdit,
  detailCleaning,
  onCloseDetailModal,
  onEditFromDetail,
  onPrintFromDetail,
  onDeleted,
  onStatusChanged,
  isPrintModalOpen,
  onClosePrintModal,
  printCleaning,
  cleaningToDelete,
  isDeletingCleaning,
  onConfirmDelete,
  onCancelDelete,
}: CleaningsModalsProps) {
  return (
    <>
      <CleaningModal
        isOpen={isCleaningModalOpen}
        onClose={onCloseCleaningModal}
        onSaved={onCleaningSaved}
        cleaningToEdit={cleaningToEdit}
        defaultCategory={category}
        clients={clients}
      />

      <CleaningDetailModal
        isOpen={!!detailCleaning}
        onClose={onCloseDetailModal}
        cleaning={detailCleaning}
        onEdit={onEditFromDetail}
        onPrint={onPrintFromDetail}
        onDeleted={onDeleted}
        onStatusChanged={onStatusChanged}
      />

      <PrintSlipModal
        isOpen={isPrintModalOpen}
        onClose={onClosePrintModal}
        cleaning={printCleaning}
        dailyCleanings={filteredCleanings}
        selectedDate={selectedDate}
        category={category}
      />

      <ConfirmModal
        open={!!cleaningToDelete}
        title="Διαγραφή Καθαρισμού"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά τον προγραμματισμένο καθαρισμό για το κατάλυμα "${cleaningToDelete?.property_name}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
        confirmLabel="Διαγραφή Καθαρισμού"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingCleaning}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        variant="danger"
      />
    </>
  );
}

