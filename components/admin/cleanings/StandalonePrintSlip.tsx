'use client';

import Link from 'next/link';
import {
  Printer,
  ArrowLeft,
  MapPin,
  Key,
  Truck,
  AlertTriangle,
} from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';

interface StandalonePrintSlipProps {
  cleaning: CleaningRecord;
}

export function StandalonePrintSlip({ cleaning }: StandalonePrintSlipProps) {
  const priorityConfig = CLEANING_PRIORITY_CONFIG[cleaning.priority];

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
        <title>Δελτίο Αποστολής · ${cleaning.property_name} · Ephtopia Cleans</title>
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
            border: 2px solid #0f172a !important;
            background: #ffffff !important;
            border-radius: 12px !important;
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
    <div className="min-h-screen bg-slate-100 p-3 sm:p-8 print:p-0 print:bg-white text-slate-900">
      {/* Top screen-only navigation bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden no-print">
        <Link
          href={
            cleaning.category === 'airbnb'
              ? '/admin/cleanings/airbnb'
              : '/admin/cleanings/hotels'
          }
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Επιστροφή στους Καθαρισμούς</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Εκτύπωση Τώρα</span>
        </button>
      </div>

      {/* Printable Vertical Dispatch Card */}
      <div id="standalone-print-card" className="max-w-4xl mx-auto print:max-w-none">
        <div className="vertical-dispatch-card bg-white border-2 border-slate-900 rounded-2xl p-5 sm:p-7 space-y-5 print:rounded-none print:border-2 print:border-black print:p-5 shadow-xl print:shadow-none">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3.5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black font-heading tracking-tight text-slate-900">
                  EPHTOPIA <span className="text-emerald-700">CLEANS</span>
                </span>
                <span className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Υπηρεσίες Επαγγελματικού Καθαρισμού & Διαχείρισης Ιματισμού
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-block px-3 py-1 bg-slate-100 border border-slate-300 rounded-lg text-xs font-black uppercase text-slate-900 mb-1">
                {cleaning.category === 'airbnb' ? 'Κατάλυμα Airbnb' : 'Ξενοδοχείο'}
              </div>
              <div className="text-xs text-slate-500 font-mono font-bold">
                ID: #{cleaning.id.slice(0, 8).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Priority Alert Banner if High/Urgent */}
          {cleaning.priority !== 'normal' && (
            <div className="bg-rose-50 border-2 border-rose-500 rounded-xl p-3 flex items-center gap-3 text-rose-900 print:bg-white print:border-black">
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
          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70 print:bg-white print:border-black space-y-2.5">
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-1">
              1. Στοιχεία Καταλύματος & Τοποθεσίας
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-500 block">Όνομα Καταλύματος:</span>
                <span className="text-lg font-black text-slate-900 font-heading">
                  {cleaning.property_name}
                </span>
              </div>

              {/* Floor info without border */}
              <div className="self-start sm:self-auto">
                <span className="text-xs text-slate-500 block sm:text-right">
                  Όροφος / Διαμέρισμα:
                </span>
                <span className="inline-block text-base font-black text-slate-900 print:text-black sm:text-right">
                  {cleaning.floor || 'Ισόγειο'}
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-bold">Διεύθυνση:</span>{' '}
                <strong className="text-slate-900 text-sm">
                  {cleaning.address} {cleaning.area ? `· ${cleaning.area}` : ''}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 font-bold">Πελάτης / Υπεύθυνος:</span>{' '}
                <strong className="text-slate-900">
                  {cleaning.client_name}{' '}
                  {cleaning.client_phone ? `(Τηλ: ${cleaning.client_phone})` : ''}
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
                {cleaning.access_code || 'Κλειδί από ρεσεψιόν / Χωρίς κωδικό'}
              </div>
            </div>

            {cleaning.entry_instructions && (
              <div className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 mt-2 leading-relaxed print:border-black">
                <span className="font-black text-slate-900">Οδηγίες Πρόσβασης:</span>{' '}
                {cleaning.entry_instructions}
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
                  {new Date(cleaning.scheduled_date).toLocaleDateString('el-GR', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'long',
                  })}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block">Ώρα Καθαρισμού:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.scheduled_time || '11:00 - 14:00'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block">Καθαρίστρια / Συνεργείο:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.cleaner_name || 'Δεν έχει οριστεί'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 block">Οδηγός Μεταφοράς:</span>
                <strong className="text-slate-900 text-sm">
                  {cleaning.driver_name || 'Δεν έχει οριστεί'}
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
                {cleaning.linen_requirements || 'Standard σετ κλινοσκεπασμάτων & πετσετών'}
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


        </div>
      </div>
    </div>
  );
}
