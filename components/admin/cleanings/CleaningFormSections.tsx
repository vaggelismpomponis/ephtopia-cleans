'use client';

import type { CleaningPriority } from '@/lib/types/cleanings';
import { QUICK_CLEANING_HOURS, ALL_CLEANING_HOURS_OPTIONS } from '@/lib/types/cleanings';
import { CustomSelect } from './CustomSelect';

const INPUT_CLASS =
  'w-full h-9 bg-white border border-border rounded-lg px-3 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-navy mb-1';

interface CleaningFormSectionsProps {
  form: {
    propertyName: string;
    setPropertyName: (v: string) => void;
    clientName: string;
    setClientName: (v: string) => void;
    address: string;
    setAddress: (v: string) => void;
    floor: string;
    setFloor: (v: string) => void;
    area: string;
    setArea: (v: string) => void;
    clientPhone: string;
    setClientPhone: (v: string) => void;
    accessCode: string;
    setAccessCode: (v: string) => void;
    entryInstructions: string;
    setEntryInstructions: (v: string) => void;
    scheduledDate: string;
    setScheduledDate: (v: string) => void;
    scheduledTime: string;
    setScheduledTime: (v: string) => void;
    priority: CleaningPriority;
    setPriority: (v: CleaningPriority) => void;
    cleanerName: string;
    setCleanerName: (v: string) => void;
    driverName: string;
    setDriverName: (v: string) => void;
  };
}

export function CleaningFormSections({ form }: CleaningFormSectionsProps) {
  const setDayOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    form.setScheduledDate(d.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' }));
  };

  return (
    <>
      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Ακίνητο &amp; Πρόσβαση
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Κατάλυμα / Μονάδα *</label>
            <input type="text" required value={form.propertyName} onChange={(e) => form.setPropertyName(e.target.value)} placeholder="Όνομα καταλύματος" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Πελάτης / Υπεύθυνος *</label>
            <input type="text" required value={form.clientName} onChange={(e) => form.setClientName(e.target.value)} placeholder="Ονοματεπώνυμο" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Διεύθυνση *</label>
            <input type="text" required value={form.address} onChange={(e) => form.setAddress(e.target.value)} placeholder="Οδός & αριθμός" className={INPUT_CLASS} />
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className={LABEL_CLASS}>Όροφος / Διαμ.</label>
              <input type="text" value={form.floor} onChange={(e) => form.setFloor(e.target.value)} placeholder="π.χ. 3ος" className={INPUT_CLASS} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Περιοχή</label>
              <input type="text" value={form.area} onChange={(e) => form.setArea(e.target.value)} placeholder="Περιοχή" className={INPUT_CLASS} />
            </div>
          </div>
          <div>
            <label className={LABEL_CLASS}>Τηλέφωνο</label>
            <input type="text" value={form.clientPhone} onChange={(e) => form.setClientPhone(e.target.value)} placeholder="Τηλέφωνο επαφής" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Κωδικός Lockbox / PIN</label>
            <input type="text" value={form.accessCode} onChange={(e) => form.setAccessCode(e.target.value)} placeholder="Κωδικός εισόδου" className={`${INPUT_CLASS} font-mono`} />
          </div>
          <div className="sm:col-span-2">
            <label className={LABEL_CLASS}>Οδηγίες πρόσβασης</label>
            <input type="text" value={form.entryInstructions} onChange={(e) => form.setEntryInstructions(e.target.value)} placeholder="Κουδούνι, σημείο lockbox ή οδηγίες ρεσεψιόν" className={INPUT_CLASS} />
          </div>
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Πρόγραμμα &amp; Συνεργείο
        </h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className={LABEL_CLASS}>Ημερομηνία *</label>
            <input type="date" required value={form.scheduledDate} onChange={(e) => form.setScheduledDate(e.target.value)} className={INPUT_CLASS} />
            <div className="flex gap-2 mt-1 text-[11px]">
              <button type="button" onClick={() => setDayOffset(0)} className="text-teal-dark hover:underline font-semibold cursor-pointer">Σήμερα</button>
              <span className="text-border">·</span>
              <button type="button" onClick={() => setDayOffset(1)} className="text-teal-dark hover:underline font-semibold cursor-pointer">Αύριο</button>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Ωράριο</label>
            <input type="text" list="cleaning-hours-presets" value={form.scheduledTime} onChange={(e) => form.setScheduledTime(e.target.value)} className={`${INPUT_CLASS} tabular-nums`} />
            <datalist id="cleaning-hours-presets">
              {ALL_CLEANING_HOURS_OPTIONS.map((t) => <option key={t} value={t} />)}
            </datalist>
            <div className="flex flex-wrap gap-1 mt-1">
              {QUICK_CLEANING_HOURS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => form.setScheduledTime(t)}
                  className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer tabular-nums ${form.scheduledTime.replace(/\s+/g, '') === t.replace(/\s+/g, '')
                      ? 'bg-navy text-white border-navy font-semibold'
                      : 'bg-warm-white text-muted border-border hover:text-navy'
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Προτεραιότητα</label>
            <CustomSelect
              value={form.priority}
              onChange={(val) => form.setPriority(val as CleaningPriority)}
              size="sm"
              options={[
                { value: 'normal', label: 'Κανονική', colorDot: 'bg-slate-400' },
                { value: 'high', label: 'Υψηλή', colorDot: 'bg-amber-500' },
                { value: 'urgent', label: 'Επείγον', colorDot: 'bg-rose-500' },
              ]}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={LABEL_CLASS}>Καθαρίστρια / Συνεργείο</label>
            <input type="text" value={form.cleanerName} onChange={(e) => form.setCleanerName(e.target.value)} placeholder="Όνομα υπεύθυνης" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Οδηγός</label>
            <input type="text" value={form.driverName} onChange={(e) => form.setDriverName(e.target.value)} placeholder="Όνομα οδηγού / βαν" className={INPUT_CLASS} />
          </div>
        </div>
      </section>
    </>
  );
}

