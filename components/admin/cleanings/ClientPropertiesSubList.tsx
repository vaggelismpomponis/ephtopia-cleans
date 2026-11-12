'use client';

import { Check, Copy } from 'lucide-react';
import type { CleaningClient, CleaningProperty } from '@/lib/types/cleanings';

interface ClientPropertiesSubListProps {
  client: CleaningClient;
  properties: CleaningProperty[];
  copiedCodeId: string | null;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onBookCleaning: (client: CleaningClient, prop?: CleaningProperty) => void;
  onAddProperty: (client: CleaningClient) => void;
  onEditProperty: (client: CleaningClient, prop: CleaningProperty) => void;
  onDeleteProperty: (propId: string, propName: string) => void;
}

export function ClientPropertiesSubList({
  client,
  properties,
  copiedCodeId,
  onCopyCode,
  onBookCleaning,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
}: ClientPropertiesSubListProps) {
  return (
    <div className="border-t border-border bg-warm-white/60 px-4 sm:px-5 py-3 pl-9 sm:pl-12">
      {properties.length === 0 ? (
        <div className="flex items-center justify-between py-2 text-xs text-muted">
          <span>Δεν έχουν καταχωρηθεί καταλύματα.</span>
          <button
            type="button"
            onClick={() => onAddProperty(client)}
            className="font-semibold text-teal-dark hover:underline cursor-pointer"
          >
            + Προσθήκη καταλύματος
          </button>
        </div>
      ) : (
        <div className="divide-y divide-border/70 border border-border rounded-lg bg-white overflow-hidden">
          {properties.map((prop) => {
            const isCopied = copiedCodeId === prop.id;
            return (
              <div
                key={prop.id}
                className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-navy">{prop.name}</span>
                    <span className="text-[11px] text-muted">· {prop.floor || 'Ισόγειο'}</span>
                  </div>
                  <p className="text-muted truncate mt-0.5">
                    {prop.address}
                    {prop.area ? ` · ${prop.area}` : ''}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {prop.access_code && (
                    <button
                      type="button"
                      onClick={(e) => onCopyCode(prop.id, prop.access_code || '', e)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-border bg-warm-white hover:bg-white font-mono font-semibold text-navy cursor-pointer"
                      title="Αντιγραφή κωδικού"
                    >
                      <span>{prop.access_code}</span>
                      {isCopied ? (
                        <Check className="w-3 h-3 text-teal-dark" strokeWidth={2} />
                      ) : (
                        <Copy className="w-3 h-3 text-muted" strokeWidth={1.75} />
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onBookCleaning(client, prop)}
                    className="font-semibold text-teal-dark hover:underline px-1.5 py-1 cursor-pointer"
                  >
                    Κλείσιμο
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProperty(client, prop)}
                    className="text-muted hover:text-navy px-1.5 py-1 cursor-pointer"
                  >
                    Επεξεργασία
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteProperty(prop.id, prop.name)}
                    className="text-muted hover:text-rose-600 px-1.5 py-1 cursor-pointer"
                  >
                    Διαγραφή
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

