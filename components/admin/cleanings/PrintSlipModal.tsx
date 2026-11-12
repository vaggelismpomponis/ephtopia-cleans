'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  X,
  Key,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';
import {
  CLEANING_PRIORITY_CONFIG,
  hasAccessPin,
  formatPropertyTitle,
  formatFloor,
  formatClientInfo,
} from '@/lib/types/cleanings';

interface PrintSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  cleaning?: CleaningRecord | null;
  dailyCleanings?: CleaningRecord[];
  selectedDate?: string;
  category?: 'airbnb' | 'hotel' | 'all';
}

export function PrintSlipModal({
  isOpen,
  onClose,
  cleaning,
  dailyCleanings,
  selectedDate,
}: PrintSlipModalProps) {
  // If cleaning is passed, default to single; otherwise daily
  const [printMode, setPrintMode] = useState<'single' | 'daily'>(
    cleaning ? 'single' : 'daily'
  );

  if (!isOpen) return null;

  // Determine list of items to render in vertical format
  const isSingle = printMode === 'single' && cleaning;
  const itemsToRender: CleaningRecord[] = isSingle
    ? [cleaning]
    : dailyCleanings && dailyCleanings.length > 0
    ? dailyCleanings
    : cleaning
    ? [cleaning]
    : [];

  const handlePrint = () => {
    const printArea = document.getElementById('print-dispatch-container');
    if (!printArea) {
      window.print();
      return;
    }

    const oldIframe = document.getElementById('clean-print-frame');
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'clean-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    const headStyles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style')
    )
      .map((node) => node.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="el">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Δελτία Αποστολής · Ephtopia Cleans</title>
        ${headStyles}
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          *, *::before, *::after {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 0 !important;
            margin: 0 !important;
            font-size: 10pt;
            line-height: 1.35;
          }
          .vertical-dispatch-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            border: 2px solid #0f172a !important;
            background: #ffffff !important;
            border-radius: 8px !important;
            padding: 16px !important;
            margin-bottom: 20px !important;
          }
          .print-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }
          .print\\:hidden, button, [role="button"] {
            display: none !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border-color: #cbd5e1 !important;
          }
        </style>
      </head>
      <body class="bg-white text-slate-900 p-0 m-0">
        <div style="width: 100%; max-width: 100%; margin: 0 auto;">
          ${printArea.innerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          iframe.remove();
        }
      }, 2000);
    }, 350);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible printable-modal-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200/90 w-full max-w-4xl overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:m-0 print:p-0 print:w-full printable-modal-card flex flex-col max-h-[92vh] print:max-h-none print:h-auto"
        >
          {/* ── SCREEN ONLY CONTROLS HEADER (NEVER PRINTED) ── */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden no-print border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal/15 text-teal flex items-center justify-center font-bold border border-teal/20">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base font-heading tracking-tight">
                  Προεπισκόπηση & Εκτύπωση Δελτίων
                </h3>
                <p className="text-xs text-slate-400">
                  {isSingle
                    ? 'Κάθετο Δελτίο Αποστολής για Καθαρίστρια & Οδηγό'
                    : `Ημερήσιο Πρόγραμμα: ${itemsToRender.length} Κάθετα Δελτία Αποστολής`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Toggle mode if both single cleaning and daily cleanings are present */}
              {cleaning && dailyCleanings && dailyCleanings.length > 0 && (
                <div className="bg-slate-800 p-0.5 rounded-lg flex text-xs font-bold border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPrintMode('single')}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      printMode === 'single'
                        ? 'bg-teal text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Κάρτα Ακινήτου
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintMode('daily')}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      printMode === 'daily'
                        ? 'bg-teal text-white shadow-2xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Όλα της Ημέρας ({dailyCleanings.length})
                  </button>
                </div>
              )}

              {/* Main Print Trigger Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Εκτύπωση</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Κλείσιμο"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── 100% VERTICAL DISPATCH CONTAINER (PRINTABLE AREA) ── */}
          <div
            id="print-dispatch-container"
            className="p-4 sm:p-7 overflow-y-auto print:overflow-visible print:p-0 text-slate-900 bg-white flex-1 space-y-6 print:space-y-6"
          >
            {/* When daily mode has multiple cleanings, show corporate route manifest table */}
            {!isSingle && itemsToRender.length > 1 && (
              <div className="border-2 border-slate-900 rounded-xl p-5 bg-white space-y-3 vertical-dispatch-card print:border-black print:rounded-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-slate-900 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black font-heading text-slate-900 tracking-tight">
                        EPHTOPIA <span className="text-emerald-700">CLEANS</span>
                      </span>
                      <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        ΠΡΟΓΡΑΜΜΑ ΗΜΕΡΑΣ
                      </span>
                    </div>
                    <h2 className="text-sm sm:text-base font-black font-heading text-slate-900 uppercase mt-0.5">
                      ΗΜΕΡΗΣΙΟ ΠΡΟΓΡΑΜΜΑ ΔΡΟΜΟΛΟΓΙΩΝ & ΚΑΘΑΡΙΣΜΩΝ
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Συνοπτικός πίνακας αποστολών · {selectedDate || new Date().toLocaleDateString('el-GR')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 bg-slate-100 border border-slate-300 px-3 py-1 rounded-md inline-block">
                      Σύνολο Αποστολών: {itemsToRender.length}
                    </span>
                  </div>
                </div>

                {/* Corporate Manifest Routing Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3 w-8 text-center">#</th>
                        <th className="py-2.5 px-3 font-heading">Κατάλυμα & Διεύθυνση</th>
                        <th className="py-2.5 px-3 font-heading">Όροφος</th>
                        <th className="py-2.5 px-3 font-heading">Lockbox / PIN</th>
                        <th className="py-2.5 px-3 font-heading">Ωράριο</th>
                        <th className="py-2.5 px-3 font-heading">Συνεργείο & Οδηγός</th>
                        <th className="py-2.5 px-3 font-heading text-center w-16">Έλεγχος</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {itemsToRender.map((item, idx) => {
                        const propTitle = formatPropertyTitle(item.property_name, item.address);
                        const hasDistinctName =
                          item.property_name &&
                          item.property_name !== '-' &&
                          item.property_name.trim() !== item.address?.trim();

                        return (
                          <tr key={item.id} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-900 tabular-nums">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900 text-xs">
                                {propTitle}
                              </div>
                              {hasDistinctName && item.address && (
                                <div className="text-[11px] text-slate-500 truncate max-w-[260px]">
                                  {item.address} {item.area ? `· ${item.area}` : ''}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700">
                              {formatFloor(item.floor)}
                            </td>
                            <td className="py-2.5 px-3">
                              {hasAccessPin(item.access_code) ? (
                                <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded text-[11px]">
                                  {item.access_code}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">—</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                              {item.scheduled_time || '11:00 - 14:00'}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-600">
                              <div>{item.cleaner_name && item.cleaner_name !== '-' ? `Καθ: ${item.cleaner_name}` : 'Καθ: —'}</div>
                              <div>{item.driver_name && item.driver_name !== '-' ? `Οδηγ: ${item.driver_name}` : 'Οδηγ: —'}</div>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="inline-block w-4 h-4 border border-slate-400 rounded-sm"></span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* List of Vertical Dispatch Slips */}
            {itemsToRender.length > 0 ? (
              itemsToRender.map((rec, index) => {
                const priorityConfig = CLEANING_PRIORITY_CONFIG[rec.priority];
                const isLast = index === itemsToRender.length - 1;
                const propTitle = formatPropertyTitle(rec.property_name, rec.address);
                const hasInstructions = !!rec.entry_instructions?.trim();
                const hasPin = hasAccessPin(rec.access_code);

                return (
                  /* ── SINGLE VERTICAL DISPATCH CARD (TOP-TO-BOTTOM LAYOUT) ── */
                  <div
                    key={rec.id}
                    className={`vertical-dispatch-card bg-white border-2 border-slate-900 rounded-xl p-5 sm:p-6 space-y-4 print:rounded-none print:border-2 print:border-black print:p-5 ${
                      !isLast && !isSingle ? 'print-break-after' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
                            EPHTOPIA <span className="text-emerald-700">CLEANS</span>
                          </span>
                          <span className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                            ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ
                          </span>
                          {itemsToRender.length > 1 && (
                            <span className="bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black px-2 py-0.5 rounded">
                              Αποστολή #{index + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          Υπηρεσίες Επαγγελματικού Καθαρισμού & Διαχείρισης Ιματισμού
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs font-black uppercase text-slate-900 mb-1">
                          {rec.category === 'airbnb' ? 'Κατάλυμα Airbnb' : 'Ξενοδοχείο'}
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-bold">
                          ID: #{rec.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Priority Alert Banner if High/Urgent */}
                    {rec.priority !== 'normal' && (
                      <div className="bg-rose-50 border-2 border-rose-500 rounded-lg p-3 flex items-center gap-3 text-rose-900 print:bg-white print:border-black">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        <div>
                          <span className="font-black uppercase text-xs">
                            ΠΡΟΣΟΧΗ: {priorityConfig.label}
                          </span>
                          {rec.special_notes && (
                            <p className="text-xs mt-0.5 font-bold">{rec.special_notes}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 1: ΣΤΟΙΧΕΙΑ ΚΑΤΑΛΥΜΑΤΟΣ & ΤΟΠΟΘΕΣΙΑ ── */}
                    <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50/60 print:bg-white print:border-black space-y-2">
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
                        Στοιχεία Καταλύματος & Τοποθεσίας
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                            Κατάλυμα:
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight">
                            {propTitle}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5 font-medium">
                            {rec.address} {rec.area ? `· ${rec.area}` : ''}
                          </p>
                        </div>

                        <div className="self-start sm:self-auto shrink-0 text-left sm:text-right">
                          <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                            Όροφος / Διαμέρισμα:
                          </span>
                          <span className="text-sm font-bold text-slate-900 bg-white border border-slate-200/90 px-2.5 py-0.5 rounded inline-block print:border-black">
                            {formatFloor(rec.floor)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-slate-500 font-bold">Πελάτης / Υπεύθυνος:</span>{' '}
                          <strong className="text-slate-900">{formatClientInfo(rec.client_name, rec.client_phone)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ: ΚΩΔΙΚΟΣ ΕΙΣΟΔΟΥ & ΟΔΗΓΙΕΣ ΠΡΟΣΒΑΣΗΣ (ΜΟΝΟ ΑΝ ΥΠΑΡΧΟΥΝ) ── */}
                    {(hasPin || hasInstructions) && (
                      <div className="border-2 border-slate-900 bg-slate-50/50 rounded-lg p-3.5 print:border-black print:bg-white space-y-2">
                        <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider border-b border-slate-300 pb-1.5 print:text-black">
                          <Key className="w-4 h-4 text-slate-700 print:text-black shrink-0" />
                          <span>Κωδικός Εισόδου & Οδηγίες Πρόσβασης (Κρίσιμη Πληροφορία)</span>
                        </div>

                        {hasPin && (
                          <div className="space-y-1 pt-0.5">
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                              Κωδικός Lockbox / Keypad / PIN:
                            </span>
                            <div className="text-2xl font-mono font-black text-slate-900 bg-white border-2 border-slate-900 px-4 py-1.5 rounded-lg inline-block print:border-black">
                              {rec.access_code}
                            </div>
                          </div>
                        )}

                        {hasInstructions && (
                          <div className="text-xs text-slate-800 bg-white p-2.5 rounded border border-slate-300 mt-1.5 leading-relaxed print:border-black">
                            <span className="font-black text-slate-900">Οδηγίες Πρόσβασης:</span>{' '}
                            {rec.entry_instructions}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ: ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ & ΟΜΑΔΑ ── */}
                    <div className="border border-slate-300 rounded-lg p-3.5 bg-slate-50/60 print:bg-white print:border-black space-y-2">
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
                        Προγραμματισμός & Ομάδα Εργασίας
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500 block font-medium">Ημερομηνία:</span>
                          <strong className="text-slate-900 text-sm">
                            {new Date(rec.scheduled_date).toLocaleDateString('el-GR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'long',
                            })}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block font-medium">Ώρα Καθαρισμού:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.scheduled_time || '11:00 - 14:00'}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block font-medium">Καθαρίστρια / Συνεργείο:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.cleaner_name && rec.cleaner_name !== '-' ? rec.cleaner_name : 'Δεν έχει οριστεί'}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block font-medium">Οδηγός Μεταφοράς:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.driver_name && rec.driver_name !== '-' ? rec.driver_name : 'Δεν έχει οριστεί'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ: ΓΙΑ ΤΟΝ ΟΔΗΓΟ (ΙΜΑΤΙΣΜΟΣ & CHECKLIST) ── */}
                    <div className="border border-slate-300 rounded-lg p-3.5 space-y-2 print:border-black">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-slate-700 print:text-black shrink-0" />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                            Για τον Οδηγό: Παράδοση & Παραλαβή Ιματισμού
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          Checklist Οδηγού
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs print:bg-white print:border-black">
                        <span className="font-black text-slate-800 block mb-0.5">
                          Απαιτούμενα Καθαρά Λευκά Είδη:
                        </span>
                        <p className="text-slate-900 font-bold text-sm">
                          {rec.linen_requirements || 'Standard σετ κλινοσκεπασμάτων & πετσετών'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-0.5">
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                          <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block shrink-0"></span>
                          <span>Παράδοση καθαρών λευκών ειδών στο κατάλυμα</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800 font-medium">
                          <span className="w-4 h-4 border border-slate-400 rounded-sm inline-block shrink-0"></span>
                          <span>Παραλαβή σάκου άπλυτων (Laundry Bag)</span>
                        </div>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ: ΥΠΟΓΡΑΦΕΣ & ΟΛΟΚΛΗΡΩΣΗ ── */}
                    <div className="grid grid-cols-3 gap-3 pt-2.5 border-t-2 border-slate-900 text-xs text-slate-700 print:border-black">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                          Παραδόθηκε (Οδηγός):
                        </span>
                        <div className="h-6 border-b border-dashed border-slate-400 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                          Παραλήφθηκε / Ελέγχθηκε:
                        </span>
                        <div className="h-6 border-b border-dashed border-slate-400 mt-1"></div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                          Ώρα Ολοκλήρωσης:
                        </span>
                        <div className="h-6 border-b border-dashed border-slate-400 mt-1 flex items-end justify-center font-mono font-bold text-slate-400 text-[11px]">
                          ___ : ___
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                Δεν υπάρχουν καθαρισμοί προς εκτύπωση.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
