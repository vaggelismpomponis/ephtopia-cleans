'use client';

import type { CleaningClient, CleaningProperty } from '@/lib/types/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { ClientModal } from './ClientModal';
import { PropertyModal } from './PropertyModal';
import { CleaningModal } from './CleaningModal';

interface ClientsModalsProps {
  clients: CleaningClient[];
  categoryFilter: 'all' | 'airbnb' | 'hotel';
  isClientModalOpen: boolean;
  onCloseClientModal: () => void;
  onClientSaved: (saved: CleaningClient) => void;
  clientToEdit: CleaningClient | null;
  isPropertyModalOpen: boolean;
  onClosePropertyModal: () => void;
  onPropertySaved: (saved: CleaningProperty) => void;
  propertyClientId: string;
  propertyClientName: string;
  propertyToEdit: CleaningProperty | null;
  isCleaningModalOpen: boolean;
  onCloseCleaningModal: () => void;
  onCleaningSaved: () => void;
  preselectedClient: CleaningClient | null;
  preselectedProperty: CleaningProperty | null;
  clientToDelete: { id: string; name: string } | null;
  isDeletingClient: boolean;
  onConfirmDeleteClient: () => void;
  onCancelDeleteClient: () => void;
  propertyToDelete: { id: string; name: string } | null;
  isDeletingProperty: boolean;
  onConfirmDeleteProperty: () => void;
  onCancelDeleteProperty: () => void;
}

export function ClientsModals({
  clients,
  categoryFilter,
  isClientModalOpen,
  onCloseClientModal,
  onClientSaved,
  clientToEdit,
  isPropertyModalOpen,
  onClosePropertyModal,
  onPropertySaved,
  propertyClientId,
  propertyClientName,
  propertyToEdit,
  isCleaningModalOpen,
  onCloseCleaningModal,
  onCleaningSaved,
  preselectedClient,
  preselectedProperty,
  clientToDelete,
  isDeletingClient,
  onConfirmDeleteClient,
  onCancelDeleteClient,
  propertyToDelete,
  isDeletingProperty,
  onConfirmDeleteProperty,
  onCancelDeleteProperty,
}: ClientsModalsProps) {
  const defaultProp = preselectedProperty || preselectedClient?.properties?.[0];

  return (
    <>
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={onCloseClientModal}
        onSaved={onClientSaved}
        clientToEdit={clientToEdit}
        defaultCategory={categoryFilter === 'hotel' ? 'hotel' : 'airbnb'}
      />

      <PropertyModal
        isOpen={isPropertyModalOpen}
        onClose={onClosePropertyModal}
        onSaved={onPropertySaved}
        clientId={propertyClientId}
        clientName={propertyClientName}
        propertyToEdit={propertyToEdit}
      />

      <CleaningModal
        isOpen={isCleaningModalOpen}
        onClose={onCloseCleaningModal}
        onSaved={onCleaningSaved}
        defaultCategory={preselectedClient?.category || 'airbnb'}
        clients={clients}
        cleaningToEdit={
          preselectedClient
            ? {
              id: '',
              category: preselectedClient.category,
              client_id: preselectedClient.id,
              client_name: preselectedClient.name,
              client_phone: preselectedClient.phone,
              property_id: defaultProp?.id || '',
              property_name: defaultProp?.name || '',
              address: defaultProp?.address || '',
              area: defaultProp?.area || '',
              floor: defaultProp?.floor || '',
              access_code: defaultProp?.access_code || '',
              entry_instructions: defaultProp?.entry_instructions || '',
              cleaning_instructions: defaultProp?.cleaning_instructions || '',
              scheduled_date: new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' }),
              scheduled_time: '11:00 - 14:00',
              status: 'scheduled',
              priority: 'normal',
            }
            : null
        }
      />

      <ConfirmModal
        open={!!clientToDelete}
        title="Διαγραφή Πελάτη"
        description={`Είστε βέβαιοι ότι θέλετε να διαγράψετε οριστικά τον πελάτη "${clientToDelete?.name}"; Μαζί του θα διαγραφούν όλα τα καταχωρημένα καταλύματα και οι σχετικοί καθαρισμοί.`}
        confirmLabel="Διαγραφή Πελάτη"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingClient}
        onConfirm={onConfirmDeleteClient}
        onCancel={onCancelDeleteClient}
        variant="danger"
      />

      <ConfirmModal
        open={!!propertyToDelete}
        title="Διαγραφή Καταλύματος"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά το κατάλυμα "${propertyToDelete?.name}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
        confirmLabel="Διαγραφή Καταλύματος"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingProperty}
        onConfirm={onConfirmDeleteProperty}
        onCancel={onCancelDeleteProperty}
        variant="danger"
      />
    </>
  );
}

