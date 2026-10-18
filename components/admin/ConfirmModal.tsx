'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Copy, Check } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** 'danger' (red) or 'warning' (amber). Defaults to 'danger'. */
  variant?: 'danger' | 'warning';
  /**
   * When provided, a text input appears and the confirm button stays disabled
   * until the user types this exact string (case-sensitive).
   */
  requiredConfirmText?: string;
  /** Label shown above the confirmation input. */
  confirmInputLabel?: string;
  /** Optional loading state for async confirm actions. */
  isLoading?: boolean;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Διαγραφή',
  cancelLabel = 'Άκυρο',
  onConfirm,
  onCancel,
  variant = 'danger',
  requiredConfirmText,
  confirmInputLabel,
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset input whenever modal opens/closes
  useEffect(() => {
    if (!open) {
      setInputValue('');
      setCopied(false);
    } else {
      // Auto-focus input on next frame so animation can start first
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  const handleCopy = () => {
    if (!requiredConfirmText) return;
    navigator.clipboard.writeText(requiredConfirmText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  const isDanger = variant === 'danger';

  const iconBg = isDanger
    ? 'bg-red-50 text-red-500'
    : 'bg-amber-100 text-amber-600';

  const hasConfirmInput = !!requiredConfirmText;
  const confirmDisabled = hasConfirmInput && inputValue !== requiredConfirmText;

  const confirmBtnBase = isDanger
    ? 'bg-red-500 hover:bg-red-600 text-white border border-red-500 cursor-pointer'
    : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 border border-amber-500/30 cursor-pointer';

  const confirmBtnDisabled = 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60';

  if (!mounted || typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            onClick={isLoading ? undefined : onCancel}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-sm p-6 relative">
              {/* Close ✕ */}
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
                aria-label="Άκυρο"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Trash2 className="w-5 h-5" />
              </div>

              {/* Content */}
              <h2
                id="confirm-modal-title"
                className="text-base font-bold text-slate-800 font-heading mb-1.5"
              >
                {title}
              </h2>
              {description && (
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Confirmation input */}
              {hasConfirmInput && (
                <div className="mt-5">
                  <label
                    htmlFor="confirm-modal-input"
                    className="block text-xs font-semibold text-slate-600 mb-1.5"
                  >
                    {confirmInputLabel ?? (
                      <span className="flex items-center gap-1.5 flex-wrap">
                        <span>Πληκτρολόγησε</span>
                        <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5">
                          <code className="font-mono text-slate-700 select-all text-[11px]">
                            {requiredConfirmText}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopy}
                            title="Αντιγραφή"
                            className="ml-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                          >
                            {copied
                              ? <Check className="w-3 h-3 text-emerald-500" />
                              : <Copy className="w-3 h-3" />}
                          </button>
                        </span>
                        <span>για επιβεβαίωση</span>
                      </span>
                    )}
                  </label>
                  <input
                    ref={inputRef}
                    id="confirm-modal-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !confirmDisabled) onConfirm();
                    }}
                    autoComplete="off"
                    spellCheck={false}
                    placeholder={requiredConfirmText}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 font-mono placeholder-slate-300 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={confirmDisabled || isLoading ? undefined : onConfirm}
                  disabled={confirmDisabled || isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    confirmDisabled || isLoading ? confirmBtnDisabled : confirmBtnBase
                  }`}
                >
                  {isLoading ? 'Διαγραφή...' : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
