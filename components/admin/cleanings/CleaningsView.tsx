'use client';

import type { CleaningRecord, CleaningCategory, CleaningClient } from '@/lib/types/cleanings';
import { CleaningsHeader } from './CleaningsHeader';
import { CleaningsStats } from './CleaningsStats';
import { CleaningsToolbar } from './CleaningsToolbar';
import { CleaningCard } from './CleaningCard';
import { CleaningsTable } from './CleaningsTable';
import { CleaningsEmptyState } from './CleaningsEmptyState';
import { CleaningsModals } from './CleaningsModals';
import { useCleaningsController } from './useCleaningsController';

interface CleaningsViewProps {
  category: CleaningCategory;
  initialCleanings: CleaningRecord[];
  clients: CleaningClient[];
}

export function CleaningsView({ category, initialCleanings, clients }: CleaningsViewProps) {
  const ctrl = useCleaningsController(initialCleanings);

  const openNew = () => {
    ctrl.setCleaningToEdit(null);
    ctrl.setIsCleaningModalOpen(true);
  };

  const handlePrint = (rec: CleaningRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    ctrl.setPrintCleaning(rec);
    ctrl.setIsPrintModalOpen(true);
  };

  const handleEdit = (rec: CleaningRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    ctrl.setCleaningToEdit(rec);
    ctrl.setIsCleaningModalOpen(true);
  };

  const handleDelete = (rec: CleaningRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    ctrl.setCleaningToDelete(rec);
  };

  return (
    <div className="w-full max-w-full space-y-5">
      <CleaningsHeader
        category={category}
        onOpenNewModal={openNew}
        onOpenPrintDaily={() => {
          ctrl.setPrintCleaning(ctrl.filteredCleanings[0] || null);
          ctrl.setIsPrintModalOpen(true);
        }}
      />

      <CleaningsStats
        stats={ctrl.stats}
        dateFilter={ctrl.dateFilter}
        onDateFilterChange={ctrl.setDateFilter}
        statusFilter={ctrl.statusFilter}
        onStatusFilterChange={ctrl.setStatusFilter}
      />

      <CleaningsToolbar
        searchQuery={ctrl.searchQuery}
        onSearchChange={ctrl.setSearchQuery}
        dateFilter={ctrl.dateFilter}
        onDateFilterChange={ctrl.setDateFilter}
        customDate={ctrl.customDate}
        onCustomDateChange={ctrl.setCustomDate}
        statusFilter={ctrl.statusFilter}
        onStatusFilterChange={ctrl.setStatusFilter}
        viewMode={ctrl.viewMode}
        onViewModeChange={ctrl.setViewMode}
        totalFiltered={ctrl.filteredCleanings.length}
        onResetFilters={ctrl.resetFilters}
        hasActiveFilters={ctrl.hasActiveFilters}
      />

      {ctrl.filteredCleanings.length === 0 ? (
        <CleaningsEmptyState
          category={category}
          hasActiveFilters={ctrl.hasActiveFilters}
          onResetFilters={ctrl.resetFilters}
          onOpenNewModal={openNew}
        />
      ) : ctrl.viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {ctrl.filteredCleanings.map((c) => (
            <CleaningCard
              key={c.id}
              cleaning={c}
              isCopied={ctrl.copiedCodeId === c.id}
              onCopyCode={ctrl.handleCopyCode}
              onSelect={ctrl.setDetailCleaning}
              onStatusChange={ctrl.handleQuickStatusChange}
              onPrint={handlePrint}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <CleaningsTable
          cleanings={ctrl.filteredCleanings}
          copiedCodeId={ctrl.copiedCodeId}
          onCopyCode={ctrl.handleCopyCode}
          onSelect={ctrl.setDetailCleaning}
          onStatusChange={ctrl.handleQuickStatusChange}
          onPrint={handlePrint}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CleaningsModals
        category={category}
        clients={clients}
        filteredCleanings={ctrl.filteredCleanings}
        selectedDate={ctrl.selectedDate}
        isCleaningModalOpen={ctrl.isCleaningModalOpen}
        onCloseCleaningModal={() => ctrl.setIsCleaningModalOpen(false)}
        onCleaningSaved={ctrl.onCleaningSaved}
        cleaningToEdit={ctrl.cleaningToEdit}
        detailCleaning={ctrl.detailCleaning}
        onCloseDetailModal={() => ctrl.setDetailCleaning(null)}
        onEditFromDetail={(rec) => {
          ctrl.setDetailCleaning(null);
          ctrl.setCleaningToEdit(rec);
          ctrl.setIsCleaningModalOpen(true);
        }}
        onPrintFromDetail={(rec) => {
          ctrl.setDetailCleaning(null);
          ctrl.setPrintCleaning(rec);
          ctrl.setIsPrintModalOpen(true);
        }}
        onDeleted={ctrl.onDeleted}
        onStatusChanged={ctrl.handleStatusChanged}
        isPrintModalOpen={ctrl.isPrintModalOpen}
        onClosePrintModal={() => ctrl.setIsPrintModalOpen(false)}
        printCleaning={ctrl.printCleaning}
        cleaningToDelete={ctrl.cleaningToDelete}
        isDeletingCleaning={ctrl.isDeletingCleaning}
        onConfirmDelete={ctrl.handleConfirmDelete}
        onCancelDelete={() => ctrl.setCleaningToDelete(null)}
      />
    </div>
  );
}
