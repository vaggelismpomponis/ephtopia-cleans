'use client';

import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
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

interface StandalonePrintSlipProps {
  cleaning: CleaningRecord;
}

export function StandalonePrintSlip({ cleaning }: StandalonePrintSlipProps) {
  const priorityConfig = CLEANING_PRIORITY_CONFIG[cleaning.priority];
  const propTitle = formatPropertyTitle(cleaning.property_name, cleaning.address);
  const hasInstructions = !!cleaning.entry_instructions?.trim();
  const hasPin = hasAccessPin(cleaning.access_code);

  const handlePrint = () => {
    const printArea = document.getElementById('standalone-print-card');
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
        <title>Δελτίο Αποστολής · ${propTitle} · Ephtopia Cleans</title>
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
            padding: 18px !important;
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
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-8 print:p-0 print:bg-white">
      {/* ── TOP SCREEN-ONLY ACTION BAR ── */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between gap-4 print:hidden">
        <Link
          href={`/admin/cleanings/${cleaning.category === 'hotel' ? 'hotels' : 'airbnb'}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/90 hover:border-slate-300 px-3 py-2 rounded-lg transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Επιστροφή στους Καθαρισμούς</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-bold px-4 py-2 rounded-lg text-xs sm:text-sm shadow-2xs transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Εκτύπωση Δελτίου (A4)</span>
        </button>
      </div>

      {/* ── PRINTABLE DISPATCH SLIP CONTAINER ── */}
      <div className="max-w-3xl mx-auto">
        <div
          id="standalone-print-card"
          className="vertical-dispatch-card bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-sm space-y-4 print:shadow-none print:border-2 print:border-black print:p-6 print:rounded-none"
        >
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
                  EPHTOPIA <span className="text-emerald-700">CLEANS</span>
                </span>
                <span className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Υπηρεσίες Επαγγελματικού Καθαρισμού & Διαχείρισης Ιματισμού
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-md text-xs font-black uppercase text-slate-900 mb-1">
                {cleaning.category === 'airbnb' ? 'Κατάλυμα Airbnb' : 'Ξενοδοχείο'}
              </div>
              <div className="text-xs text-slate-500 font-mono font-bold">
                ID: #{cleaning.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Priority Alert Banner if High/Urgent */}
          {cleaning.priority !== 'normal' && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-lg p-3 flex items-center gap-3 text-rose-900 print:bg-white print:border-black">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <span className="font-black uppercase text-xs">
                  ΠΡΟΣΟΧΗ: {priorityConfig.label}
                </span>
                {cleaning.special_notes && (
                  <p className="text-xs mt-0.5 font-bold">{cleaning.special_notes}</p>
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
                  {cleaning.address} {cleaning.area ? `· ${cleaning.area}` : ''}
                </p>
              </div>

              <div className="self-start sm:self-auto shrink-0 text-left sm:text-right">
                <span className="text-[11px] text-slate-500 block uppercase font-bold tracking-wider">
                  Όροφος / Διαμέρισμα:
                </span>
                <span className="text-sm font-bold text-slate-900 bg-white border border-slate-200/90 px-2.5 py-0.5 rounded inline-block print:border-black">
                  {formatFloor(cleaning.floor)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-slate-500 font-bold">Πελάτης / Υπεύθυνος:</span>{' '}
                <strong className="text-slate-900">{formatClientInfo(cleaning.client_name, cleaning.client_phone)}</strong>
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
                    {cleaning.access_code}
                  </div>
                </div>
              )}

              {hasInstructions && (
                <div className="text-xs text-slate-800 bg-white p-2.5 rounded border border-slate-300 mt-1.5 leading-relaxed print:border-black">
                  <span className="font-black text-slate-900">Οδηγίες Πρόσβασης:</span>{' '}
                  {cleaning.entry_instructions}
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
                  {new Date(cleaning.scheduled_date).toLocaleDateString('el-GR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">Ώρα Καθαρισμού:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.scheduled_time || '11:00 - 14:00'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">Καθαρίστρια / Συνεργείο:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.cleaner_name && cleaning.cleaner_name !== '-' ? cleaning.cleaner_name : 'Δεν έχει οριστεί'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">Οδηγός Μεταφοράς:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.driver_name && cleaning.driver_name !== '-' ? cleaning.driver_name : 'Δεν έχει οριστεί'}
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
                {cleaning.linen_requirements || 'Standard σετ κλινοσκεπασμάτων & πετσετών'}
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
      </div>
    </div>
  );
}
