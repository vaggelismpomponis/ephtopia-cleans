'use client';

import { useState } from 'react';
import { Printer, X } from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';
import { PrintManifestSheet } from './PrintManifestSheet';
import { PrintDispatchSlipCard } from './PrintDispatchSlipCard';

interface PrintSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleaning?: CleaningRecord | null;
  dailyCleanings?: CleaningRecord[];
  selectedDate?: string;
  category?: 'airbnb' | 'hotel' | 'all';
}

function triggerIframePrint(printArea: HTMLElement) {
  document.getElementById('clean-print-frame')?.remove();
  const iframe = document.createElement('iframe');
  iframe.id = 'clean-print-frame';
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
    visibility: 'hidden',
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  const headStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('\n');

  doc.open();
  doc.write(`<!DOCTYPE html><html lang="el"><head><meta charset="utf-8" /><title>Δελτία Αποστολής · Ephtopia Cleans</title>${headStyles}<style>
    @page { size: A4 portrait; margin: 8mm 10mm; }
    *, *::before, *::after { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #fff !important; color: #0f172a !important; margin: 0; font-size: 10pt; line-height: 1.35; }
    .vertical-dispatch-card { page-break-inside: avoid !important; break-inside: avoid !important; border: 1.5px solid #000 !important; padding: 14px !important; margin-bottom: 16px !important; }
    .print-break-after { page-break-after: always !important; break-after: page !important; }
    .print\\:hidden, button, [role="button"] { display: none !important; }
  </style></head><body class="bg-white text-slate-900 p-0 m-0">${printArea.innerHTML}</body></html>`);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => iframe.remove(), 2000);
  }, 350);
}

export function PrintSlipModal({
  isOpen,
  onClose,
  cleaning,
  dailyCleanings,
  selectedDate,
}: PrintSlipModalProps) {
  const [printMode, setPrintMode] = useState<'single' | 'daily'>(cleaning ? 'single' : 'daily');

  if (!isOpen) return null;

  const isSingle = printMode === 'single' && !!cleaning;
  const itemsToRender: CleaningRecord[] = isSingle && cleaning
    ? [cleaning]
    : dailyCleanings && dailyCleanings.length > 0
      ? dailyCleanings
      : cleaning
        ? [cleaning]
        : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy/40 overflow-y-auto print:static print:p-0 print:bg-white printable-modal-overlay">
      <div className="bg-white rounded-xl border border-border w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92dvh] print:border-none print:max-w-none print:max-h-none printable-modal-card">
        {/* Clean Enterprise Modal Header */}
        <header className="bg-white px-5 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden no-print">
          <div className="min-w-0">
            <h3 className="font-heading text-base font-bold text-navy">
              Εκτύπωση Δελτίων Αποστολής
            </h3>
            <p className="text-xs text-muted">
              {isSingle ? 'Μεμονωμένο δελτίο' : `${itemsToRender.length} δελτία ημέρας`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cleaning && dailyCleanings && dailyCleanings.length > 0 && (
              <div className="inline-flex p-0.5 bg-warm-white border border-border rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPrintMode('single')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    printMode === 'single' ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
                  }`}
                >
                  Κάρτα Ακινήτου
                </button>
                <button
                  type="button"
                  onClick={() => setPrintMode('daily')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    printMode === 'daily' ? 'bg-white text-navy border border-border/80' : 'text-muted hover:text-navy'
                  }`}
                >
                  Όλα της Ημέρας ({dailyCleanings.length})
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                const area = document.getElementById('print-dispatch-container');
                if (area) triggerIframePrint(area);
                else window.print();
              }}
              className="inline-flex items-center gap-1.5 min-h-9 bg-teal hover:bg-teal-dark text-white font-semibold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" strokeWidth={1.75} />
              <span>Εκτύπωση</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Κλείσιμο"
              className="p-2 text-muted hover:text-navy hover:bg-warm-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </header>

        {/* Printable Document Body */}
        <div
          id="print-dispatch-container"
          className="p-4 sm:p-6 overflow-y-auto print:overflow-visible print:p-0 bg-warm-white/50 print:bg-white flex-1 space-y-5"
        >
          {!isSingle && itemsToRender.length > 1 && (
            <PrintManifestSheet items={itemsToRender} selectedDate={selectedDate} />
          )}

          {itemsToRender.length > 0 ? (
            itemsToRender.map((rec, index) => (
              <PrintDispatchSlipCard
                key={rec.id}
                rec={rec}
                index={index}
                totalCount={itemsToRender.length}
                isSingle={isSingle}
              />
            ))
          ) : (
            <div className="p-8 text-center text-muted text-sm">
              Δεν υπάρχουν καθαρισμοί προς εκτύπωση.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
