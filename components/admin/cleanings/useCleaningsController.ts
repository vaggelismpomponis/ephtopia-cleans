'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { updateCleaningStatus, deleteCleaning } from '@/app/actions/cleanings';
import {
  subscribeCleaningsViewMode,
  getCleaningsViewModeSnapshot,
  getCleaningsViewModeServerSnapshot,
  persistCleaningsViewMode,
} from './cleaningsViewStorage';

export function useCleaningsController(initialCleanings: CleaningRecord[]) {
  const router = useRouter();
  const [cleanings, setCleanings] = useState<CleaningRecord[]>(initialCleanings);

  const viewMode = useSyncExternalStore(
    subscribeCleaningsViewMode,
    getCleaningsViewModeSnapshot,
    getCleaningsViewModeServerSnapshot
  );

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' });
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' });

  const [dateFilter, setDateFilter] = useState('all');
  const [customDate, setCustomDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [cleaningToEdit, setCleaningToEdit] = useState<CleaningRecord | null>(null);
  const [detailCleaning, setDetailCleaning] = useState<CleaningRecord | null>(null);
  const [printCleaning, setPrintCleaning] = useState<CleaningRecord | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [cleaningToDelete, setCleaningToDelete] = useState<CleaningRecord | null>(null);
  const [isDeletingCleaning, setIsDeletingCleaning] = useState(false);

  const filteredCleanings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return cleanings.filter((c) => {
      if (dateFilter === 'today' && c.scheduled_date !== todayStr) return false;
      if (dateFilter === 'tomorrow' && c.scheduled_date !== tomorrowStr) return false;
      if (dateFilter === 'custom' && customDate && c.scheduled_date !== customDate) return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (!q) return true;
      return [c.property_name, c.address, c.client_name, c.cleaner_name, c.driver_name, c.access_code]
        .some((val) => val?.toLowerCase().includes(q));
    });
  }, [cleanings, dateFilter, customDate, statusFilter, searchQuery, todayStr, tomorrowStr]);

  const stats = useMemo(() => {
    const todayItems = cleanings.filter((c) => c.scheduled_date === todayStr);
    const completedToday = todayItems.filter((c) => c.status === 'completed').length;
    return {
      todayCount: todayItems.length,
      inProgressCount: cleanings.filter((c) => c.status === 'in_progress').length,
      upcomingCount: cleanings.filter(
        (c) => c.scheduled_date >= todayStr && c.status !== 'completed' && c.status !== 'cancelled'
      ).length,
      completedToday,
      completionRate: todayItems.length > 0 ? Math.round((completedToday / todayItems.length) * 100) : 0,
    };
  }, [cleanings, todayStr]);

  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleStatusChanged = (id: string, newStatus: CleaningStatus) => {
    setCleanings((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    setDetailCleaning((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
    router.refresh();
  };

  const handleQuickStatusChange = async (id: string, newStatus: CleaningStatus) => {
    setCleanings((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    await updateCleaningStatus(id, newStatus);
    router.refresh();
  };

  const handleConfirmDelete = async () => {
    if (!cleaningToDelete) return;
    setIsDeletingCleaning(true);
    const res = await deleteCleaning(cleaningToDelete.id);
    if (res.success) {
      setCleanings((prev) => prev.filter((c) => c.id !== cleaningToDelete.id));
      setCleaningToDelete(null);
      router.refresh();
    } else {
      alert('Σφάλμα: ' + res.error);
    }
    setIsDeletingCleaning(false);
  };

  const resetFilters = () => {
    setDateFilter('all');
    setCustomDate('');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return {
    viewMode,
    setViewMode: persistCleaningsViewMode,
    dateFilter,
    setDateFilter,
    customDate,
    setCustomDate,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    copiedCodeId,
    filteredCleanings,
    stats,
    hasActiveFilters: dateFilter !== 'all' || statusFilter !== 'all' || searchQuery.trim().length > 0 || customDate !== '',
    selectedDate: dateFilter === 'today' ? todayStr : dateFilter === 'tomorrow' ? tomorrowStr : customDate || todayStr,
    isCleaningModalOpen,
    setIsCleaningModalOpen,
    cleaningToEdit,
    setCleaningToEdit,
    detailCleaning,
    setDetailCleaning,
    printCleaning,
    setPrintCleaning,
    isPrintModalOpen,
    setIsPrintModalOpen,
    cleaningToDelete,
    setCleaningToDelete,
    isDeletingCleaning,
    handleCopyCode,
    handleStatusChanged,
    handleQuickStatusChange,
    handleConfirmDelete,
    resetFilters,
    onCleaningSaved: (saved: CleaningRecord) => {
      setCleanings((prev) => (prev.some((c) => c.id === saved.id) ? prev.map((c) => (c.id === saved.id ? saved : c)) : [saved, ...prev]));
      router.refresh();
    },
    onDeleted: (id: string) => {
      setCleanings((prev) => prev.filter((c) => c.id !== id));
      router.refresh();
    },
  };
}

