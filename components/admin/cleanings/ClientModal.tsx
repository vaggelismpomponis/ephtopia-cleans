'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Phone,
  Mail,
  Building,
  Home,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  MapPin,
  Key,
} from 'lucide-react';
import type { CleaningClient, CleaningCategory } from '@/lib/types/cleanings';
import { saveClient } from '@/app/actions/cleanings';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (client: CleaningClient) => void;
  clientToEdit?: CleaningClient | null;
  defaultCategory?: CleaningCategory;
}

export function ClientModal({
  isOpen,
  onClose,
  onSaved,
  clientToEdit,
  defaultCategory = 'airbnb',
}: ClientModalProps) {
  const [category, setCategory] = useState<CleaningCategory>(
    clientToEdit?.category || defaultCategory
  );
  const [name, setName] = useState(clientToEdit?.name || '');
  const [contactPerson, setContactPerson] = useState(clientToEdit?.contact_person || '');
  const [phone, setPhone] = useState(clientToEdit?.phone || '');
  const [email, setEmail] = useState(clientToEdit?.email || '');
  const [notes, setNotes] = useState(clientToEdit?.notes || '');

  // First property fields (only when creating new client)
  const [addPropertyNow, setAddPropertyNow] = useState(false);
  const [propName, setPropName] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propArea, setPropArea] = useState('');
  const [propFloor, setPropFloor] = useState('');
  const [propAccessCode, setPropAccessCode] = useState('');
  const [propEntryInstructions, setPropEntryInstructions] = useState('');
  const [propCleaningInstructions, setPropCleaningInstructions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientToEdit) {
      setCategory(clientToEdit.category);
      setName(clientToEdit.name);
      setContactPerson(clientToEdit.contact_person || '');
      setPhone(clientToEdit.phone);
      setEmail(clientToEdit.email || '');
      setNotes(clientToEdit.notes || '');
      setAddPropertyNow(false);
    } else {
      setCategory(defaultCategory);
      setName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setNotes('');
      setAddPropertyNow(true);
      setPropName('');
      setPropAddress('');
      setPropArea('');
      setPropFloor('');
      setPropAccessCode('');
      setPropEntryInstructions('');
      setPropCleaningInstructions('');
    }
  }, [clientToEdit, defaultCategory, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Parameters<typeof saveClient>[0] = {
        id: clientToEdit?.id,
        category,
        name,
        contact_person: contactPerson,
        phone,
        email,
        notes,
      };

      if (!clientToEdit && addPropertyNow && propName && propAddress) {
        payload.newProperty = {
          name: propName,
          address: propAddress,
          area: propArea,
          floor: propFloor,
          access_code: propAccessCode,
          entry_instructions: propEntryInstructions,
          cleaning_instructions: propCleaningInstructions,
        };
      }

      const res = await saveClient(payload);
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
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal/20 text-teal flex items-center justify-center border border-teal/20 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg font-heading tracking-tight">
                  {clientToEdit ? 'Επεξεργασία Πελάτη' : 'Προσθήκη Νέου Πελάτη στη Βάση'}
                </h2>
                <p className="text-xs text-slate-400">
                  {category === 'airbnb' ? 'Ιδιοκτήτης / Διαχειριστής Airbnb' : 'Ξενοδοχειακή Επιχείρηση'}
                </p>
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
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Κατηγορία Πελάτη
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setCategory('airbnb')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    category === 'airbnb'
                      ? 'bg-teal/10 border-teal text-teal shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Airbnb Host / Εταιρεία</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('hotel')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    category === 'hotel'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>Ξενοδοχείο</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ονοματεπώνυμο / Επωνυμία *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      category === 'airbnb'
                        ? 'π.χ. Αλέξανδρος Γεωργίου'
                        : 'π.χ. Hotel Hermes Athens'
                    }
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Υπεύθυνος Επικοινωνίας
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="π.χ. Νίκος (Reception Manager)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Τηλέφωνο Επικοινωνίας *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="π.χ. 6941234567 ή 2103244111"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="π.χ. info@hotelhermes.gr"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Σημειώσεις Πελάτη
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ειδικές συμφωνίες, συχνότητα καθαρισμών, τιμολόγηση κλπ."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            {/* Optional First Property */}
            {!clientToEdit && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={addPropertyNow}
                      onChange={(e) => setAddPropertyNow(e.target.checked)}
                      className="w-4 h-4 rounded text-teal cursor-pointer"
                    />
                    <span>Προσθήκη Πρώτου Καταλύματος / Μονάδας Τώρα</span>
                  </label>
                </div>

                {addPropertyNow && (
                  <div className="space-y-3.5 pt-3 border-t border-slate-200">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Όνομα Καταλύματος / Μονάδας *
                        </label>
                        <input
                          type="text"
                          required={addPropertyNow}
                          value={propName}
                          onChange={(e) => setPropName(e.target.value)}
                          placeholder="π.χ. Acropolis Penthouse"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Όροφος / Διαμέρισμα
                        </label>
                        <input
                          type="text"
                          value={propFloor}
                          onChange={(e) => setPropFloor(e.target.value)}
                          placeholder="π.χ. 3ος όροφος"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Διεύθυνση (Οδός & Αριθμός) *
                        </label>
                        <input
                          type="text"
                          required={addPropertyNow}
                          value={propAddress}
                          onChange={(e) => setPropAddress(e.target.value)}
                          placeholder="π.χ. Μητροπόλεως 42"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Περιοχή / Πόλη
                        </label>
                        <input
                          type="text"
                          value={propArea}
                          onChange={(e) => setPropArea(e.target.value)}
                          placeholder="π.χ. Σύνταγμα, Αθήνα"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Κωδικός Lockbox / Keypad
                        </label>
                        <input
                          type="text"
                          value={propAccessCode}
                          onChange={(e) => setPropAccessCode(e.target.value)}
                          placeholder="π.χ. Lockbox 4821#"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-teal"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Οδηγίες Εισόδου
                        </label>
                        <input
                          type="text"
                          value={propEntryInstructions}
                          onChange={(e) => setPropEntryInstructions(e.target.value)}
                          placeholder="π.χ. Κουτί δεξιά από το ασανσέρ"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sticky Action Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Ακύρωση
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Αποθήκευση...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{clientToEdit ? 'Ενημέρωση Πελάτη' : 'Αποθήκευση Πελάτη'}</span>
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
