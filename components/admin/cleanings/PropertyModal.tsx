'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Key,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Building,
} from 'lucide-react';
import type { CleaningProperty } from '@/lib/types/cleanings';
import { saveProperty } from '@/app/actions/cleanings';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (property: CleaningProperty) => void;
  clientId: string;
  clientName: string;
  propertyToEdit?: CleaningProperty | null;
}

export function PropertyModal({
  isOpen,
  onClose,
  onSaved,
  clientId,
  clientName,
  propertyToEdit,
}: PropertyModalProps) {
  const [name, setName] = useState(propertyToEdit?.name || '');
  const [address, setAddress] = useState(propertyToEdit?.address || '');
  const [area, setArea] = useState(propertyToEdit?.area || '');
  const [floor, setFloor] = useState(propertyToEdit?.floor || '');
  const [accessCode, setAccessCode] = useState(propertyToEdit?.access_code || '');
  const [entryInstructions, setEntryInstructions] = useState(
    propertyToEdit?.entry_instructions || ''
  );
  const [cleaningInstructions, setCleaningInstructions] = useState(
    propertyToEdit?.cleaning_instructions || ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name);
      setAddress(propertyToEdit.address);
      setArea(propertyToEdit.area || '');
      setFloor(propertyToEdit.floor || '');
      setAccessCode(propertyToEdit.access_code || '');
      setEntryInstructions(propertyToEdit.entry_instructions || '');
      setCleaningInstructions(propertyToEdit.cleaning_instructions || '');
    } else {
      setName('');
      setAddress('');
      setArea('');
      setFloor('');
      setAccessCode('');
      setEntryInstructions('');
      setCleaningInstructions('');
    }
  }, [propertyToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await saveProperty({
        id: propertyToEdit?.id,
        client_id: clientId,
        name,
        address,
        area,
        floor,
        access_code: accessCode,
        entry_instructions: entryInstructions,
        cleaning_instructions: cleaningInstructions,
      });

      if (res.success && res.data) {
        onSaved(res.data);
        onClose();
      } else {
        setError(res.error || 'Σφάλμα κατά την αποθήκευση');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Απροσδόκητο σφάλμα');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal/20 text-teal flex items-center justify-center border border-teal/20 shadow-xs">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg font-heading tracking-tight">
                  {propertyToEdit ? 'Επεξεργασία Καταλύματος' : 'Προσθήκη Νέου Καταλύματος'}
                </h2>
                <p className="text-xs text-slate-400">Πελάτης: {clientName}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Όνομα Καταλύματος / Μονάδας *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="π.χ. Plaka Suite #3"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Όροφος / Διαμέρισμα *
                </label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="π.χ. 2ος όροφος (Διαμ. 4)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Διεύθυνση (Οδός & Αριθμός) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="π.χ. Κυδαθηναίων 18"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Περιοχή / Πόλη
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="π.χ. Πλάκα, Αθήνα"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            {/* Access Box */}
            <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                <Key className="w-4 h-4 text-amber-700" />
                <span>Κωδικοί & Πρόσβαση (Για Οδηγό & Καθαρίστρια)</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Κωδικός Lockbox / Keypad
                  </label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="π.χ. Lockbox 4821#"
                    className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono font-extrabold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Οδηγίες Εισόδου
                  </label>
                  <input
                    type="text"
                    value={entryInstructions}
                    onChange={(e) => setEntryInstructions(e.target.value)}
                    placeholder="π.χ. Κουτί δίπλα στο ασανσέρ"
                    className="w-full bg-white border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Cleaning Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Μόνιμες Οδηγίες Καθαρισμού Καταλύματος
              </label>
              <textarea
                rows={2}
                value={cleaningInstructions}
                onChange={(e) => setCleaningInstructions(e.target.value)}
                placeholder="π.χ. Προσοχή στα παρκέ, αλλαγή σε 2 διπλά κρεβάτια, τοποθέτηση 4 πετσετών..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal"
              />
            </div>

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Ακύρωση
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Αποθήκευση...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Αποθήκευση Καταλύματος</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
