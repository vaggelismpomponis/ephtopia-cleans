'use client';

import { ChevronDown, Phone, Plus, Pencil, Trash2, CalendarCheck } from 'lucide-react';
import type { CleaningClient, CleaningProperty } from '@/lib/types/cleanings';
import { ClientPropertiesSubList } from './ClientPropertiesSubList';

interface ClientsAccordionRowProps {
  client: CleaningClient;
  isExpanded: boolean;
  copiedCodeId: string | null;
  onToggleExpand: () => void;
  onCopyCode: (id: string, code: string, e: React.MouseEvent) => void;
  onBookCleaning: (client: CleaningClient, prop?: CleaningProperty) => void;
  onAddProperty: (client: CleaningClient) => void;
  onEditClient: (client: CleaningClient) => void;
  onDeleteClient: (id: string, name: string) => void;
  onEditProperty: (client: CleaningClient, prop: CleaningProperty) => void;
  onDeleteProperty: (propId: string, propName: string) => void;
}

export function ClientsAccordionRow({
  client,
  isExpanded,
  copiedCodeId,
  onToggleExpand,
  onCopyCode,
  onBookCleaning,
  onAddProperty,
  onEditClient,
  onDeleteClient,
  onEditProperty,
  onDeleteProperty,
}: ClientsAccordionRowProps) {
  const properties = client.properties || [];

  return (
    <div className="bg-white">
      <div
        onClick={onToggleExpand}
        className="px-4 sm:px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-warm-white/60 transition-colors cursor-pointer"
      >
        <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
          <ChevronDown
            className={`w-4 h-4 text-muted shrink-0 mt-1 sm:mt-0 transition-transform duration-150 ${
              isExpanded ? 'rotate-0 text-navy' : '-rotate-90'
            }`}
            strokeWidth={1.75}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-navy truncate">
                {client.name}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md border border-border bg-warm-white text-muted">
                {client.category === 'airbnb' ? 'Airbnb' : 'Ξενοδοχείο'}
              </span>
              <span className="text-xs text-muted tabular-nums">
                · {properties.length} {properties.length === 1 ? 'κατάλυμα' : 'καταλύματα'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-muted">
              <a
                href={`tel:${client.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 hover:text-teal-dark font-medium tabular-nums"
              >
                <Phone className="w-3 h-3" strokeWidth={1.75} />
                {client.phone}
              </a>
              {client.contact_person && <span>Υπεύθυνος: {client.contact_person}</span>}
              {client.email && <span className="truncate hidden sm:inline">{client.email}</span>}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0 pl-7 md:pl-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onBookCleaning(client)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal hover:bg-teal-dark text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>Κλείσιμο</span>
          </button>
          <button
            type="button"
            onClick={() => onAddProperty(client)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-white hover:bg-warm-white text-navy text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-teal-dark" strokeWidth={1.75} />
            <span className="hidden sm:inline">Κατάλυμα</span>
          </button>
          <button
            type="button"
            onClick={() => onEditClient(client)}
            title="Επεξεργασία Πελάτη"
            className="p-1.5 rounded-md text-muted hover:text-navy hover:bg-warm-white transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteClient(client.id, client.name)}
            title="Διαγραφή Πελάτη"
            className="p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <ClientPropertiesSubList
          client={client}
          properties={properties}
          copiedCodeId={copiedCodeId}
          onCopyCode={onCopyCode}
          onBookCleaning={onBookCleaning}
          onAddProperty={onAddProperty}
          onEditProperty={onEditProperty}
          onDeleteProperty={onDeleteProperty}
        />
      )}
    </div>
  );
}
