'use client';

import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import type { CleaningProperty } from '@/lib/types/cleanings';
import { saveProperty } from '@/app/actions/cleanings';

const INPUT_CLASS =
  'w-full h-9 bg-white border border-border rounded-lg px-3 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-navy mb-1';

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
  const [entryInstructions, setEntryInstructions] = useState(propertyToEdit?.entry_instructions || '');
  const [cleaningInstructions, setCleaningInstructions] = useState(propertyToEdit?.cleaning_instructions || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalResetKey = `${isOpen}-${propertyToEdit?.id ?? 'new'}`;
  const [prevModalResetKey, setPrevModalResetKey] = useState(modalResetKey);

  if (prevModalResetKey !== modalResetKey) {
    setPrevModalResetKey(modalResetKey);
    setName(propertyToEdit?.name || '');
    setAddress(propertyToEdit?.address || '');
    setArea(propertyToEdit?.area || '');
    setFloor(propertyToEdit?.floor || '');
    setAccessCode(propertyToEdit?.access_code || '');
    setEntryInstructions(propertyToEdit?.entry_instructions || '');
    setCleaningInstructions(propertyToEdit?.cleaning_instructions || '');
    setError(null);
  }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/40 overflow-y-auto">
      <div className="bg-white rounded-xl border border-border w-full max-w-xl overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        <header className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-bold text-navy">
              {propertyToEdit ? 'Επεξεργασία Καταλύματος' : 'Νέο Κατάλυμα'}
            </h2>
            <p className="text-xs text-muted truncate">Πελάτης: {clientName}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Κλείσιμο" className="p-1.5 text-muted hover:text-navy hover:bg-warm-white rounded-lg transition-colors cursor-pointer">
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Όνομα Καταλύματος *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Όνομα καταλύματος" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Όροφος / Διαμέρισμα</label>
              <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="π.χ. 2ος" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Διεύθυνση *</label>
              <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Οδός & αριθμός" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Περιοχή / Πόλη</label>
              <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Περιοχή" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Κωδικός Lockbox / PIN</label>
              <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Κωδικός" className={`${INPUT_CLASS} font-mono`} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Οδηγίες Εισόδου</label>
              <input type="text" value={entryInstructions} onChange={(e) => setEntryInstructions(e.target.value)} placeholder="Κουδούνι / οδηγίες" className={INPUT_CLASS} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Μόνιμες Οδηγίες Καθαρισμού</label>
              <textarea
                rows={2}
                value={cleaningInstructions}
                onChange={(e) => setCleaningInstructions(e.target.value)}
                placeholder="Ειδικές απαιτήσεις καθαρισμού & λευκών ειδών"
                className="w-full bg-white border border-border rounded-lg p-2.5 text-xs text-navy placeholder:text-muted-light focus:outline-none focus:border-teal"
              />
            </div>
          </div>

          <footer className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg border border-border text-navy hover:bg-warm-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer">
              Ακύρωση
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 min-h-9 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Αποθήκευση Καταλύματος</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
