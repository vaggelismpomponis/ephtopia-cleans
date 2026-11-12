import { AlertTriangle, Check, Copy, ExternalLink } from 'lucide-react';
import type { CleaningRecord } from '@/lib/types/cleanings';

interface CleaningDetailBodyProps {
  cleaning: CleaningRecord;
  copiedCode: boolean;
  onCopyCode: () => void;
}

export function CleaningDetailBody({ cleaning, copiedCode, onCopyCode }: CleaningDetailBodyProps) {
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
    cleaning.address + (cleaning.area ? `, ${cleaning.area}` : '')
  )}`;
  const dateLabel = new Date(cleaning.scheduled_date).toLocaleDateString('el-GR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-5 space-y-4 overflow-y-auto text-sm flex-1">
      {cleaning.special_notes && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-3.5 py-2.5 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" strokeWidth={1.75} />
          <span>{cleaning.special_notes}</span>
        </div>
      )}

      {/* Key Operational Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-b border-border pb-4">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Ημερομηνία &amp; Ώρα</dt>
          <dd className="font-semibold text-navy mt-1">{dateLabel}</dd>
          <dd className="text-muted tabular-nums mt-0.5">{cleaning.scheduled_time || '11:00 - 14:00'}</dd>
        </div>

        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Τοποθεσία &amp; Όροφος</dt>
          <dd className="font-semibold text-navy mt-1">
            {cleaning.address}
            {cleaning.area ? `, ${cleaning.area}` : ''}
          </dd>
          <dd className="mt-0.5 flex items-center gap-3">
            <span className="text-muted">Όροφος: {cleaning.floor || 'Ισόγειο'}</span>
            {cleaning.address && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-teal-dark hover:underline"
              >
                <span>Χάρτης</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.75} />
              </a>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Συνεργείο</dt>
          <dd className="font-semibold text-navy mt-1">{cleaning.cleaner_name || 'Δεν έχει οριστεί'}</dd>
        </div>

        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">Οδηγός</dt>
          <dd className="font-semibold text-navy mt-1">{cleaning.driver_name || 'Δεν έχει οριστεί'}</dd>
        </div>
      </dl>

      {/* Access PIN & Instructions */}
      {(cleaning.access_code || cleaning.entry_instructions) && (
        <div className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Πρόσβαση &amp; Κωδικός
            </span>
            {cleaning.access_code && (
              <button
                type="button"
                onClick={onCopyCode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border bg-warm-white hover:bg-white text-xs font-mono font-semibold text-navy cursor-pointer"
              >
                <span>{cleaning.access_code}</span>
                {copiedCode ? (
                  <Check className="w-3.5 h-3.5 text-teal-dark" strokeWidth={2} />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted" strokeWidth={1.75} />
                )}
              </button>
            )}
          </div>
          {cleaning.entry_instructions && (
            <p className="text-xs text-navy leading-relaxed">{cleaning.entry_instructions}</p>
          )}
        </div>
      )}

      {/* Linen & Cleaning Instructions */}
      {(cleaning.linen_requirements || cleaning.cleaning_instructions) && (
        <div className="border-b border-border pb-4 space-y-3 text-xs">
          {cleaning.linen_requirements && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-1">
                Λευκά Είδη
              </span>
              <p className="text-navy font-medium">{cleaning.linen_requirements}</p>
            </div>
          )}
          {cleaning.cleaning_instructions && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block mb-1">
                Οδηγίες Καθαρισμού
              </span>
              <p className="text-navy leading-relaxed">{cleaning.cleaning_instructions}</p>
            </div>
          )}
        </div>
      )}

      {/* Client & Price Footer */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-3 pt-1">
        <div>
          <span className="text-muted">Πελάτης:</span>{' '}
          <strong className="text-navy">{cleaning.client_name}</strong>
          {cleaning.client_phone && (
            <a href={`tel:${cleaning.client_phone}`} className="ml-2 text-teal-dark font-semibold hover:underline tabular-nums">
              {cleaning.client_phone}
            </a>
          )}
        </div>

        {cleaning.price != null && (
          <div className="font-heading font-bold text-navy text-sm tabular-nums">
            €{Number(cleaning.price).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

