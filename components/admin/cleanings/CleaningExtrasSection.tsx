'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CleaningStatus } from '@/lib/types/cleanings';
import { CustomSelect } from './CustomSelect';

const INPUT_CLASS =
  'w-full h-9 bg-white border border-border rounded-lg px-3 text-xs sm:text-sm text-navy placeholder:text-muted-light focus:outline-none focus:border-teal transition-colors';
const LABEL_CLASS = 'block text-xs font-semibold text-navy mb-1';

interface CleaningExtrasSectionProps {
  hasInitialValues: boolean;
  linenRequirements: string;
  setLinenRequirements: (v: string) => void;
  cleaningInstructions: string;
  setCleaningInstructions: (v: string) => void;
  specialNotes: string;
  setSpecialNotes: (v: string) => void;
  status: CleaningStatus;
  setStatus: (v: CleaningStatus) => void;
  price: string;
  setPrice: (v: string) => void;
}

const LINEN_PRESETS = ['2 Διπλά σεντόνια', '4 Πετσέτες σώματος', '2 Πατάκια μπάνιου'];

export function CleaningExtrasSection(props: CleaningExtrasSectionProps) {
  const [expanded, setExpanded] = useState(props.hasInitialValues);

  const appendPreset = (text: string) => {
    props.setLinenRequirements(
      props.linenRequirements ? `${props.linenRequirements}, ${text}` : text
    );
  };

  return (
    <section className="border-t border-border pt-3.5">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between text-xs font-semibold text-navy hover:text-teal-dark transition-colors cursor-pointer py-1"
      >
        <span>Ιματισμός, Οδηγίες, Κατάσταση &amp; Χρέωση (προαιρετικά)</span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      {expanded && (
        <div className="space-y-3 pt-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
              <label className="text-xs font-semibold text-navy">Ανάγκες σε Λευκά Είδη</label>
              <div className="flex flex-wrap gap-1">
                {LINEN_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => appendPreset(preset)}
                    className="px-2 py-0.5 text-[11px] bg-warm-white border border-border hover:border-navy/30 text-navy rounded cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              value={props.linenRequirements}
              onChange={(e) => props.setLinenRequirements(e.target.value)}
              placeholder="Π.χ. 2 Διπλά σεντόνια, 4 πετσέτες..."
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS}>Κατάσταση</label>
              <CustomSelect
                value={props.status}
                onChange={(val) => props.setStatus(val as CleaningStatus)}
                size="sm"
                options={[
                  { value: 'scheduled', label: 'Προγραμματισμένος', colorDot: 'bg-blue-500' },
                  { value: 'in_progress', label: 'Σε εξέλιξη', colorDot: 'bg-amber-500' },
                  { value: 'completed', label: 'Ολοκληρώθηκε', colorDot: 'bg-emerald-500' },
                  { value: 'cancelled', label: 'Ακυρώθηκε', colorDot: 'bg-slate-400' },
                ]}
              />
            </div>

            <div>
              <label className={LABEL_CLASS}>Χρέωση (€)</label>
              <input
                type="number"
                step="0.5"
                value={props.price}
                onChange={(e) => props.setPrice(e.target.value)}
                placeholder="0.00"
                className={`${INPUT_CLASS} tabular-nums`}
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Οδηγίες καθαρισμού</label>
            <textarea
              rows={2}
              value={props.cleaningInstructions}
              onChange={(e) => props.setCleaningInstructions(e.target.value)}
              placeholder="Ειδικές απαιτήσεις καθαρισμού"
              className="w-full bg-white border border-border rounded-lg p-2.5 text-xs text-navy placeholder:text-muted-light focus:outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Εσωτερικές σημειώσεις / Check-in</label>
            <input
              type="text"
              value={props.specialNotes}
              onChange={(e) => props.setSpecialNotes(e.target.value)}
              placeholder="Ώρα άφιξης επισκέπτη ή εσωτερικές παρατηρήσεις"
              className={INPUT_CLASS}
            />
          </div>
        </div>
      )}
    </section>
  );
}

