'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  X,
  MapPin,
  Key,
  Calendar,
  Clock,
  User,
  Truck,
  Sparkles,
  Building,
  Home,
  CheckSquare,
  AlertTriangle,
  Layers,
  Phone,
  Check,
  FileText,
} from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';

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
  category = 'all',
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

  /**
   * High-reliability print handler:
   * Uses an isolated hidden iframe containing ONLY the printable container HTML
   * and linked stylesheets, guaranteeing that NOT A SINGLE PIXEL of the admin dashboard
   * can ever leak into the printed document.
   */
  const handlePrint = () => {
    const printArea = document.getElementById('print-dispatch-container');
    if (!printArea) {
      window.print();
      return;
    }

    // Remove any previous print iframes
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

    // Copy all stylesheet links and inline style tags from current document
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
        <title>Δελτίο Αποστολής · Ephtopia Cleans</title>
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
            font-size: 10.5pt;
            line-height: 1.4;
          }
          .vertical-dispatch-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 22px !important;
            border: 2px solid #0f172a !important;
            background: #ffffff !important;
            border-radius: 12px !important;
            padding: 18px !important;
          }
          .page-break-card {
            page-break-after: always !important;
            break-after: page !important;
          }
          .print\\:hidden, button, [role="button"] {
            display: none !important;
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
      {/* Modal Backdrop: on screen fixed backdrop; in print static, unstyled & overflow-visible */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible printable-modal-overlay">
        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:m-0 print:p-0 print:w-full printable-modal-card flex flex-col max-h-[92vh] print:max-h-none print:h-auto"
        >
          {/* ── SCREEN ONLY CONTROLS HEADER (NEVER PRINTED) ── */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal/20 text-teal flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base font-heading tracking-tight">
                  Προεπισκόπηση & Εκτύπωση Δελτίων
                </h3>
                <p className="text-xs text-slate-400">
                  {isSingle
                    ? 'Κάθετο Δελτίο Αποστολής για Καθαρίστρια & Οδηγό'
                    : `Ημερήσιο Πρόγραμμα: ${itemsToRender.length} Κάθετα Δελτία Αποστολής`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Toggle mode if both single cleaning and daily cleanings are present */}
              {cleaning && dailyCleanings && dailyCleanings.length > 0 && (
                <div className="bg-slate-800 p-1 rounded-xl flex text-xs font-bold border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPrintMode('single')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      printMode === 'single'
                        ? 'bg-teal text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Κάρτα Ακινήτου
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrintMode('daily')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      printMode === 'daily'
                        ? 'bg-teal text-white shadow-xs'
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
                className="flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Εκτύπωση</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Κλείσιμο"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── 100% VERTICAL DISPATCH CONTAINER (PRINTABLE AREA) ── */}
          <div
            id="print-dispatch-container"
            className="p-4 sm:p-8 overflow-y-auto print:overflow-visible print:p-0 text-slate-900 bg-white flex-1 space-y-8 print:space-y-6"
          >
            {/* When daily mode has multiple cleanings, show top executive summary banner */}
            {!isSingle && itemsToRender.length > 1 && (
              <div className="border-2 border-slate-900 rounded-2xl p-5 bg-slate-50 space-y-3 vertical-dispatch-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3">
                  <div>
                    <h2 className="text-lg font-black font-heading text-slate-900 uppercase">
                      ΗΜΕΡΗΣΙΟ ΠΡΟΓΡΑΜΜΑ ΔΡΟΜΟΛΟΓΙΩΝ & ΚΑΘΑΡΙΣΜΩΝ
                    </h2>
                    <p className="text-xs text-slate-600">
                      Συνοπτικός πίνακας αποστολών ημέρας · Ephtopia Cleans
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 bg-white border border-slate-300 px-3 py-1 rounded-lg">
                      Σύνολο Αποστολών: {itemsToRender.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {itemsToRender.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
                          {idx + 1}
                        </span>
                        <strong className="text-slate-900 text-sm">
                          {item.property_name}
                        </strong>
                        <span className="text-slate-700 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {item.floor || 'Ισόγειο'}
                        </span>
                        <span className="text-slate-500 truncate max-w-[220px]">
                          {item.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded">
                          Lockbox: {item.access_code || 'Χωρίς'}
                        </span>
                        <span className="font-bold text-slate-700">
                          {item.scheduled_time || '11:00 - 14:00'}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Καθ: {item.cleaner_name || '-'} / Οδηγ: {item.driver_name || '-'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List of Vertical Dispatch Slips */}
            {itemsToRender.length > 0 ? (
              itemsToRender.map((rec, index) => {
                const priorityConfig = CLEANING_PRIORITY_CONFIG[rec.priority];
                const isLast = index === itemsToRender.length - 1;

                return (
                  /* ── SINGLE VERTICAL DISPATCH CARD (TOP-TO-BOTTOM LAYOUT) ── */
                  <div
                    key={rec.id}
                    className={`vertical-dispatch-card bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-7 space-y-5 print:rounded-none print:border-2 print:border-black print:p-5 ${
                      !isLast && !isSingle ? 'print-break-after' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="border-b-2 border-slate-900 pb-3.5 flex items-start justify-between">
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
                        <p className="text-xs text-slate-600 mt-1">
                          Υπηρεσίες Επαγγελματικού Καθαρισμού & Διαχείρισης Ιματισμού
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-black uppercase text-slate-900 mb-1">
                          {rec.category === 'airbnb' ? 'Κατάλυμα Airbnb' : 'Ξενοδοχείο'}
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-bold">
                          ID: #{rec.id.slice(0, 8).toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Priority Alert Banner if High/Urgent */}
                    {rec.priority !== 'normal' && (
                      <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-3 flex items-center gap-3 text-rose-900 print:bg-white print:border-black">
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
                    <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70 print:bg-white print:border-black space-y-2.5">
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
                        1. Στοιχεία Καταλύματος & Τοποθεσίας
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-xs text-slate-500 block">Όνομα Καταλύματος:</span>
                          <span className="text-lg font-black text-slate-900 font-heading">
                            {rec.property_name}
                          </span>
                        </div>

                        {/* Floor info without border */}
                        <div className="self-start sm:self-auto">
                          <span className="text-xs text-slate-500 block sm:text-right">
                            Όροφος / Διαμέρισμα:
                          </span>
                          <span className="inline-block text-base font-black text-slate-900 print:text-black sm:text-right">
                            {rec.floor || 'Ισόγειο'}
                          </span>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-500 font-bold">Διεύθυνση:</span>{' '}
                          <strong className="text-slate-900 text-sm">
                            {rec.address} {rec.area ? `· ${rec.area}` : ''}
                          </strong>
                        </div>
                        <div>
                          <span className="text-slate-500 font-bold">Πελάτης / Υπεύθυνος:</span>{' '}
                          <strong className="text-slate-900">
                            {rec.client_name}{' '}
                            {rec.client_phone ? `(Τηλ: ${rec.client_phone})` : ''}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 2: ΚΩΔΙΚΟΣ ΕΙΣΟΔΟΥ & ΟΔΗΓΙΕΣ (ΜΕΓΑΛΟ BOLD ΠΛΑΙΣΙΟ) ── */}
                    <div className="border border-slate-300 bg-slate-50/70 rounded-xl p-4 print:border-black print:bg-white space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5 print:text-black">
                        <Key className="w-4 h-4 text-slate-700 print:text-black" />
                        <span>2. Κωδικός Εισόδου & Οδηγίες Πρόσβασης (Κρίσιμη Πληροφορία)</span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="text-xs font-bold text-slate-700">
                          Κωδικός Lockbox / Keypad / PIN:
                        </div>
                        <div className="text-2xl font-mono font-black text-slate-900 bg-white border border-slate-300 px-4 py-2 rounded-xl inline-block print:border-black print:text-2xl">
                          {rec.access_code || 'Κλειδί από ρεσεψιόν / Χωρίς κωδικό'}
                        </div>
                      </div>

                      {rec.entry_instructions && (
                        <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mt-2 leading-relaxed print:border-black">
                          <span className="font-black text-slate-900">Οδηγίες Πρόσβασης:</span>{' '}
                          {rec.entry_instructions}
                        </div>
                      )}
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 3: ΠΡΟΓΡΑΜΜΑΤΙΣΜΟΣ & ΟΜΑΔΑ ── */}
                    <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70 print:bg-white print:border-black space-y-2">
                      <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
                        3. Προγραμματισμός & Ομάδα Εργασίας
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 block">Ημερομηνία:</span>
                          <strong className="text-slate-900 text-sm">
                            {new Date(rec.scheduled_date).toLocaleDateString('el-GR', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'long',
                            })}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Ώρα Καθαρισμού:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.scheduled_time || '11:00 - 14:00'}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Καθαρίστρια / Συνεργείο:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.cleaner_name || 'Δεν έχει οριστεί'}
                          </strong>
                        </div>

                        <div>
                          <span className="text-slate-500 block">Οδηγός Μεταφοράς:</span>
                          <strong className="text-slate-900 text-sm">
                            {rec.driver_name || 'Δεν έχει οριστεί'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 4: ΓΙΑ ΤΟΝ ΟΔΗΓΟ (ΙΜΑΤΙΣΜΟΣ & CHECKLIST) ── */}
                    <div className="border border-slate-300 rounded-xl p-4 space-y-2 print:border-black">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-blue-700" />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                            4. Για τον Οδηγό: Παράδοση & Παραλαβή Ιματισμού
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          Checklist Οδηγού
                        </span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs print:bg-white print:border-black">
                        <span className="font-black text-slate-800 block mb-1">
                          Απαιτούμενα Καθαρά Λευκά Είδη:
                        </span>
                        <p className="text-slate-900 font-bold text-sm">
                          {rec.linen_requirements || 'Standard σετ κλινοσκεπασμάτων & πετσετών'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                        <label className="flex items-center gap-2 text-slate-800 font-medium">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-400 text-black pointer-events-none"
                          />
                          <span>[  ] Παράδοση καθαρών λευκών ειδών στο κατάλυμα</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-800 font-medium">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-400 text-black pointer-events-none"
                          />
                          <span>[  ] Παραλαβή σάκου άπλυτων (Laundry Bag)</span>
                        </label>
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 5: ΓΙΑ ΤΗΝ ΚΑΘΑΡΙΣΤΡΙΑ (ΟΔΗΓΙΕΣ & CHECKLIST) ── */}
                    <div className="border border-slate-300 rounded-xl p-4 space-y-2 print:border-black">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                            5. Για την Καθαρίστρια: Οδηγίες & Έλεγχος Ποιότητας
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">
                          Turnover Checklist
                        </span>
                      </div>

                      {rec.cleaning_instructions && (
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 print:bg-white print:border-black">
                          <span className="font-bold text-slate-900">Ειδικές Παρατηρήσεις:</span>{' '}
                          {rec.cleaning_instructions}
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                        {[
                          'Αερισμός & απορρίμματα',
                          'Αλλαγή & στρώσιμο κρεβατιών',
                          'Απολύμανση μπάνιου',
                          'Καθαρισμός κουζίνας',
                          'Σκούπισμα & σφουγγάρισμα',
                          'Έλεγχος κλειδώματος & κλειδιά',
                        ].map((task) => (
                          <label
                            key={task}
                            className="flex items-center gap-2 text-slate-800 font-medium text-[11px]"
                          >
                            <input
                              type="checkbox"
                              className="w-3.5 h-3.5 rounded border-slate-400 text-black pointer-events-none"
                            />
                            <span>[  ] {task}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* ── ΚΑΘΕΤΗ ΕΝΟΤΗΤΑ 6: ΥΠΟΓΡΑΦΕΣ & ΠΑΡΑΔΟΣΗ ── */}
                    <div className="border-t-2 border-slate-900 pt-3.5 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">
                          Ώρα Ολοκλήρωσης
                        </div>
                        <div className="h-8 border-b-2 border-slate-900 flex items-end justify-center font-mono font-bold text-xs">
                          ___ : ___
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">
                          Υπογραφή Καθαρίστριας
                        </div>
                        <div className="h-8 border-b-2 border-slate-900 flex items-end justify-center text-xs text-slate-600 italic">
                          {rec.cleaner_name || '........................'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-1">
                          Υπογραφή Οδηγού
                        </div>
                        <div className="h-8 border-b-2 border-slate-900 flex items-end justify-center text-xs text-slate-600 italic">
                          {rec.driver_name || '........................'}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
                      * Σε περίπτωση αλλαγής κωδικού ή αδυναμίας εισόδου, καλέστε άμεσα στο κέντρο επιχειρήσεων Ephtopia Cleans.
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
