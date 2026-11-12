'use client';

import { useState } from 'react';
import type {
  CleaningRecord,
  CleaningCategory,
  CleaningClient,
  CleaningProperty,
  CleaningStatus,
  CleaningPriority,
} from '@/lib/types/cleanings';
import { saveCleaning } from '@/app/actions/cleanings';

export function useCleaningFormState({
  isOpen,
  cleaningToEdit,
  defaultCategory,
  clients,
  onSaved,
  onClose,
}: {
  isOpen: boolean;
  cleaningToEdit?: CleaningRecord | null;
  defaultCategory: CleaningCategory;
  clients: CleaningClient[];
  onSaved: (cleaning: CleaningRecord) => void;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<CleaningCategory>(cleaningToEdit?.category || defaultCategory);
  const [clientId, setClientId] = useState(cleaningToEdit?.client_id || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState(cleaningToEdit?.property_id || '');
  const [clientName, setClientName] = useState(cleaningToEdit?.client_name || '');
  const [clientPhone, setClientPhone] = useState(cleaningToEdit?.client_phone || '');
  const [propertyName, setPropertyName] = useState(cleaningToEdit?.property_name || '');
  const [address, setAddress] = useState(cleaningToEdit?.address || '');
  const [area, setArea] = useState(cleaningToEdit?.area || '');
  const [floor, setFloor] = useState(cleaningToEdit?.floor || '');
  const [accessCode, setAccessCode] = useState(cleaningToEdit?.access_code || '');
  const [entryInstructions, setEntryInstructions] = useState(cleaningToEdit?.entry_instructions || '');
  const [cleaningInstructions, setCleaningInstructions] = useState(cleaningToEdit?.cleaning_instructions || '');
  const [scheduledDate, setScheduledDate] = useState(
    cleaningToEdit?.scheduled_date || new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(cleaningToEdit?.scheduled_time || '11:00 - 14:00');
  const [status, setStatus] = useState<CleaningStatus>(cleaningToEdit?.status || 'scheduled');
  const [priority, setPriority] = useState<CleaningPriority>(cleaningToEdit?.priority || 'normal');
  const [cleanerName, setCleanerName] = useState(cleaningToEdit?.cleaner_name || '');
  const [driverName, setDriverName] = useState(cleaningToEdit?.driver_name || '');
  const [linenRequirements, setLinenRequirements] = useState(cleaningToEdit?.linen_requirements || '');
  const [specialNotes, setSpecialNotes] = useState(cleaningToEdit?.special_notes || '');
  const [price, setPrice] = useState(cleaningToEdit?.price != null ? String(cleaningToEdit.price) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalResetKey = `${isOpen}-${cleaningToEdit?.id ?? 'new'}-${defaultCategory}`;
  const [prevModalResetKey, setPrevModalResetKey] = useState(modalResetKey);

  if (prevModalResetKey !== modalResetKey) {
    setPrevModalResetKey(modalResetKey);
    const e = cleaningToEdit;
    setCategory(e?.category || defaultCategory);
    setClientId(e?.client_id || '');
    setSelectedPropertyId(e?.property_id || '');
    setClientName(e?.client_name || '');
    setClientPhone(e?.client_phone || '');
    setPropertyName(e?.property_name || '');
    setAddress(e?.address || '');
    setArea(e?.area || '');
    setFloor(e?.floor || '');
    setAccessCode(e?.access_code || '');
    setEntryInstructions(e?.entry_instructions || '');
    setCleaningInstructions(e?.cleaning_instructions || '');
    setScheduledDate(e?.scheduled_date || new Date().toISOString().split('T')[0]);
    setScheduledTime(e?.scheduled_time || '11:00 - 14:00');
    setStatus(e?.status || 'scheduled');
    setPriority(e?.priority || 'normal');
    setCleanerName(e?.cleaner_name || '');
    setDriverName(e?.driver_name || '');
    setLinenRequirements(e?.linen_requirements || '');
    setSpecialNotes(e?.special_notes || '');
    setPrice(e?.price != null ? String(e.price) : '');
    setError(null);
  }

  const applyProperty = (prop: CleaningProperty) => {
    setSelectedPropertyId(prop.id);
    setPropertyName(prop.name);
    setAddress(prop.address);
    setArea(prop.area || '');
    setFloor(prop.floor || '');
    setAccessCode(prop.access_code || '');
    setEntryInstructions(prop.entry_instructions || '');
    setCleaningInstructions(prop.cleaning_instructions || '');
  };

  const handleClientSelect = (id: string) => {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (!client) {
      setSelectedPropertyId('');
      return;
    }
    setClientName(client.name);
    setClientPhone(client.phone);
    if (client.properties?.length) applyProperty(client.properties[0]);
    else setSelectedPropertyId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await saveCleaning({
        id: cleaningToEdit?.id,
        category,
        client_id: clientId || null,
        property_id: selectedPropertyId || null,
        client_name: clientName || 'Πελάτης',
        client_phone: clientPhone,
        property_name: propertyName,
        address,
        area,
        floor,
        access_code: accessCode,
        entry_instructions: entryInstructions,
        cleaning_instructions: cleaningInstructions,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        status,
        priority,
        cleaner_name: cleanerName,
        driver_name: driverName,
        linen_requirements: linenRequirements,
        special_notes: specialNotes,
        price: price ? parseFloat(price) : null,
      });
      if (result.success && result.data) {
        onSaved(result.data);
        onClose();
      } else {
        setError(result.error || 'Σφάλμα κατά την αποθήκευση');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Απροσδόκητο σφάλμα');
    } finally {
      setLoading(false);
    }
  };

  return {
    category, setCategory, clientId, setClientId, selectedPropertyId, setSelectedPropertyId,
    clientName, setClientName, clientPhone, setClientPhone, propertyName, setPropertyName,
    address, setAddress, area, setArea, floor, setFloor, accessCode, setAccessCode,
    entryInstructions, setEntryInstructions, cleaningInstructions, setCleaningInstructions,
    scheduledDate, setScheduledDate, scheduledTime, setScheduledTime, status, setStatus,
    priority, setPriority, cleanerName, setCleanerName, driverName, setDriverName,
    linenRequirements, setLinenRequirements, specialNotes, setSpecialNotes, price, setPrice,
    loading, error, applyProperty, handleClientSelect, handleSubmit,
  };
}

