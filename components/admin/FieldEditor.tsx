'use client';

import { useState, useTransition } from 'react';
import { saveContent, resetContent } from '@/app/actions/content';
import { Check, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface FieldEditorProps {
  section: string;
  fieldKey: string;
  label: string;
  defaultValue: string;
  currentValue: string;
  type?: 'text' | 'textarea' | 'email' | 'url' | 'tel';
  placeholder?: string;
  hint?: string;
  maxLength?: number;
}

export function FieldEditor({
  section,
  fieldKey,
  label,
  defaultValue,
  currentValue,
  type = 'text',
  placeholder,
  hint,
  maxLength,
}: FieldEditorProps) {
  const [value, setValue] = useState(currentValue);
  const [prevCurrentValue, setPrevCurrentValue] = useState(currentValue);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  if (prevCurrentValue !== currentValue) {
    setPrevCurrentValue(currentValue);
    setValue(currentValue);
  }

  const isDirty = value !== currentValue;
  const isDefault = value === defaultValue;

  const handleSave = () => {
    if (!isDirty && saveState !== 'idle') return;
    setSaveState('saving');
    startTransition(async () => {
      const result = await saveContent(section, fieldKey, value, 'text');
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

  const handleReset = () => {
    setValue(defaultValue);
    setSaveState('saving');
    startTransition(async () => {
      const result = await resetContent(section, fieldKey);
      if (result.success) {
        setSaveState('saved');
        window.dispatchEvent(new Event('content-saved'));
        setTimeout(() => setSaveState('idle'), 2500);
      } else {
        setSaveState('error');
        setErrorMsg(result.error ?? 'Η επαναφορά απέτυχε');
        setTimeout(() => setSaveState('idle'), 3000);
      }
    });
  };

  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {!isDefault && (
            <button
              onClick={handleReset}
              disabled={isPending}
              className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-500 transition-colors"
              title="Επαναφορά στην προεπιλογή"
            >
              <RotateCcw className="w-3 h-3" />
              Επαναφορά
            </button>
          )}
          {isDirty && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" title="Μη αποθηκευμένες αλλαγές" />
          )}
        </div>
      </div>

      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              window.dispatchEvent(new CustomEvent('live-preview-update', { detail: { section, fieldKey, value: e.target.value, type: 'text' } }));
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSave(); }}
            placeholder={placeholder}
            maxLength={maxLength}
            rows={3}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-lg px-4 py-3 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all resize-none"
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              window.dispatchEvent(new CustomEvent('live-preview-update', { detail: { section, fieldKey, value: e.target.value, type: 'text' } }));
            }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-lg px-4 py-3 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all pr-24"
          />
        )}

        {/* Save button — inline for inputs, below for textareas */}
        <div className={type === 'textarea' ? 'mt-2 flex justify-between items-center' : 'absolute right-2 top-1/2 -translate-y-1/2'}>
          {maxLength && (
            <span className={`text-[10px] ${value.length > maxLength * 0.9 ? 'text-amber-500' : 'text-slate-400'}`}>
              {value.length}/{maxLength}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isPending || (!isDirty && saveState === 'idle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              saveState === 'saved'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : saveState === 'error'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : isDirty
                ? 'bg-teal/15 hover:bg-teal/25 text-teal border border-teal/30 cursor-pointer'
                : 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
            }`}
          >
            {isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : saveState === 'saved' ? (
              <><Check className="w-3 h-3" /> Αποθηκεύτηκε</>
            ) : saveState === 'error' ? (
              <><AlertCircle className="w-3 h-3" /> Σφάλμα</>
            ) : (
              'Αποθήκευση'
            )}
          </button>
        </div>
      </div>

      {saveState === 'error' && (
        <p className="text-red-400 text-xs mt-1">{errorMsg}</p>
      )}
      {hint && <p className="text-slate-400 text-[11px] mt-1">{hint}</p>}
    </div>
  );
}
