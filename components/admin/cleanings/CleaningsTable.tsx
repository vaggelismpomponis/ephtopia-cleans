'use client';

import {
  MapPin,
  Key,
  Clock,
  Printer,
  Pencil,
  Trash2,
  ExternalLink,
  Check,
  Copy,
} from 'lucide-react';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';
import { StatusDropdown } from './StatusDropdown';

interface CleaningsTableProps {
  cleanings: CleaningRecord[];
  copiedCodeId: string | null;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onSelect: (c: CleaningRecord) => void;
  onStatusChange: (id: string, newStatus: CleaningStatus) => void;
  onPrint: (c: CleaningRecord, e: React.MouseEvent) => void;
  onEdit: (c: CleaningRecord, e: React.MouseEvent) => void;
  onDelete: (c: CleaningRecord, e: React.MouseEvent) => void;
}

export function CleaningsTable({
  cleanings,
  copiedCodeId,
  onCopyCode,
  onSelect,
  onStatusChange,
  onPrint,
  onEdit,
  onDelete,
}: CleaningsTableProps) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-heading">Κατάλυμα & Όροφος</th>
              <th className="py-3 px-4 font-heading">Ώρα & Ημερομηνία</th>
              <th className="py-3 px-4 font-heading">Διεύθυνση</th>
              <th className="py-3 px-4 font-heading">Lockbox / PIN</th>
              <th className="py-3 px-4 font-heading">Πελάτης</th>
              <th className="py-3 px-4 font-heading">Ομάδα</th>
              <th className="py-3 px-4 font-heading text-center">Κατάσταση</th>
              <th className="py-3 px-4 font-heading text-right">Ενέργειες</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cleanings.map((c) => {
              const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];
              const isCopied = copiedCodeId === c.id;
              const displayName =
                !c.property_name || c.property_name.trim() === '-'
                  ? c.address || c.client_name || 'Κατάλυμα Airbnb'
                  : c.property_name;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Property & Floor */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900 group-hover:text-teal transition-colors text-sm">
                        {displayName}
                      </span>
                      {c.priority !== 'normal' && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
                        >
                          {priorityConfig.label}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-bold text-slate-600 mt-0.5">
                      {c.floor || 'Ισόγειο'}
                    </div>
                  </td>

                  {/* Timing */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{c.scheduled_time || '11:00 - 14:00'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {new Date(c.scheduled_date).toLocaleDateString('el-GR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-3.5 px-4 max-w-[200px]">
                    <div className="flex items-center gap-1 font-medium text-slate-800 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{c.address}</span>
                    </div>
                    {c.area && <div className="text-[11px] text-slate-400 truncate">{c.area}</div>}
                  </td>

                  {/* Lockbox / Code */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {c.access_code ? (
                      <button
                        type="button"
                        onClick={(e) => onCopyCode(c.id, c.access_code || '', e)}
                        title="Αντιγραφή κωδικού"
                        className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-mono font-bold text-xs px-2 py-1 rounded-md transition-colors cursor-pointer"
                      >
                        <Key className="w-3 h-3 text-slate-400" />
                        <span>{c.access_code}</span>
                        {isCopied ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    ) : (
                      <span className="text-slate-400 italic">Χωρίς κωδικό</span>
                    )}
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                    {c.client_name}
                  </td>

                  {/* Team */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 text-[11px]">
                    <div>Καθ: <strong className="text-slate-800">{c.cleaner_name || '—'}</strong></div>
                    <div>Οδηγ: <strong className="text-slate-800">{c.driver_name || '—'}</strong></div>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown
                      status={c.status}
                      onChange={(newStatus) => onStatusChange(c.id, newStatus)}
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => onPrint(c, e)}
                        title="Εκτύπωση Δελτίου"
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onEdit(c, e)}
                        title="Επεξεργασία"
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => onDelete(c, e)}
                        title="Διαγραφή"
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

