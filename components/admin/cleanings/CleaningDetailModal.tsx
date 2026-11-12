'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Printer,
  Pencil,
  Trash2,
  Key,
  Clock,
  Calendar,
  Truck,
  Sparkles,
  AlertTriangle,
  Euro,
  Copy,
  Check,
  ExternalLink,
  Navigation,
} from 'lucide-react';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';
import { updateCleaningStatus, deleteCleaning } from '@/app/actions/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

interface CleaningDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleaning: CleaningRecord | null;
  onEdit: (cleaning: CleaningRecord) => void;
  onPrint: (cleaning: CleaningRecord) => void;
  onDeleted: (id: string) => void;
  onStatusChanged: (id: string, newStatus: CleaningStatus) => void;
}

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
    if (res.success) {
      onStatusChanged(cleaning.id, newStatus);
    }
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

  const handleCopyCode = () => {
    if (!cleaning.access_code) return;
    navigator.clipboard.writeText(cleaning.access_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    cleaning.address + (cleaning.area ? `, ${cleaning.area}` : '')
  )}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-5 flex items-start justify-between shrink-0">
            <div className="min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="bg-teal/20 text-teal text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase border border-teal/20">
                  {cleaning.category === 'airbnb' ? 'Airbnb Turnover' : 'Housekeeping Ξενοδοχείου'}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}>
                  {priorityConfig.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight truncate">
                {cleaning.property_name}
              </h2>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{cleaning.address}</span>
                {cleaning.floor && (
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded">
                    {cleaning.floor}
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Status Pipeline & Actions Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Status Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl text-xs font-bold">
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusChange('scheduled')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  cleaning.status === 'scheduled'
                    ? 'bg-blue-50 text-blue-700 shadow-2xs font-extrabold border border-blue-200'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Προγραμματισμένος
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusChange('in_progress')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  cleaning.status === 'in_progress'
                    ? 'bg-amber-50 text-amber-700 shadow-2xs font-extrabold border border-amber-200'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Σε εξέλιξη
              </button>
              <button
                type="button"
                disabled={updatingStatus}
                onClick={() => handleStatusChange('completed')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  cleaning.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-extrabold border border-emerald-200'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                Ολοκληρώθηκε
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPrint(cleaning)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-teal text-slate-700 hover:text-teal font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Εκτύπωση</span>
              </button>

              <button
                type="button"
                onClick={() => onEdit(cleaning)}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all shadow-2xs cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Επεξεργασία</span>
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Διαγραφή Καθαρισμού"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Details Scrollable Body */}
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-sm flex-1">
            {/* Top Alert if special notes */}
            {cleaning.special_notes && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{cleaning.special_notes}</span>
              </div>
            )}

            {/* Access & Security Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Κωδικοί & Πρόσβαση στο Κατάλυμα</span>
                </div>
                {cleaning.access_code && (
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Αντιγράφηκε!' : 'Αντιγραφή'}</span>
                  </button>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-xl font-mono font-extrabold text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl inline-block shadow-2xs">
                  {cleaning.access_code || 'Χωρίς κωδικό / Κλειδί στη ρεσεψιόν'}
                </span>
              </div>

              {cleaning.entry_instructions && (
                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-900">Οδηγίες εισόδου:</span> {cleaning.entry_instructions}
                </div>
              )}
            </div>

            {/* Timing, Address & Navigation */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {/* Date & Time */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Ημερομηνία & Ώρα
                </span>
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Calendar className="w-4 h-4 text-teal" />
                  <span>
                    {new Date(cleaning.scheduled_date).toLocaleDateString('el-GR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cleaning.scheduled_time || '11:00 - 14:00 (Ελεύθερο ωράριο)'}</span>
                </div>
              </div>

              {/* Address & GPS */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Τοποθεσία
                  </span>
                  <div className="font-bold text-slate-900 text-xs mt-1">
                    {cleaning.address} {cleaning.area ? `, ${cleaning.area}` : ''}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-800 mt-0.5">
                    Όροφος: {cleaning.floor || 'Ισόγειο'}
                  </div>
                </div>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-teal-dark mt-2"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Πλοήγηση στους Χάρτες Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Crew Assignment */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal" />
                  <span>Καθαρίστρια / Συνεργείο</span>
                </div>
                <div className="font-extrabold text-slate-900">
                  {cleaning.cleaner_name || 'Δεν έχει οριστεί'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Οδηγός Μεταφοράς</span>
                </div>
                <div className="font-extrabold text-slate-900">
                  {cleaning.driver_name || 'Δεν έχει οριστεί'}
                </div>
              </div>
            </div>

            {/* Linen & Detailed Requirements */}
            <div className="space-y-3">
              {cleaning.linen_requirements && (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 block">
                    🧺 Ανάγκες σε Λευκά Είδη (Οδηγός & Καθαρίστρια):
                  </span>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {cleaning.linen_requirements}
                  </p>
                </div>
              )}

              {cleaning.cleaning_instructions && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">
                    🧹 Οδηγίες Καθαρισμού Καταλύματος:
                  </span>
                  <p className="text-slate-800 leading-relaxed">
                    {cleaning.cleaning_instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Client Info & Price */}
            <div className="flex flex-wrap items-center justify-between border-t border-slate-200 pt-3 text-xs gap-3">
              <div>
                <span className="text-slate-400">Πελάτης:</span>{' '}
                <strong className="text-slate-900">{cleaning.client_name}</strong>
                {cleaning.client_phone && (
                  <a
                    href={`tel:${cleaning.client_phone}`}
                    className="ml-2 text-teal font-semibold hover:underline"
                  >
                    ({cleaning.client_phone})
                  </a>
                )}
              </div>

              {cleaning.price != null && (
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-base">
                  <Euro className="w-4 h-4 text-emerald-600" />
                  <span>€{Number(cleaning.price).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Custom Confirmation Deletion Modal */}
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
    </AnimatePresence>
  );
}
