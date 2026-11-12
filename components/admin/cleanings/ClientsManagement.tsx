'use client';

import { Users, Plus } from 'lucide-react';
import type { CleaningClient } from '@/lib/types/cleanings';
import { ClientsHeaderAndKpi } from './ClientsHeaderAndKpi';
import { ClientsToolbar } from './ClientsToolbar';
import { ClientsAccordionRow } from './ClientsAccordionRow';
import { ClientsModals } from './ClientsModals';
import { useClientsController } from './useClientsController';

interface ClientsManagementProps {
  initialClients: CleaningClient[];
}

export function ClientsManagement({ initialClients }: ClientsManagementProps) {
  const ctrl = useClientsController(initialClients);
  const hasSearch = ctrl.searchQuery.trim().length > 0;

  const openNewClient = () => {
    ctrl.setClientToEdit(null);
    ctrl.setIsClientModalOpen(true);
  };

  return (
    <div className="space-y-5 w-full max-w-full">
      <ClientsHeaderAndKpi
        stats={ctrl.stats}
        categoryFilter={ctrl.categoryFilter}
        onCategoryFilterChange={ctrl.setCategoryFilter}
        onOpenNewClient={openNewClient}
      />

      <ClientsToolbar
        categoryFilter={ctrl.categoryFilter}
        onCategoryFilterChange={ctrl.setCategoryFilter}
        searchQuery={ctrl.searchQuery}
        onSearchChange={ctrl.setSearchQuery}
        counts={{
          all: ctrl.clients.length,
          airbnb: ctrl.stats.airbnbClients,
          hotel: ctrl.stats.hotelClients,
          filtered: ctrl.filteredClients.length,
        }}
      />

      {ctrl.filteredClients.length > 0 ? (
        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border bg-white">
          {ctrl.filteredClients.map((client) => (
            <ClientsAccordionRow
              key={client.id}
              client={client}
              isExpanded={hasSearch || !!ctrl.expandedIds[client.id]}
              copiedCodeId={ctrl.copiedCodeId}
              onToggleExpand={() =>
                ctrl.setExpandedIds((prev) => ({ ...prev, [client.id]: !prev[client.id] }))
              }
              onCopyCode={ctrl.handleCopyCode}
              onBookCleaning={(c, prop) => {
                ctrl.setPreselectedClient(c);
                ctrl.setPreselectedProperty(prop || null);
                ctrl.setIsCleaningModalOpen(true);
              }}
              onAddProperty={(c) => {
                ctrl.setPropertyClientId(c.id);
                ctrl.setPropertyClientName(c.name);
                ctrl.setPropertyToEdit(null);
                ctrl.setIsPropertyModalOpen(true);
              }}
              onEditClient={(c) => {
                ctrl.setClientToEdit(c);
                ctrl.setIsClientModalOpen(true);
              }}
              onDeleteClient={(id, name) => ctrl.setClientToDelete({ id, name })}
              onEditProperty={(c, prop) => {
                ctrl.setPropertyClientId(c.id);
                ctrl.setPropertyClientName(c.name);
                ctrl.setPropertyToEdit(prop);
                ctrl.setIsPropertyModalOpen(true);
              }}
              onDeleteProperty={(id, name) => ctrl.setPropertyToDelete({ id, name })}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-border rounded-xl p-10 sm:p-12 text-center">
          <Users className="w-6 h-6 text-muted-light mx-auto mb-3" strokeWidth={1.75} />
          <h3 className="text-base font-bold text-navy font-heading mb-1">Δεν βρέθηκαν πελάτες</h3>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mb-5">
            Δεν υπάρχουν πελάτες που να ταιριάζουν με τα φίλτρα αναζήτησης.
          </p>
          <button
            type="button"
            onClick={openNewClient}
            className="inline-flex items-center gap-1.5 min-h-10 bg-teal hover:bg-teal-dark text-white font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            <span>Νέος Πελάτης</span>
          </button>
        </div>
      )}

      <ClientsModals
        clients={ctrl.clients}
        categoryFilter={ctrl.categoryFilter}
        isClientModalOpen={ctrl.isClientModalOpen}
        onCloseClientModal={() => ctrl.setIsClientModalOpen(false)}
        onClientSaved={(saved) => {
          ctrl.setClients((prev) =>
            prev.some((c) => c.id === saved.id)
              ? prev.map((c) => (c.id === saved.id ? { ...saved, properties: c.properties } : c))
              : [saved, ...prev]
          );
          ctrl.router.refresh();
        }}
        clientToEdit={ctrl.clientToEdit}
        isPropertyModalOpen={ctrl.isPropertyModalOpen}
        onClosePropertyModal={() => ctrl.setIsPropertyModalOpen(false)}
        onPropertySaved={(savedProp) => {
          ctrl.setClients((prev) =>
            prev.map((c) => {
              if (c.id !== savedProp.client_id) return c;
              const props = c.properties || [];
              const updatedProps = props.some((p) => p.id === savedProp.id)
                ? props.map((p) => (p.id === savedProp.id ? savedProp : p))
                : [...props, savedProp];
              return { ...c, properties: updatedProps };
            })
          );
          ctrl.setExpandedIds((prev) => ({ ...prev, [savedProp.client_id]: true }));
          ctrl.router.refresh();
        }}
        propertyClientId={ctrl.propertyClientId}
        propertyClientName={ctrl.propertyClientName}
        propertyToEdit={ctrl.propertyToEdit}
        isCleaningModalOpen={ctrl.isCleaningModalOpen}
        onCloseCleaningModal={() => {
          ctrl.setIsCleaningModalOpen(false);
          ctrl.setPreselectedClient(null);
          ctrl.setPreselectedProperty(null);
        }}
        onCleaningSaved={() => ctrl.router.refresh()}
        preselectedClient={ctrl.preselectedClient}
        preselectedProperty={ctrl.preselectedProperty}
        clientToDelete={ctrl.clientToDelete}
        isDeletingClient={ctrl.isDeletingClient}
        onConfirmDeleteClient={ctrl.handleConfirmDeleteClient}
        onCancelDeleteClient={() => ctrl.setClientToDelete(null)}
        propertyToDelete={ctrl.propertyToDelete}
        isDeletingProperty={ctrl.isDeletingProperty}
        onConfirmDeleteProperty={ctrl.handleConfirmDeleteProperty}
        onCancelDeleteProperty={() => ctrl.setPropertyToDelete(null)}
      />
    </div>
  );
}
