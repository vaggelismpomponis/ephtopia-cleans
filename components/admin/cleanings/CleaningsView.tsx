'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Printer,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Key,
  Truck,
  Sparkles,
  Building,
  Home,
  CheckCircle2,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  Users,
  ChevronRight,
  ArrowRightLeft,
  Copy,
  Check,
  ExternalLink,
  LayoutGrid,
  List,
  RotateCcw,
} from 'lucide-react';
import type {
  CleaningRecord,
  CleaningCategory,
  CleaningClient,
  CleaningStatus,
} from '@/lib/types/cleanings';
import {
  CLEANING_STATUS_CONFIG,
  CLEANING_PRIORITY_CONFIG,
} from '@/lib/types/cleanings';
import { updateCleaningStatus, deleteCleaning } from '@/app/actions/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { StatusDropdown } from './StatusDropdown';
import { CustomSelect } from './CustomSelect';
import { CleaningModal } from './CleaningModal';
import { CleaningDetailModal } from './CleaningDetailModal';
import { PrintSlipModal } from './PrintSlipModal';

interface CleaningsViewProps {
  category: CleaningCategory;
  initialCleanings: CleaningRecord[];
  clients: CleaningClient[];
}

export function CleaningsView({
  category,
  initialCleanings,
  clients,
}: CleaningsViewProps) {
  const router = useRouter();
  const [cleanings, setCleanings] = useState<CleaningRecord[]>(initialCleanings);

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  // Filters
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'today' | 'tomorrow' | 'all' | 'custom'
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
  const [printMode, setPrintMode] = useState<'single' | 'daily'>('single');
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
    const completionRate = todayItems.length > 0 ? Math.round((completedToday / todayItems.length) * 100) : 0;

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
    setPrintMode('single');
    setIsPrintModalOpen(true);
  };

  const handleOpenPrintDaily = () => {
    setPrintCleaning(filteredCleanings[0] || null);
    setPrintMode('daily');
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

  const isAirbnb = category === 'airbnb';

  return (
    <div className="w-full max-w-full">
      {/* ── SCREEN ONLY DASHBOARD CONTENT (HIDDEN IN PRINT) ── */}
      <div
        id="admin-dashboard-view"
        data-print-hidden="true"
        className="no-print print:hidden space-y-6 sm:space-y-8 w-full max-w-full"
      >
        {/* ── TOP EXECUTIVE NAVIGATION BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Segment Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isAirbnb
                  ? 'bg-gradient-to-br from-teal/20 to-teal/10 text-teal border border-teal/20'
                  : 'bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-600 border border-blue-500/20'
              }`}
            >
              {isAirbnb ? <Home className="w-5 h-5 sm:w-6 sm:h-6" /> : <Building className="w-5 h-5 sm:w-6 sm:h-6" />}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight truncate">
                  {isAirbnb ? 'Καθαρισμοί Airbnb' : 'Καθαρισμοί Ξενοδοχείων'}
                </h1>
                <span
                  className={`hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isAirbnb
                      ? 'bg-teal/10 text-teal border-teal/25'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  {isAirbnb ? 'Turnovers & Check-ins' : 'Housekeeping & Units'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {isAirbnb
                  ? 'Διαχείριση καταλυμάτων, lockbox κωδικών & δελτίων αποστολής'
                  : 'Διαχείριση δωματίων, ορόφων & παραδόσεων ιματισμού'}
              </p>
            </div>
          </div>

          {/* Quick Segment Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start sm:self-auto shrink-0">
            <Link
              href="/admin/cleanings/airbnb"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAirbnb
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className={`w-3.5 h-3.5 ${isAirbnb ? 'text-teal' : 'text-slate-400'}`} />
              <span>Airbnb</span>
            </Link>

            <Link
              href="/admin/cleanings/hotels"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isAirbnb
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building className={`w-3.5 h-3.5 ${!isAirbnb ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Ξενοδοχεία</span>
            </Link>

            <Link
              href="/admin/cleanings/clients"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Πελατολόγιο</span>
              <span className="sm:hidden">Πελάτες</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Print Schedule Button */}
          <button
            type="button"
            onClick={handleOpenPrintDaily}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal" />
            <span>Ημερήσιο Πρόγραμμα</span>
          </button>

          {/* New Cleaning Primary CTA */}
          <button
            type="button"
            onClick={handleOpenNewModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Νέος Καθαρισμός</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Today */}
        <div
          onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            dateFilter === 'today' ? 'border-teal ring-2 ring-teal/20 bg-teal/5' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Σημερινοί Καθαρισμοί
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {stats.todayCount}
            </div>
            {stats.todayCount > 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {stats.completionRate}% ολοκληρώθηκαν
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Κάντε κλικ για φιλτράρισμα ημέρας</p>
        </div>

        {/* Card 2: In Progress */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'in_progress' ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Σε Εξέλιξη Τώρα
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-heading">
              {stats.inProgressCount}
            </div>
            {stats.inProgressCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                Ενεργό
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Συνεργεία στον χώρο</p>
        </div>

        {/* Card 3: Upcoming */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'scheduled' ? 'all' : 'scheduled')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'scheduled' ? 'border-blue-400 ring-2 ring-blue-400/20 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Προγραμματισμένοι
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-heading">
              {stats.upcomingCount}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Προσεχείς
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Αναμονή ανάθεσης ή ώρας</p>
        </div>

        {/* Card 4: Completed */}
        <div
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            statusFilter === 'completed' ? 'border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ολοκληρωμένοι Σήμερα
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-heading">
              {stats.completedToday}
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Έτοιμα για check-in</p>
        </div>
      </div>

      {/* ── TOOLBAR: SEARCH, DATE PILLS, STATUS & VIEW TOGGLE ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Date Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Σήμερα
            </button>

            <button
              type="button"
              onClick={() => setDateFilter('tomorrow')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === 'tomorrow'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Αύριο
            </button>

            <button
              type="button"
              onClick={() => {
                setDateFilter('all');
                setCustomDate('');
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                dateFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Όλες οι Ημέρες
            </button>

            {/* Custom Date Input Pill */}
            <div className="flex items-center gap-1 pl-1">
              <input
                type="date"
                value={customDate}
                onChange={(e) => {
                  setCustomDate(e.target.value);
                  setDateFilter('custom');
                }}
                className={`bg-transparent text-xs text-slate-700 px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                  dateFilter === 'custom'
                    ? 'border-teal bg-white font-bold text-slate-900 shadow-xs'
                    : 'border-transparent text-slate-500'
                }`}
              />
            </div>
          </div>

          {/* Right Controls: Status & View Mode */}
          <div className="flex items-center justify-between lg:justify-end gap-2.5">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 min-w-[190px]">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                size="sm"
                variant="filter"
                options={[
                  { value: 'all', label: 'Όλες οι καταστάσεις', colorDot: 'bg-slate-400' },
                  { value: 'scheduled', label: 'Προγραμματισμένοι', colorDot: 'bg-blue-500' },
                  { value: 'in_progress', label: 'Σε εξέλιξη', colorDot: 'bg-amber-500' },
                  { value: 'completed', label: 'Ολοκληρωμένοι', colorDot: 'bg-emerald-500' },
                  { value: 'cancelled', label: 'Ακυρωμένοι', colorDot: 'bg-slate-400' },
                ]}
              />
            </div>

            {/* View Mode Switcher: Table vs Cards */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                title="Προβολή Πίνακα"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Προβολή Καρτών"
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση με όνομα καταλύματος, οδό, όροφο, πελάτη, κωδικό lockbox, καθαρίστρια ή οδηγό..."
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── CONTENT PRESENTATION (TABLE OR CARDS) ── */}
      {filteredCleanings.length > 0 ? (
        viewMode === 'table' ? (
          /* ── 1. MODERN DATA TABLE VIEW ── */
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/90 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-heading">Κατάλυμα & Όροφος</th>
                    <th className="py-3.5 px-4 font-heading">Ώρα & Ημερομηνία</th>
                    <th className="py-3.5 px-4 font-heading">Διεύθυνση / Χάρτης</th>
                    <th className="py-3.5 px-4 font-heading bg-amber-50/50">Κωδικός Lockbox / PIN</th>
                    <th className="py-3.5 px-4 font-heading">Πελάτης</th>
                    <th className="py-3.5 px-4 font-heading">Ομάδα</th>
                    <th className="py-3.5 px-4 font-heading text-center">Κατάσταση</th>
                    <th className="py-3.5 px-4 font-heading text-right">Ενέργειες</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCleanings.map((c) => {
                    const statusConfig = CLEANING_STATUS_CONFIG[c.status];
                    const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];
                    const isCopied = copiedCodeId === c.id;

                    return (
                      <tr
                        key={c.id}
                        onClick={() => setDetailCleaning(c)}
                        className="hover:bg-teal-50/20 transition-colors group cursor-pointer"
                      >
                        {/* Property & Floor */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 group-hover:text-teal transition-colors text-sm sm:text-base">
                              {c.property_name}
                            </span>
                            {c.priority !== 'normal' && (
                              <span
                                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
                              >
                                {priorityConfig.label}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                              {c.floor || 'Ισόγειο'}
                            </span>
                            {c.special_notes && (
                              <span className="text-[11px] text-slate-400 truncate max-w-[200px]" title={c.special_notes}>
                                · {c.special_notes}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Timing */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs sm:text-sm">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.scheduled_time || '11:00 - 14:00'}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(c.scheduled_date).toLocaleDateString('el-GR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}
                          </div>
                        </td>

                        {/* Address & Google Maps link */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{c.address}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {c.area && <span className="text-[11px] text-slate-400">{c.area}</span>}
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(c.address + (c.area ? `, ${c.area}` : ''))}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-teal hover:underline"
                              title="Άνοιγμα στους Χάρτες Google"
                            >
                              <span>Χάρτης</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </td>

                        {/* Lockbox / Code with 1-click copy */}
                        <td className="py-4 px-4 bg-amber-50/20">
                          {c.access_code ? (
                            <button
                              type="button"
                              onClick={(e) => handleCopyCode(c.id, c.access_code || '', e)}
                              title="Κάντε κλικ για αντιγραφή κωδικού"
                              className="inline-flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-200/80 border border-amber-300 text-slate-900 font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg transition-all cursor-pointer group/btn"
                            >
                              <Key className="w-3 h-3 text-amber-700" />
                              <span>{c.access_code}</span>
                              {isCopied ? (
                                <Check className="w-3 h-3 text-emerald-600 animate-in zoom-in" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 group-hover/btn:text-slate-700 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                              )}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Ρεσεψιόν / Χωρίς</span>
                          )}
                        </td>

                        {/* Client */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 text-xs">{c.client_name}</div>
                          {c.client_phone && (
                            <a
                              href={`tel:${c.client_phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-slate-500 hover:text-teal font-mono transition-colors block mt-0.5"
                            >
                              {c.client_phone}
                            </a>
                          )}
                        </td>

                        {/* Team (Cleaner & Driver) */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs text-slate-800">
                            <span className="w-4 h-4 rounded-full bg-teal/20 text-teal flex items-center justify-center text-[10px] font-bold">
                              Κ
                            </span>
                            <span className="font-semibold">{c.cleaner_name || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                              Ο
                            </span>
                            <span>{c.driver_name || '-'}</span>
                          </div>
                        </td>

                        {/* Status (Interactive Custom Dropdown) */}
                        <td className="py-4 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown
                            status={c.status}
                            onChange={(newStatus) => handleQuickStatusChange(c.id, newStatus)}
                          />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={(e) => handleOpenPrintSingle(c, e)}
                              title="Εκτύπωση Δελτίου Αποστολής"
                              className="p-2 rounded-xl text-slate-500 hover:text-teal hover:bg-teal/10 transition-colors cursor-pointer"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDetailCleaning(c)}
                              title="Προβολή Λεπτομερειών"
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleEdit(c, e)}
                              title="Επεξεργασία"
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={(e) => handleRequestDelete(c, e)}
                              title="Διαγραφή Καθαρισμού"
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ── 2. EXECUTIVE GRID / CARDS VIEW ── */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCleanings.map((c) => {
              const statusConfig = CLEANING_STATUS_CONFIG[c.status];
              const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];
              const isCopied = copiedCodeId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setDetailCleaning(c)}
                  className="bg-white border border-slate-200/80 hover:border-teal/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Top: Category, Priority, Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                            c.category === 'airbnb'
                              ? 'bg-teal/10 text-teal border-teal/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {c.category === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
                        </span>
                        {c.priority !== 'normal' && (
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
                          >
                            {priorityConfig.label}
                          </span>
                        )}
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown
                          status={c.status}
                          onChange={(newStatus) => handleQuickStatusChange(c.id, newStatus)}
                        />
                      </div>
                    </div>

                    {/* Property Title & Floor */}
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal transition-colors font-heading">
                      {c.property_name}
                    </h3>

                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {c.floor || 'Ισόγειο'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[180px]">{c.address}</span>
                      </div>
                    </div>

                    {/* Lockbox Highlight Pill */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <Key className="w-4 h-4 text-amber-700 shrink-0" />
                        <span className="text-xs font-mono font-extrabold text-slate-900 truncate">
                          {c.access_code || 'Χωρίς κωδικό / Ρεσεψιόν'}
                        </span>
                      </div>
                      {c.access_code && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(c.id, c.access_code || '', e)}
                          className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-white border border-amber-300 rounded-lg px-2 py-1 shadow-xs"
                        >
                          {isCopied ? 'Αντιγράφηκε!' : 'Αντιγραφή'}
                        </button>
                      )}
                    </div>

                    {/* Timing & Team info */}
                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Ώρα & Ημέρα:</span>
                        <strong className="text-slate-900">
                          {c.scheduled_time || '11:00-14:00'} ({new Date(c.scheduled_date).toLocaleDateString('el-GR', { day: 'numeric', month: 'short' })})
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Καθαρίστρια:</span>
                        <strong className="text-slate-800">{c.cleaner_name || '-'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Οδηγός:</span>
                        <strong className="text-slate-800">{c.driver_name || '-'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div
                    className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-slate-400 font-semibold">{c.client_name}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleOpenPrintSingle(c, e)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-700 bg-slate-100 hover:bg-teal/10 hover:text-teal font-bold transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Εκτύπωση</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleEdit(c, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Επεξεργασία"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleRequestDelete(c, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Διαγραφή Καθαρισμού"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* ── EMPTY STATE ── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 sm:p-16 text-center shadow-xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal/10 rounded-3xl flex items-center justify-center mx-auto mb-4 text-teal">
            {isAirbnb ? <Home className="w-8 h-8 sm:w-10 sm:h-10" /> : <Building className="w-8 h-8 sm:w-10 sm:h-10" />}
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading mb-1">
            Δεν βρέθηκαν καθαρισμοί
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Δεν υπάρχουν εγγραφές με τα επιλεγμένα κριτήρια αναζήτησης ή ημερομηνίας.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setDateFilter('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Επαναφορά φίλτρων</span>
            </button>
            <button
              type="button"
              onClick={handleOpenNewModal}
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Νέος Καθαρισμός</span>
            </button>
          </div>
        </div>
      )}
      </div>

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
        selectedDate={dateFilter === 'today' ? todayStr : dateFilter === 'tomorrow' ? tomorrowStr : customDate || todayStr}
        category={category}
      />

      {/* Custom Confirmation Deletion Modal */}
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
