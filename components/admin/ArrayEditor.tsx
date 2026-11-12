'use client';

import { useState, useTransition } from 'react';
import { saveContent } from '@/app/actions/content';
import { Plus, Trash2, ChevronDown, ChevronUp, Check, Loader2, AlertCircle } from 'lucide-react';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface ArrayItem {
  [key: string]: string;
}

interface ArrayEditorProps {
  section: string;
  fieldKey: string;
  label: string;
  items: ArrayItem[];
  fields: { key: string; label: string; type?: 'text' | 'textarea' }[];
  addLabel?: string;
}

export function ArrayEditor({
  section,
  fieldKey,
  label,
  items: initialItems,
  fields,
  addLabel = 'Προσθήκη',
}: ArrayEditorProps) {
  const [items, setItems] = useState<ArrayItem[]>(initialItems);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleChange = (index: number, key: string, value: string) => {
    const newItems = items.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setItems(newItems);
    window.dispatchEvent(new CustomEvent('live-preview-update', { detail: { section, fieldKey, value: JSON.stringify(newItems), type: 'json' } }));
  };

  const handleAdd = () => {
    const newItem: ArrayItem = {};
    fields.forEach((f) => { newItem[f.key] = ''; });
    const newItems = [...items, newItem];
    setItems(newItems);
    setExpanded(newItems.length - 1);
    window.dispatchEvent(new CustomEvent('live-preview-update', { detail: { section, fieldKey, value: JSON.stringify(newItems), type: 'json' } }));
  };

  const handleDelete = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    if (expanded === index) setExpanded(null);
    setDeleteTarget(null);
    window.dispatchEvent(new CustomEvent('live-preview-update', { detail: { section, fieldKey, value: JSON.stringify(newItems), type: 'json' } }));
  };

  const requestDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setDeleteTarget(index);
  };

  const handleSave = () => {
    setSaveState('saving');
    startTransition(async () => {
      const result = await saveContent(section, fieldKey, JSON.stringify(items), 'json');
      if (result.success) {
        setSaveState('saved');
        window.dispatchEvent(new Event('content-saved'));
        setTimeout(() => setSaveState('idle'), 2500);
      } else {
        setSaveState('error');
        setErrorMsg(result.error ?? 'Η αποθήκευση απέτυχε');
        setTimeout(() => setSaveState('idle'), 3000);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
            saveState === 'saved'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : saveState === 'error'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-teal/15 hover:bg-teal/25 text-teal border border-teal/30 cursor-pointer'
          }`}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : saveState === 'saved' ? (
            <><Check className="w-3 h-3" /> Αποθηκεύτηκε</>
          ) : saveState === 'error' ? (
            <><AlertCircle className="w-3 h-3" /> Σφάλμα</>
          ) : (
            'Αποθήκευση όλων'
          )}
        </button>
      </div>

      {saveState === 'error' && (
        <p className="text-red-400 text-xs mb-2">{errorMsg}</p>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-border rounded-xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 gap-2">
              <button
                type="button"
                onClick={() => setExpanded(expanded === index ? null : index)}
                className="flex-1 flex items-center justify-between min-h-10 text-left text-sm font-medium text-navy hover:text-teal-dark transition-colors cursor-pointer"
              >
                <span>{item[fields[0]?.key] || `Item ${index + 1}`}</span>
                {expanded === index ? (
                  <ChevronUp className="w-4 h-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted shrink-0" />
                )}
              </button>
              <button
                type="button"
                onClick={(e) => requestDelete(e, index)}
                className="min-h-9 min-w-9 inline-flex items-center justify-center text-muted-light hover:text-destructive transition-colors rounded-lg cursor-pointer"
                title="Διαγραφή"
                aria-label="Διαγραφή"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expanded === index && (
              <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={item[field.key] ?? ''}
                        onChange={(e) => handleChange(index, field.key, e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 rounded-lg px-3 py-2 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={item[field.key] ?? ''}
                        onChange={(e) => handleChange(index, field.key, e.target.value)}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 rounded-lg px-3 py-2 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleAdd}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-teal/40 text-slate-400 hover:text-teal text-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        {addLabel}
      </button>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Διαγραφή στοιχείου;"
        description={
          deleteTarget !== null && items[deleteTarget]
            ? `"Το στοιχείο "${items[deleteTarget][fields[0]?.key] || `Εγγραφή ${deleteTarget + 1}`}" θα διαγραφεί μόνιμα. Θυμήσου να κάνεις Αποθήκευση όλων για να εφαρμοστεί.`
            : 'Αυτό το στοιχείο θα διαγραφεί μόνιμα.'
        }
        confirmLabel="Ναι, διαγραφή"
        onConfirm={() => deleteTarget !== null && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
