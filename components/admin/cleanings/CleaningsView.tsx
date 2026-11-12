'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import type {
  CleaningRecord,
  CleaningCategory,
  CleaningClient,
  CleaningStatus,
} from '@/lib/types/cleanings';
import { updateCleaningStatus, deleteCleaning } from '@/app/actions/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { CleaningModal } from './CleaningModal';
import { CleaningDetailModal } from './CleaningDetailModal';
import { PrintSlipModal } from './PrintSlipModal';
import { CleaningsHeader } from './CleaningsHeader';
import { CleaningsStats } from './CleaningsStats';
import { CleaningsToolbar } from './CleaningsToolbar';
import { CleaningCard } from './CleaningCard';
import { CleaningsTable } from './CleaningsTable';
import { CleaningsEmptyState } from './CleaningsEmptyState';

interface CleaningsViewProps {
  category: CleaningCategory;
  initialCleanings: CleaningRecord[];
  clients: CleaningClient[];
}

const VIEW_MODE_KEY = 'ephtopia-cleanings-view-mode';
let viewModeListeners: Array<() => void> = [];

function subscribeViewMode(callback: () => void) {
  viewModeListeners = [...viewModeListeners, callback];
  const onStorage = (e: StorageEvent) => {
    if (e.key === VIEW_MODE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    viewModeListeners = viewModeListeners.filter((l) => l !== callback);
    window.removeEventListener('storage', onStorage);
  };
}

function getViewModeSnapshot(): 'table' | 'grid' {
  try {
    const saved = localStorage.getItem(VIEW_MODE_KEY);
    return saved === 'table' || saved === 'grid' ? saved : 'grid';
  } catch {
    return 'grid';
  }
}

function getViewModeServerSnapshot(): 'table' | 'grid' {
  return 'grid';
}

export function CleaningsView({
  category,
  initialCleanings,
  clients,
}: CleaningsViewProps) {
  const router = useRouter();
  const [cleanings, setCleanings] = useState<CleaningRecord[]>(initialCleanings);

  const viewMode = useSyncExternalStore(
    subscribeViewMode,
    getViewModeSnapshot,
    getViewModeServerSnapshot
  );

  const handleSetViewMode = (mode: 'table' | 'grid') => {
    try {
      localStorage.setItem(VIEW_MODE_KEY, mode);
      viewModeListeners.forEach((l) => l());
    } catch {
      // Ignore
    }
  };

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  // Filters
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customDate, setCustomDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Copy feedback state
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Modals state
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [cleaningToEdit, setCleaningToEdit] = useState<CleaningRecord | null>(null);
  const [detailCleaning, setDetailCleaning] = useState<CleaningRecord | null>(null);
  const [printCleaning, setPrintCleaning] = useState<CleaningRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [cleaningToDelete, setCleaningToDelete] = useState<CleaningRecord | null>(null);
  const [isDeletingCleaning, setIsDeletingCleaning] = useState(false);

  // Filtered list
  const filteredCleanings = useMemo(() => {
    return cleanings.filter((c) => {
      // Date filter
      if (dateFilter === 'today' && c.scheduled_date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && c.scheduled_date !== tomorrowStr) return false;
      if (dateFilter === 'custom' && customDate && c.scheduled_date !== customDate) return false;

      // Status filter
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesProp = c.property_name.toLowerCase().includes(q);
        const matchesAddress = c.address.toLowerCase().includes(q);
        const matchesClient = c.client_name.toLowerCase().includes(q);
        const matchesCleaner = c.cleaner_name?.toLowerCase().includes(q);
        const matchesDriver = c.driver_name?.toLowerCase().includes(q);
        const matchesCode = c.access_code?.toLowerCase().includes(q);

        if (
          !matchesProp &&
          !matchesAddress &&
          !matchesClient &&
          !matchesCleaner &&
          !matchesDriver &&
          !matchesCode
        ) {
          return false;
        }
      }

      return true;
    });
  }, [cleanings, dateFilter, customDate, statusFilter, searchQuery, todayStr, tomorrowStr]);

  // Stats calculation
  const stats = useMemo(() => {
    const todayItems = cleanings.filter((c) => c.scheduled_date === todayStr);
    const inProgress = cleanings.filter((c) => c.status === 'in_progress').length;
    const upcoming = cleanings.filter(
      (c) => c.scheduled_date >= todayStr && c.status !== 'completed' && c.status !== 'cancelled'
    ).length;
    const completedToday = todayItems.filter((c) => c.status === 'completed').length;
    const completionRate =
      todayItems.length > 0 ? Math.round((completedToday / todayItems.length) * 100) : 0;

    return {
      todayCount: todayItems.length,
      inProgressCount: inProgress,
      upcomingCount: upcoming,
      completedToday,
      completionRate,
    };
  }, [cleanings, todayStr]);

  // Quick copy code
  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Quick inline status change
  const handleQuickStatusChange = async (id: string, newStatus: CleaningStatus) => {
    setCleanings((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    await updateCleaningStatus(id, newStatus);
    router.refresh();
  };

  // Handlers
  const handleOpenNewModal = () => {
    setCleaningToEdit(null);
    setIsCleaningModalOpen(true);
  };

  const handleEdit = (rec: CleaningRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCleaningToEdit(rec);
    setIsCleaningModalOpen(true);
  };

  const handleOpenPrintSingle = (rec: CleaningRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPrintCleaning(rec);
    setIsPrintModalOpen(true);
  };

  const handleOpenPrintDaily = () => {
    setPrintCleaning(filteredCleanings[0] || null);
    setIsPrintModalOpen(true);
  };

  const handleCleaningSaved = (saved: CleaningRecord) => {
    setCleanings((prev) => {
      const exists = prev.some((c) => c.id === saved.id);
      if (exists) {
        return prev.map((c) => (c.id === saved.id ? saved : c));
      }
      return [saved, ...prev];
    });
    router.refresh();
  };

  const handleDeleted = (id: string) => {
    setCleanings((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  };

  const handleRequestDelete = (rec: CleaningRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCleaningToDelete(rec);
  };

  const handleConfirmDelete = async () => {
    if (!cleaningToDelete) return;
    setIsDeletingCleaning(true);
    const res = await deleteCleaning(cleaningToDelete.id);
    if (res.success) {
      handleDeleted(cleaningToDelete.id);
      setCleaningToDelete(null);
    } else {
      alert('Σφάλμα: ' + res.error);
    }
    setIsDeletingCleaning(false);
  };

  const handleStatusChanged = (id: string, newStatus: CleaningStatus) => {
    setCleanings((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
    if (detailCleaning && detailCleaning.id === id) {
      setDetailCleaning((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    router.refresh();
  };

  const hasActiveFilters =
    dateFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim().length > 0 || customDate !== '';

  const handleResetFilters = () => {
    setDateFilter('all');
    setCustomDate('');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-full space-y-4 sm:space-y-5">
      {/* 1. Header */}
      <CleaningsHeader
        category={category}
        onOpenNewModal={handleOpenNewModal}
        onOpenPrintDaily={handleOpenPrintDaily}
      />

      {/* 2. KPI Metrics */}
      <CleaningsStats
        stats={stats}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* 3. Toolbar: Search, Filters, View switcher */}
      <CleaningsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        customDate={customDate}
        onCustomDateChange={setCustomDate}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={handleSetViewMode}
        totalFiltered={filteredCleanings.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 4. Content Area: Cards, Table, or Empty State */}
      {filteredCleanings.length === 0 ? (
        <CleaningsEmptyState
          category={category}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onOpenNewModal={handleOpenNewModal}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredCleanings.map((c) => (
            <CleaningCard
              key={c.id}
              cleaning={c}
              isCopied={copiedCodeId === c.id}
              onCopyCode={handleCopyCode}
              onSelect={setDetailCleaning}
              onStatusChange={handleQuickStatusChange}
              onPrint={handleOpenPrintSingle}
              onEdit={handleEdit}
              onDelete={handleRequestDelete}
            />
          ))}
        </div>
      ) : (
        <CleaningsTable
          cleanings={filteredCleanings}
          copiedCodeId={copiedCodeId}
          onCopyCode={handleCopyCode}
          onSelect={setDetailCleaning}
          onStatusChange={handleQuickStatusChange}
          onPrint={handleOpenPrintSingle}
          onEdit={handleEdit}
          onDelete={handleRequestDelete}
        />
      )}

      {/* ── MODALS ── */}
      <CleaningModal
        isOpen={isCleaningModalOpen}
        onClose={() => setIsCleaningModalOpen(false)}
        onSaved={handleCleaningSaved}
        cleaningToEdit={cleaningToEdit}
        defaultCategory={category}
        clients={clients}
      />

      <CleaningDetailModal
        isOpen={!!detailCleaning}
        onClose={() => setDetailCleaning(null)}
        cleaning={detailCleaning}
        onEdit={(rec) => {
          setDetailCleaning(null);
          handleEdit(rec);
        }}
        onPrint={(rec) => {
          setDetailCleaning(null);
          handleOpenPrintSingle(rec);
        }}
        onDeleted={handleDeleted}
        onStatusChanged={handleStatusChanged}
      />

      <PrintSlipModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        cleaning={printCleaning}
        dailyCleanings={filteredCleanings}
        selectedDate={
          dateFilter === 'today'
            ? todayStr
            : dateFilter === 'tomorrow'
              ? tomorrowStr
              : customDate || todayStr
        }
        category={category}
      />

      <ConfirmModal
        open={!!cleaningToDelete}
        title="Διαγραφή Καθαρισμού"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά τον προγραμματισμένο καθαρισμό για το κατάλυμα "${cleaningToDelete?.property_name}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
        confirmLabel="Διαγραφή Καθαρισμού"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingCleaning}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCleaningToDelete(null)}
        variant="danger"
      />
    </div>
  );
}
