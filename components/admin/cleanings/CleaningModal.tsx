'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Clock,
  User,
  MapPin,
  Key,
  Truck,
  Sparkles,
  AlertTriangle,
  Building,
  Home,
  CheckCircle2,
  Loader2,
  Plus,
  Minus,
  Layers,
  Euro,
  FileText,
} from 'lucide-react';
import type {
  CleaningRecord,
  CleaningCategory,
  CleaningClient,
  CleaningProperty,
  CleaningStatus,
  CleaningPriority,
} from '@/lib/types/cleanings';
import {
  QUICK_CLEANING_HOURS,
  ALL_CLEANING_HOURS_OPTIONS,
} from '@/lib/types/cleanings';
import { saveCleaning } from '@/app/actions/cleanings';
import { CustomSelect } from './CustomSelect';

interface CleaningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cleaning: CleaningRecord) => void;
  cleaningToEdit?: CleaningRecord | null;
  defaultCategory?: CleaningCategory;
  clients: CleaningClient[];
}

export function CleaningModal({
  isOpen,
  onClose,
  onSaved,
  cleaningToEdit,
  defaultCategory = 'airbnb',
  clients,
}: CleaningModalProps) {
  const [category, setCategory] = useState<CleaningCategory>(
    cleaningToEdit?.category || defaultCategory
  );
  const [clientId, setClientId] = useState<string>(cleaningToEdit?.client_id || '');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    cleaningToEdit?.property_id || ''
  );

  // Form Fields
  const [clientName, setClientName] = useState(cleaningToEdit?.client_name || '');
  const [clientPhone, setClientPhone] = useState(cleaningToEdit?.client_phone || '');
  const [propertyName, setPropertyName] = useState(cleaningToEdit?.property_name || '');
  const [address, setAddress] = useState(cleaningToEdit?.address || '');
  const [area, setArea] = useState(cleaningToEdit?.area || '');
  const [floor, setFloor] = useState(cleaningToEdit?.floor || '');
  const [accessCode, setAccessCode] = useState(cleaningToEdit?.access_code || '');
  const [entryInstructions, setEntryInstructions] = useState(
    cleaningToEdit?.entry_instructions || ''
  );
  const [cleaningInstructions, setCleaningInstructions] = useState(
    cleaningToEdit?.cleaning_instructions || ''
  );

  // Operational fields
  const [scheduledDate, setScheduledDate] = useState(
    cleaningToEdit?.scheduled_date || new Date().toISOString().split('T')[0]
  );
  const [scheduledTime, setScheduledTime] = useState(
    cleaningToEdit?.scheduled_time || '11:00 - 14:00'
  );
  const [status, setStatus] = useState<CleaningStatus>(
    cleaningToEdit?.status || 'scheduled'
  );
  const [priority, setPriority] = useState<CleaningPriority>(
    cleaningToEdit?.priority || 'normal'
  );
  const [cleanerName, setCleanerName] = useState(cleaningToEdit?.cleaner_name || '');
  const [driverName, setDriverName] = useState(cleaningToEdit?.driver_name || '');
  const [linenRequirements, setLinenRequirements] = useState(
    cleaningToEdit?.linen_requirements || ''
  );
  const [specialNotes, setSpecialNotes] = useState(cleaningToEdit?.special_notes || '');
  const [price, setPrice] = useState<string>(
    cleaningToEdit?.price != null ? String(cleaningToEdit.price) : ''
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter clients by category
  const categoryClients = clients.filter((c) => c.category === category);
  const selectedClient = clients.find((c) => c.id === clientId);

  // Pre-fill or reset state
  useEffect(() => {
    if (cleaningToEdit) {
      setCategory(cleaningToEdit.category);
      setClientId(cleaningToEdit.client_id || '');
      setSelectedPropertyId(cleaningToEdit.property_id || '');
      setClientName(cleaningToEdit.client_name);
      setClientPhone(cleaningToEdit.client_phone || '');
      setPropertyName(cleaningToEdit.property_name);
      setAddress(cleaningToEdit.address);
      setArea(cleaningToEdit.area || '');
      setFloor(cleaningToEdit.floor || '');
      setAccessCode(cleaningToEdit.access_code || '');
      setEntryInstructions(cleaningToEdit.entry_instructions || '');
      setCleaningInstructions(cleaningToEdit.cleaning_instructions || '');
      setScheduledDate(cleaningToEdit.scheduled_date);
      setScheduledTime(cleaningToEdit.scheduled_time || '11:00 - 14:00');
      setStatus(cleaningToEdit.status);
      setPriority(cleaningToEdit.priority);
      setCleanerName(cleaningToEdit.cleaner_name || '');
      setDriverName(cleaningToEdit.driver_name || '');
      setLinenRequirements(cleaningToEdit.linen_requirements || '');
      setSpecialNotes(cleaningToEdit.special_notes || '');
      setPrice(cleaningToEdit.price != null ? String(cleaningToEdit.price) : '');
    } else {
      setCategory(defaultCategory);
      setClientId('');
      setSelectedPropertyId('');
      setClientName('');
      setClientPhone('');
      setPropertyName('');
      setAddress('');
      setArea('');
      setFloor('');
      setAccessCode('');
      setEntryInstructions('');
      setCleaningInstructions('');
      setScheduledDate(new Date().toISOString().split('T')[0]);
      setScheduledTime('11:00 - 14:00');
      setStatus('scheduled');
      setPriority('normal');
      setCleanerName('');
      setDriverName('');
      setLinenRequirements('');
      setSpecialNotes('');
      setPrice('');
    }
  }, [cleaningToEdit, defaultCategory, isOpen]);

  // Handle client selection
  const handleClientSelect = (id: string) => {
    setClientId(id);
    const client = clients.find((c) => c.id === id);
    if (client) {
      setClientName(client.name);
      setClientPhone(client.phone);

      // Default to first property if exists
      if (client.properties && client.properties.length > 0) {
        applyProperty(client.properties[0]);
      } else {
        setSelectedPropertyId('');
      }
    } else {
      setSelectedPropertyId('');
    }
  };

  // Apply property details to form
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

  // Quick preset helper
  const addLinenPreset = (text: string) => {
    setLinenRequirements((prev) => (prev ? `${prev}, ${text}` : text));
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal/20 text-teal flex items-center justify-center border border-teal/20 shadow-xs">
                {category === 'airbnb' ? <Home className="w-5 h-5" /> : <Building className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg font-heading tracking-tight">
                  {cleaningToEdit ? 'Επεξεργασία Καθαρισμού' : 'Προγραμματισμός Νέου Καθαρισμού'}
                </h2>
                <p className="text-xs text-slate-400">
                  {category === 'airbnb' ? 'Κατάλυμα Airbnb / Βραχυχρόνια Μίσθωση' : 'Ξενοδοχειακή Μονάδα / Housekeeping'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Category Segment Selector (if creating new) */}
            {!cleaningToEdit && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Τύπος Καταλύματος
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('airbnb');
                      setClientId('');
                      setSelectedPropertyId('');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      category === 'airbnb'
                        ? 'bg-teal/10 border-teal text-teal shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Airbnb / Κατάλυμα</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCategory('hotel');
                      setClientId('');
                      setSelectedPropertyId('');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      category === 'hotel'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Ξενοδοχείο / Μονάδα</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1. Client & Property Selection Box */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal" />
                  <span>Επιλογή Πελάτη & Αυτόματη Συμπλήρωση</span>
                </label>
                <span className="text-[11px] text-slate-400">Από τη βάση δεδομένων</span>
              </div>

              <div>
                <CustomSelect
                  value={clientId}
                  onChange={handleClientSelect}
                  searchable
                  searchPlaceholder="Αναζήτηση πελάτη με όνομα..."
                  placeholder="-- Επιλέξτε πελάτη από τη λίστα (ή ελεύθερη εισαγωγή) --"
                  options={[
                    { value: '', label: '-- Ελεύθερη Εισαγωγή (Χωρίς επιλογή πελάτη) --' },
                    ...categoryClients.map((c) => ({
                      value: c.id,
                      label: c.name,
                      description: c.phone ? `Τηλ: ${c.phone}` : undefined,
                      badge: `${c.properties?.length || 0} ακίνητα`,
                    })),
                  ]}
                />
              </div>

              {/* Saved Properties Pill Selector */}
              {selectedClient && selectedClient.properties && selectedClient.properties.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-slate-600">
                    Επιλέξτε Κατάλυμα Πελάτη:
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {selectedClient.properties.map((prop) => {
                      const isSelected = selectedPropertyId === prop.id;
                      return (
                        <button
                          key={prop.id}
                          type="button"
                          onClick={() => applyProperty(prop)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-teal/10 border-teal shadow-2xs text-teal-dark ring-2 ring-teal/20'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-xs text-slate-900">{prop.name}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800">
                              {prop.floor || 'Ισόγειο'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{prop.address}</div>
                          {prop.access_code && (
                            <div className="text-[10px] font-mono text-amber-800 mt-1 font-bold">
                              PIN: {prop.access_code}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Property Information */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Στοιχεία Καταλύματος & Τοποθεσίας
              </h3>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Όνομα Καταλύματος / Μονάδας *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="π.χ. Acropolis Penthouse Suite"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Όνομα Πελάτη / Υπεύθυνου *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="π.χ. Γιώργος Παπαδόπουλος"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Διεύθυνση (Οδός & Αριθμός) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="π.χ. Μητροπόλεως 42"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Όροφος / Διαμέρισμα *
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="π.χ. 3ος (Διαμ. 302)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Περιοχή / Πόλη
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="π.χ. Σύνταγμα, Αθήνα"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Τηλέφωνο Επικοινωνίας
                  </label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="π.χ. 6941234567"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              {/* HIGHLIGHTED ACCESS / CODE BOX */}
              <div className="bg-amber-50/70 border-2 border-amber-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4 text-amber-700" />
                  <span>Κωδικός & Οδηγίες Πρόσβασης (Εκτυπώνεται στο Δελτίο)</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Κωδικός Εισόδου / Lockbox / PIN
                    </label>
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="π.χ. Lockbox 4821# ή Κλειδί στη ρεσεψιόν"
                      className="w-full bg-white border border-amber-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-extrabold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Οδηγίες Εισόδου για Οδηγό & Καθαρίστρια
                    </label>
                    <input
                      type="text"
                      value={entryInstructions}
                      onChange={(e) => setEntryInstructions(e.target.value)}
                      placeholder="π.χ. Κουδούνι Ephtopia, το κουτί είναι δεξιά από το ασανσέρ"
                      className="w-full bg-white border border-amber-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Schedule, Team & Timing */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Προγραμματισμός & Ομάδα
              </h3>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ημερομηνία *
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal cursor-pointer"
                  />
                  <div className="flex gap-2 mt-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setScheduledDate(new Date().toISOString().split('T')[0])}
                      className="text-teal hover:underline font-bold cursor-pointer"
                    >
                      Σήμερα
                    </button>
                    <span className="text-slate-300">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        setScheduledDate(d.toISOString().split('T')[0]);
                      }}
                      className="text-teal hover:underline font-bold cursor-pointer"
                    >
                      Αύριο
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ώρα / Χρονικό Παράθυρο
                  </label>
                  <input
                    type="text"
                    list="cleaning-hours-presets"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    placeholder="π.χ. 10:30 - 14:00"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                  <datalist id="cleaning-hours-presets">
                    {ALL_CLEANING_HOURS_OPTIONS.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {QUICK_CLEANING_HOURS.map((t) => {
                      const isSelected =
                        scheduledTime.trim() === t ||
                        scheduledTime.replace(/\s+/g, '') === t.replace(/\s+/g, '');
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setScheduledTime(t)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                            isSelected
                              ? 'bg-teal text-white border-teal font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Προτεραιότητα
                  </label>
                  <CustomSelect
                    value={priority}
                    onChange={(val) => setPriority(val as CleaningPriority)}
                    options={[
                      { value: 'normal', label: 'Κανονική', colorDot: 'bg-slate-400' },
                      { value: 'high', label: 'Υψηλή', colorDot: 'bg-amber-500' },
                      { value: 'urgent', label: 'Επείγον!', colorDot: 'bg-rose-500' },
                    ]}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Καθαρίστρια / Συνεργείο
                  </label>
                  <input
                    type="text"
                    value={cleanerName}
                    onChange={(e) => setCleanerName(e.target.value)}
                    placeholder="π.χ. Ελένη Μ."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Οδηγός Μεταφοράς / Βαν
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    placeholder="π.χ. Κώστας (Βαν 1)"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Κατάσταση Καθαρισμού
                  </label>
                  <CustomSelect
                    value={status}
                    onChange={(val) => setStatus(val as CleaningStatus)}
                    options={[
                      { value: 'scheduled', label: 'Προγραμματισμένος', colorDot: 'bg-blue-500', description: 'Αναμονή ανάθεσης ή ώρας' },
                      { value: 'in_progress', label: 'Σε εξέλιξη', colorDot: 'bg-amber-500', description: 'Συνεργείο ενεργό στον χώρο' },
                      { value: 'completed', label: 'Ολοκληρώθηκε', colorDot: 'bg-emerald-500', description: 'Έτοιμο για check-in' },
                      { value: 'cancelled', label: 'Ακυρώθηκε', colorDot: 'bg-slate-400', description: 'Ακύρωση καθαρισμού' },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Χρέωση / Τιμή (€)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="π.χ. 45.00"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                  />
                </div>
              </div>
            </div>

            {/* 4. Linen & Specific Instructions */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ιματισμός & Ειδικές Οδηγίες
              </h3>

              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Ανάγκες σε Λευκά Είδη (Οδηγός & Καθαρίστρια)
                  </label>
                  <div className="flex gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => addLinenPreset('2 Διπλά σεντόνια')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-semibold"
                    >
                      +2 Διπλά
                    </button>
                    <button
                      type="button"
                      onClick={() => addLinenPreset('4 Πετσέτες σώματος')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-semibold"
                    >
                      +4 Πετσέτες
                    </button>
                    <button
                      type="button"
                      onClick={() => addLinenPreset('2 Πατάκια μπάνιου')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer font-semibold"
                    >
                      +2 Πατάκια
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={linenRequirements}
                  onChange={(e) => setLinenRequirements(e.target.value)}
                  placeholder="π.χ. 2 Διπλά σεντόνια, 4 Πετσέτες μπάνιου, 2 Πετσέτες προσώπου, 1 Πατάκι"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Οδηγίες Καθαρισμού Καταλύματος
                </label>
                <textarea
                  rows={2}
                  value={cleaningInstructions}
                  onChange={(e) => setCleaningInstructions(e.target.value)}
                  placeholder="π.χ. Αλλαγή όλων των κρεβατιών, ιδιαίτερη προσοχή στα τζάμια και στο μπάνιο..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Εσωτερικές Σημειώσεις / Check-in Ώρα
                </label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="π.χ. Check-in νέου επισκέπτη στις 15:00! Παρακαλώ να έχει τελειώσει στις 14:00."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal"
                />
              </div>
            </div>

            {/* Sticky/Fixed Bottom Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Ακύρωση
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Αποθήκευση...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{cleaningToEdit ? 'Ενημέρωση Καθαρισμού' : 'Καταχώρηση Καθαρισμού'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
