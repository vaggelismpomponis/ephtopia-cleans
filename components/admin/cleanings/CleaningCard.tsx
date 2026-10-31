'use client';

import {
  MapPin,
  Key,
  Clock,
  Printer,
  Pencil,
  Trash2,
  ExternalLink,
  User,
  Truck,
  Check,
  Copy,
} from 'lucide-react';
import type { CleaningRecord, CleaningStatus } from '@/lib/types/cleanings';
import { CLEANING_PRIORITY_CONFIG } from '@/lib/types/cleanings';
import { StatusDropdown } from './StatusDropdown';

interface CleaningCardProps {
  cleaning: CleaningRecord;
  isCopied: boolean;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onSelect: (c: CleaningRecord) => void;
  onStatusChange: (id: string, newStatus: CleaningStatus) => void;
  onPrint: (c: CleaningRecord, e: React.MouseEvent) => void;
  onEdit: (c: CleaningRecord, e: React.MouseEvent) => void;
  onDelete: (c: CleaningRecord, e: React.MouseEvent) => void;
}

export function CleaningCard({
  cleaning,
  isCopied,
  onCopyCode,
  onSelect,
  onStatusChange,
  onPrint,
  onEdit,
  onDelete,
}: CleaningCardProps) {
  const c = cleaning;
  const priorityConfig = CLEANING_PRIORITY_CONFIG[c.priority];
  const displayName =
    !c.property_name || c.property_name.trim() === '-'
      ? c.address || c.client_name || 'Κατάλυμα Airbnb'
      : c.property_name;

  return (
    <div
      onClick={() => onSelect(c)}
      className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges & Status */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider bg-teal/10 text-teal border-teal/20">
              {c.category === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
            </span>
            {c.priority !== 'normal' && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${priorityConfig.bg} ${priorityConfig.text} ${priorityConfig.border}`}
              >
                {priorityConfig.label}
              </span>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <StatusDropdown
              status={c.status}
              onChange={(newStatus) => onStatusChange(c.id, newStatus)}
            />
          </div>
        </div>

        {/* Property Title & Floor */}
        <h3 className="font-bold text-base text-slate-900 group-hover:text-teal transition-colors font-heading leading-snug">
          {displayName}
        </h3>

        {/* Floor & Address */}
        <div className="flex items-center gap-2 mt-1 mb-3 text-xs">
          <span className="font-bold text-slate-700 bg-slate-100 border border-slate-200/70 px-2 py-0.5 rounded-md text-[11px] shrink-0">
            {c.floor || 'Ισόγειο'}
          </span>
          <div className="flex items-center gap-1 text-slate-500 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{c.address}</span>
            {c.address && (
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(c.address + (c.area ? `, ${c.area}` : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title="Χάρτης Google"
                className="text-slate-400 hover:text-teal p-0.5 ml-0.5"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Lockbox Section */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-2.5 mb-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Key className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span
              className={`font-mono truncate ${c.access_code ? 'font-bold text-slate-900' : 'text-slate-500 font-medium'}`}
            >
              {c.access_code || 'Χωρίς κωδικό / Ρεσεψιόν'}
            </span>
          </div>
          {c.access_code && (
            <button
              type="button"
              onClick={(e) => onCopyCode(c.id, c.access_code || '', e)}
              className="text-[11px] font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded px-2 py-0.5 shadow-2xs transition-colors shrink-0 flex items-center gap-1"
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Αντιγράφηκε</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Αντιγραφή</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Operational Schedule & Assignments */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 rounded-lg p-2.5 border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              Ώρα & Ημέρα:
            </span>
            <strong className="text-slate-900 tabular-nums">
              {c.scheduled_time || '11:00 - 14:00'} (
              {new Date(c.scheduled_date).toLocaleDateString('el-GR', {
                day: 'numeric',
                month: 'short',
              })}
              )
            </strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              Καθαρίστρια:
            </span>
            <strong className="text-slate-800">{c.cleaner_name || '—'}</strong>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Truck className="w-3 h-3 text-slate-400" />
              Οδηγός:
            </span>
            <strong className="text-slate-800">{c.driver_name || '—'}</strong>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div
        className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-slate-500 font-medium truncate max-w-[140px] text-[11px]" title={c.client_name}>
          {c.client_name}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => onPrint(c, e)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold transition-colors cursor-pointer text-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Εκτύπωση</span>
          </button>
          <button
            type="button"
            onClick={(e) => onEdit(c, e)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Επεξεργασία"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => onDelete(c, e)}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Διαγραφή Καθαρισμού"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

