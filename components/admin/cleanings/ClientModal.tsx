'use client';

import { useState } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import type { CleaningClient, CleaningCategory } from '@/lib/types/cleanings';
import { saveClient } from '@/app/actions/cleanings';
import { ClientFirstPropertyFields } from './ClientFirstPropertyFields';

const INPUT_CLASS =
  'w-full h-9 bg-white border border-border rounded-lg px-3 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-navy mb-1';

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
  const [category, setCategory] = useState<CleaningCategory>(clientToEdit?.category || defaultCategory);
  const [name, setName] = useState(clientToEdit?.name || '');
  const [contactPerson, setContactPerson] = useState(clientToEdit?.contact_person || '');
  const [phone, setPhone] = useState(clientToEdit?.phone || '');
  const [email, setEmail] = useState(clientToEdit?.email || '');
  const [notes, setNotes] = useState(clientToEdit?.notes || '');
  const [addPropertyNow, setAddPropertyNow] = useState(false);
  const [propName, setPropName] = useState('');
  const [propAddress, setPropAddress] = useState('');
  const [propArea, setPropArea] = useState('');
  const [propFloor, setPropFloor] = useState('');
  const [propAccessCode, setPropAccessCode] = useState('');
  const [propEntryInstructions, setPropEntryInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalResetKey = `${isOpen}-${clientToEdit?.id ?? 'new'}-${defaultCategory}`;
  const [prevModalResetKey, setPrevModalResetKey] = useState(modalResetKey);

  if (prevModalResetKey !== modalResetKey) {
    setPrevModalResetKey(modalResetKey);
    setCategory(clientToEdit?.category || defaultCategory);
    setName(clientToEdit?.name || '');
    setContactPerson(clientToEdit?.contact_person || '');
    setPhone(clientToEdit?.phone || '');
    setEmail(clientToEdit?.email || '');
    setNotes(clientToEdit?.notes || '');
    setAddPropertyNow(!clientToEdit);
    setPropName('');
    setPropAddress('');
    setPropArea('');
    setPropFloor('');
    setPropAccessCode('');
    setPropEntryInstructions('');
    setError(null);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: Parameters<typeof saveClient>[0] = { id: clientToEdit?.id, category, name, contact_person: contactPerson, phone, email, notes };
      if (!clientToEdit && addPropertyNow && propName && propAddress) {
        payload.newProperty = { name: propName, address: propAddress, area: propArea, floor: propFloor, access_code: propAccessCode, entry_instructions: propEntryInstructions };
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/40 overflow-y-auto">
      <div className="bg-white rounded-xl border border-border w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        <header className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <h2 className="font-heading text-base font-bold text-navy">
              {clientToEdit ? 'Επεξεργασία Πελάτη' : 'Νέος Πελάτης'}
            </h2>
            <div className="inline-flex p-0.5 bg-warm-white border border-border rounded-lg text-xs font-semibold">
              {(['airbnb', 'hotel'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    category === cat ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
                  }`}
                >
                  {cat === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
                </button>
              ))}
            </div>
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
              <label className={LABEL_CLASS}>Ονοματεπώνυμο / Επωνυμία *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Όνομα πελάτη ή ξενοδοχείου" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Υπεύθυνος Επικοινωνίας</label>
              <input type="text" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Όνομα επαφής" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Τηλέφωνο *</label>
              <input type="text" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Τηλέφωνο επικοινωνίας" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@domain.gr" className={INPUT_CLASS} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL_CLASS}>Σημειώσεις</label>
              <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Συμφωνίες, συχνότητα ή ειδικές οδηγίες" className={INPUT_CLASS} />
            </div>
          </div>

          {!clientToEdit && (
            <ClientFirstPropertyFields
              enabled={addPropertyNow}
              onToggle={setAddPropertyNow}
              propName={propName}
              setPropName={setPropName}
              propFloor={propFloor}
              setPropFloor={setPropFloor}
              propAddress={propAddress}
              setPropAddress={setPropAddress}
              propArea={propArea}
              setPropArea={setPropArea}
              propAccessCode={propAccessCode}
              setPropAccessCode={setPropAccessCode}
              propEntryInstructions={propEntryInstructions}
              setPropEntryInstructions={setPropEntryInstructions}
            />
          )}

          <footer className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded-lg border border-border text-navy hover:bg-warm-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer">
              Ακύρωση
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-1.5 min-h-9 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{clientToEdit ? 'Ενημέρωση Πελάτη' : 'Αποθήκευση Πελάτη'}</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
