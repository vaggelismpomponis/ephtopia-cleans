'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { CleaningClient, CleaningProperty } from '@/lib/types/cleanings';
import { deleteClient, deleteProperty } from '@/app/actions/cleanings';

export function useClientsController(initialClients: CleaningClient[]) {
  const router = useRouter();
  const [clients, setClients] = useState<CleaningClient[]>(initialClients);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'airbnb' | 'hotel'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<CleaningClient | null>(null);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyClientId, setPropertyClientId] = useState('');
  const [propertyClientName, setPropertyClientName] = useState('');
  const [propertyToEdit, setPropertyToEdit] = useState<CleaningProperty | null>(null);
  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [preselectedClient, setPreselectedClient] = useState<CleaningClient | null>(null);
  const [preselectedProperty, setPreselectedProperty] = useState<CleaningProperty | null>(null);
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return clients.filter((c) => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (!q) return true;
      const clientMatch = [c.name, c.contact_person, c.phone, c.email].some((v) =>
        v?.toLowerCase().includes(q)
      );
      const propMatch = c.properties?.some((p) =>
        [p.name, p.address, p.access_code].some((v) => v?.toLowerCase().includes(q))
      );
      return clientMatch || propMatch;
    });
  }, [clients, categoryFilter, searchQuery]);

  const stats = useMemo(
    () => ({
      totalClients: clients.length,
      totalProperties: clients.reduce((acc, c) => acc + (c.properties?.length || 0), 0),
      airbnbClients: clients.filter((c) => c.category === 'airbnb').length,
      hotelClients: clients.filter((c) => c.category === 'hotel').length,
    }),
    [clients]
  );

  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleConfirmDeleteClient = async () => {
    if (!clientToDelete) return;
    setIsDeletingClient(true);
    const res = await deleteClient(clientToDelete.id);
    if (res.success) {
      setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
      setClientToDelete(null);
      router.refresh();
    } else {
      alert('Σφάλμα: ' + res.error);
    }
    setIsDeletingClient(false);
  };

  const handleConfirmDeleteProperty = async () => {
    if (!propertyToDelete) return;
    setIsDeletingProperty(true);
    const res = await deleteProperty(propertyToDelete.id);
    if (res.success) {
      setClients((prev) =>
        prev.map((c) => ({
          ...c,
          properties: c.properties?.filter((p) => p.id !== propertyToDelete.id) || [],
        }))
      );
      setPropertyToDelete(null);
      router.refresh();
    } else {
      alert('Σφάλμα: ' + res.error);
    }
    setIsDeletingProperty(false);
  };

  return {
    router,
    clients,
    setClients,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    expandedIds,
    setExpandedIds,
    copiedCodeId,
    filteredClients,
    stats,
    isClientModalOpen,
    setIsClientModalOpen,
    clientToEdit,
    setClientToEdit,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    propertyClientId,
    setPropertyClientId,
    propertyClientName,
    setPropertyClientName,
    propertyToEdit,
    setPropertyToEdit,
    isCleaningModalOpen,
    setIsCleaningModalOpen,
    preselectedClient,
    setPreselectedClient,
    preselectedProperty,
    setPreselectedProperty,
    clientToDelete,
    setClientToDelete,
    propertyToDelete,
    setPropertyToDelete,
    isDeletingClient,
    isDeletingProperty,
    handleCopyCode,
    handleConfirmDeleteClient,
    handleConfirmDeleteProperty,
  };
}

