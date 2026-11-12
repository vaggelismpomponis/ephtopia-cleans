'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { CleaningRecord, CleaningCategory, CleaningClient } from '@/lib/types/cleanings';
import { CustomSelect } from './CustomSelect';
import { useCleaningFormState } from './useCleaningFormState';
import { CleaningFormSections } from './CleaningFormSections';
import { CleaningExtrasSection } from './CleaningExtrasSection';

interface CleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cleaning: CleaningRecord) => void;
  cleaningToEdit?: CleaningRecord | null;
  defaultCategory?: CleaningCategory;
  clients: CleaningClient[];
}

export function CleaningModal({
  isOpen,
  onClose,
  onSaved,
  cleaningToEdit,
  defaultCategory = 'airbnb',
  clients,
}: CleaningModalProps) {
  const form = useCleaningFormState({ isOpen, cleaningToEdit, defaultCategory, clients, onSaved, onClose });

  if (!isOpen) return null;

  const categoryClients = clients.filter((c) => c.category === form.category);
  const selectedClient = clients.find((c) => c.id === form.clientId);
  const hasExtras = !!(
    cleaningToEdit?.linen_requirements ||
    cleaningToEdit?.cleaning_instructions ||
    cleaningToEdit?.special_notes ||
    cleaningToEdit?.price != null ||
    (cleaningToEdit?.status && cleaningToEdit.status !== 'scheduled')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/40 overflow-y-auto">
      <div className="bg-white rounded-xl border border-border w-full max-w-2xl overflow-hidden my-auto flex flex-col max-h-[92dvh]">
        <header className="px-5 py-3.5 border-b border-border flex items-center justify-between gap-3 shrink-0 bg-white">
          <div className="flex items-center gap-3 flex-wrap min-w-0">
            <h2 className="font-heading text-base font-bold text-navy">
              {cleaningToEdit ? 'Επεξεργασία Καθαρισμού' : 'Νέος Καθαρισμός'}
            </h2>
            {!cleaningToEdit && (
              <div className="inline-flex p-0.5 bg-warm-white border border-border rounded-lg text-xs font-semibold">
                {(['airbnb', 'hotel'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      form.setCategory(cat);
                      form.setClientId('');
                      form.setSelectedPropertyId('');
                    }}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      form.category === cat ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
                    }`}
                  >
                    {cat === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="p-1.5 text-muted hover:text-navy hover:bg-warm-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={form.handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {form.error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{form.error}</span>
            </div>
          )}

          {/* Client Quick-Fill */}
          <div className="space-y-2.5">
            <label className="block text-xs font-semibold text-navy">
              Επιλογή Πελάτη (Αυτόματη Συμπλήρωση)
            </label>
            <CustomSelect
              value={form.clientId}
              onChange={form.handleClientSelect}
              searchable
              size="sm"
              searchPlaceholder="Αναζήτηση πελάτη..."
              placeholder="Ελεύθερη καταχώρηση (χωρίς επιλογή πελάτη)"
              options={[
                { value: '', label: 'Ελεύθερη καταχώρηση' },
                ...categoryClients.map((c) => ({
                  value: c.id,
                  label: c.name,
                  description: c.phone || undefined,
                  badge: `${c.properties?.length || 0} ακίνητα`,
                })),
              ]}
            />

            {selectedClient?.properties && selectedClient.properties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {selectedClient.properties.map((prop) => {
                  const selected = form.selectedPropertyId === prop.id;
                  return (
                    <button
                      key={prop.id}
                      type="button"
                      onClick={() => form.applyProperty(prop)}
                      className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-colors cursor-pointer ${
                        selected
                          ? 'bg-warm-white border-teal-dark text-teal-dark font-semibold'
                          : 'bg-white border-border text-navy hover:bg-warm-white'
                      }`}
                    >
                      {prop.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <CleaningFormSections form={form} />

          <CleaningExtrasSection
            hasInitialValues={hasExtras}
            linenRequirements={form.linenRequirements}
            setLinenRequirements={form.setLinenRequirements}
            cleaningInstructions={form.cleaningInstructions}
            setCleaningInstructions={form.setCleaningInstructions}
            specialNotes={form.specialNotes}
            setSpecialNotes={form.setSpecialNotes}
            status={form.status}
            setStatus={form.setStatus}
            price={form.price}
            setPrice={form.setPrice}
          />

          <footer className="flex items-center justify-end gap-2.5 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={form.loading}
              className="px-4 py-2 rounded-lg border border-border text-navy hover:bg-warm-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              disabled={form.loading}
              className="inline-flex items-center gap-1.5 min-h-9 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2 rounded-lg text-xs sm:text-sm transition-colors disabled:opacity-50 cursor-pointer"
            >
              {form.loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{cleaningToEdit ? 'Αποθήκευση Αλλαγών' : 'Καταχώρηση'}</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
