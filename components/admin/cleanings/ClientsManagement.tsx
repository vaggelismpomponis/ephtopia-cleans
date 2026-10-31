'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Building,
  Home,
  Phone,
  Mail,
  MapPin,
  Key,
  Layers,
  Sparkles,
  Pencil,
  Trash2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Building2,
  CalendarCheck,
  Briefcase,
} from 'lucide-react';
import type {
  CleaningClient,
  CleaningProperty,
  CleaningRecord,
  CleaningCategory,
} from '@/lib/types/cleanings';
import { deleteClient, deleteProperty } from '@/app/actions/cleanings';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { ClientModal } from './ClientModal';
import { PropertyModal } from './PropertyModal';
import { CleaningModal } from './CleaningModal';

interface ClientsManagementProps {
  initialClients: CleaningClient[];
}

export function ClientsManagement({ initialClients }: ClientsManagementProps) {
  const router = useRouter();
  const [clients, setClients] = useState<CleaningClient[]>(initialClients);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'airbnb' | 'hotel'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Copy code feedback
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Modals state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<CleaningClient | null>(null);

  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyClientId, setPropertyClientId] = useState<string>('');
  const [propertyClientName, setPropertyClientName] = useState<string>('');
  const [propertyToEdit, setPropertyToEdit] = useState<CleaningProperty | null>(null);

  const [isCleaningModalOpen, setIsCleaningModalOpen] = useState(false);
  const [preselectedClient, setPreselectedClient] = useState<CleaningClient | null>(null);
  const [preselectedProperty, setPreselectedProperty] = useState<CleaningProperty | null>(null);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesContact = c.contact_person?.toLowerCase().includes(q);
        const matchesPhone = c.phone.toLowerCase().includes(q);
        const matchesEmail = c.email?.toLowerCase().includes(q);
        const matchesProp = c.properties?.some(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q) ||
            p.access_code?.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesContact && !matchesPhone && !matchesEmail && !matchesProp) {
          return false;
        }
      }

      return true;
    });
  }, [clients, categoryFilter, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalProperties = clients.reduce((acc, c) => acc + (c.properties?.length || 0), 0);
    const airbnbClients = clients.filter((c) => c.category === 'airbnb').length;
    const hotelClients = clients.filter((c) => c.category === 'hotel').length;
    const totalCleaningsCount = clients.reduce((acc, c) => acc + (c.total_cleanings || 0), 0);

    return {
      totalClients: clients.length,
      totalProperties,
      airbnbClients,
      hotelClients,
      totalCleaningsCount,
    };
  }, [clients]);

  // Copy code handler
  const handleCopyCode = (id: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Client handlers
  const handleOpenNewClient = () => {
    setClientToEdit(null);
    setIsClientModalOpen(true);
  };

  const handleEditClient = (c: CleaningClient) => {
    setClientToEdit(c);
    setIsClientModalOpen(true);
  };

  const handleClientSaved = (saved: CleaningClient) => {
    setClients((prev) => {
      const idx = prev.findIndex((c) => c.id === saved.id);
      if (idx !== -1) {
        return prev.map((c) => (c.id === saved.id ? { ...saved, properties: c.properties } : c));
      }
      return [saved, ...prev];
    });
    router.refresh();
  };

  // Deletion confirmation states
  const [clientToDelete, setClientToDelete] = useState<{ id: string; name: string } | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeletingClient, setIsDeletingClient] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);

  const handleDeleteClient = (id: string, name: string) => {
    setClientToDelete({ id, name });
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

  // Property handlers
  const handleOpenAddProperty = (client: CleaningClient) => {
    setPropertyClientId(client.id);
    setPropertyClientName(client.name);
    setPropertyToEdit(null);
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (client: CleaningClient, prop: CleaningProperty) => {
    setPropertyClientId(client.id);
    setPropertyClientName(client.name);
    setPropertyToEdit(prop);
    setIsPropertyModalOpen(true);
  };

  const handlePropertySaved = (savedProp: CleaningProperty) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === savedProp.client_id) {
          const props = c.properties || [];
          const exists = props.some((p) => p.id === savedProp.id);
          const updatedProps = exists
            ? props.map((p) => (p.id === savedProp.id ? savedProp : p))
            : [...props, savedProp];
          return { ...c, properties: updatedProps };
        }
        return c;
      })
    );
    router.refresh();
  };

  const handleDeleteProperty = (propId: string, propName: string) => {
    setPropertyToDelete({ id: propId, name: propName });
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

  // Quick book cleaning for this client and optional property
  const handleBookCleaningForClient = (client: CleaningClient, prop?: CleaningProperty) => {
    setPreselectedClient(client);
    setPreselectedProperty(prop || null);
    setIsCleaningModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full">
      {/* ── TOP EXECUTIVE NAVIGATION BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Title & Segment Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 text-purple-700 border border-purple-500/20 flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading tracking-tight truncate">
                  Βάση Πελατών & Καταλυμάτων
                </h1>
                <span className="hidden sm:inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {stats.totalClients} Ενεργοί Πελάτες
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                Διαχείριση στοιχείων οικοδεσποτών Airbnb, ξενοδοχείων, κωδικών πρόσβασης & οδηγιών
              </p>
            </div>
          </div>

          {/* Quick Segment Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 self-start sm:self-auto shrink-0">
            <Link
              href="/admin/cleanings/airbnb"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Airbnb</span>
            </Link>

            <Link
              href="/admin/cleanings/hotels"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 transition-all"
            >
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Ξενοδοχεία</span>
            </Link>

            <Link
              href="/admin/cleanings/clients"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 shadow-xs border border-slate-200/60 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Πελατολόγιο</span>
            </Link>
          </div>
        </div>

        {/* Action Button: New Client */}
        <button
          type="button"
          onClick={handleOpenNewClient}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer self-stretch sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Νέος Πελάτης</span>
        </button>
      </div>

      {/* ── KPI METRICS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setCategoryFilter('all')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            categoryFilter === 'all' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Συνολικοί Πελάτες
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            {stats.totalClients}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Στη βάση δεδομένων</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Καταλύματα & Δωμάτια
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal font-heading">
            {stats.totalProperties}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Καταχωρημένες μονάδες</p>
        </div>

        <div
          onClick={() => setCategoryFilter(categoryFilter === 'airbnb' ? 'all' : 'airbnb')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            categoryFilter === 'airbnb' ? 'border-teal ring-2 ring-teal/20 bg-teal/5' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Airbnb Hosts
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
              <Home className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-heading">
            {stats.airbnbClients}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ιδιοκτήτες & Managers</p>
        </div>

        <div
          onClick={() => setCategoryFilter(categoryFilter === 'hotel' ? 'all' : 'hotel')}
          className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-xs transition-all cursor-pointer hover:shadow-md ${
            categoryFilter === 'hotel' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Ξενοδοχεία
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-heading">
            {stats.hotelClients}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ξενοδοχειακές μονάδες</p>
        </div>
      </div>

      {/* ── FILTER & SEARCH BAR ── */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Όλοι οι Πελάτες ({clients.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('airbnb')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'airbnb'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-teal" />
              <span>Airbnb ({stats.airbnbClients})</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('hotel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                categoryFilter === 'hotel'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Ξενοδοχεία ({stats.hotelClients})</span>
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-400">
            Εμφανίζονται {filteredClients.length} από {clients.length} πελάτες
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση πελάτη με όνομα, τηλέφωνο, email, κατάλυμα, διεύθυνση ή κωδικό lockbox..."
            className="w-full bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/10 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── CLIENTS CARDS LIST ── */}
      {filteredClients.length > 0 ? (
        <div className="space-y-5">
          {filteredClients.map((client) => {
            const isAirbnb = client.category === 'airbnb';

            return (
              <div
                key={client.id}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden hover:border-slate-300 transition-all"
              >
                {/* 1. Client Card Header Bar */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/80 via-white to-white">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 font-extrabold text-base shadow-xs ${
                        isAirbnb
                          ? 'bg-gradient-to-br from-teal/20 to-teal/10 text-teal border border-teal/20'
                          : 'bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-700 border border-blue-500/20'
                      }`}
                    >
                      {client.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-extrabold text-base sm:text-lg text-slate-900 font-heading tracking-tight truncate">
                          {client.name}
                        </h2>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase border ${
                            isAirbnb
                              ? 'bg-teal/10 text-teal border-teal/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {isAirbnb ? 'Airbnb Host' : 'Ξενοδοχείο'}
                        </span>
                        {client.total_cleanings != null && client.total_cleanings > 0 && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                            {client.total_cleanings} καθαρισμοί
                          </span>
                        )}
                      </div>

                      {client.contact_person && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          Υπεύθυνος: <strong className="text-slate-800">{client.contact_person}</strong>
                        </div>
                      )}

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                        <a
                          href={`tel:${client.phone}`}
                          className="flex items-center gap-1.5 text-slate-700 hover:text-teal font-semibold transition-colors bg-slate-100 hover:bg-slate-200/70 px-2.5 py-1 rounded-lg"
                        >
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.phone}</span>
                        </a>

                        {client.email && (
                          <a
                            href={`mailto:${client.email}`}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-teal transition-colors bg-slate-100 hover:bg-slate-200/70 px-2.5 py-1 rounded-lg"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{client.email}</span>
                          </a>
                        )}

                        {client.notes && (
                          <span className="text-slate-400 text-xs italic truncate max-w-[280px]">
                            {client.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Client Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleBookCleaningForClient(client)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Κλείσιμο Καθαρισμού</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenAddProperty(client)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-teal" />
                      <span>+ Κατάλυμα</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEditClient(client)}
                      className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title="Επεξεργασία Πελάτη"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClient(client.id, client.name)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Διαγραφή Πελάτη"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Client Properties Grid */}
                <div className="p-4 sm:p-5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3.5 flex items-center justify-between">
                    <span>
                      Καταχωρημένα Καταλύματα & Μονάδες ({client.properties?.length || 0})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenAddProperty(client)}
                      className="text-teal hover:text-teal-dark font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Προσθήκη νέου καταλύματος</span>
                    </button>
                  </div>

                  {client.properties && client.properties.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {client.properties.map((prop) => {
                        const isCopied = copiedCodeId === prop.id;

                        return (
                          <div
                            key={prop.id}
                            className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:bg-white transition-all flex flex-col justify-between group/prop shadow-2xs"
                          >
                            <div>
                              {/* Prop Header: Name & Floor */}
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 group-hover/prop:text-teal transition-colors font-heading">
                                  {prop.name}
                                </h3>
                                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                                  {prop.floor || 'Ισόγειο'}
                                </span>
                              </div>

                              {/* Address with Google Maps */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {prop.address} {prop.area ? `· ${prop.area}` : ''}
                                </span>
                                <a
                                  href={`https://maps.google.com/?q=${encodeURIComponent(prop.address + (prop.area ? `, ${prop.area}` : ''))}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-teal hover:underline shrink-0 text-[10px] font-bold"
                                  title="Χάρτης"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>

                              {/* Lockbox Code Box with Copy */}
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs mb-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 min-w-0">
                                  <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span className="truncate">{prop.access_code || 'Χωρίς κωδικό / Ρεσεψιόν'}</span>
                                </div>
                                {prop.access_code && (
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyCode(prop.id, prop.access_code || '', e)}
                                    className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-2xs cursor-pointer transition-colors"
                                  >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                  </button>
                                )}
                              </div>

                              {/* Entry instructions preview */}
                              {prop.entry_instructions && (
                                <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 italic">
                                  «{prop.entry_instructions}»
                                </p>
                              )}
                            </div>

                            {/* Prop Action Bar */}
                            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/70 mt-2 text-xs">
                              <button
                                type="button"
                                onClick={() => handleBookCleaningForClient(client, prop)}
                                className="font-bold text-teal hover:text-teal-dark flex items-center gap-1 cursor-pointer"
                              >
                                <CalendarCheck className="w-3.5 h-3.5" />
                                <span>Κλείσιμο</span>
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditProperty(client, prop)}
                                  className="text-slate-500 hover:text-slate-800 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
                                >
                                  Επεξεργασία
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProperty(prop.id, prop.name)}
                                  className="text-rose-500 hover:text-rose-700 font-semibold px-1.5 py-0.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  Διαγραφή
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                      Δεν έχουν καταχωρηθεί ακόμη καταλύματα για αυτόν τον πελάτη.{' '}
                      <button
                        type="button"
                        onClick={() => handleOpenAddProperty(client)}
                        className="text-teal font-bold hover:underline cursor-pointer"
                      >
                        Προσθέστε το πρώτο κατάλυμα
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── EMPTY STATE ── */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-10 sm:p-16 text-center shadow-xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-purple-700">
            <Users className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading mb-1">
            Δεν βρέθηκαν πελάτες
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
            Δεν υπάρχουν πελάτες που να ταιριάζουν με την αναζήτηση ή δεν έχετε καταχωρήσει ακόμη πελάτες στη βάση.
          </p>
          <button
            type="button"
            onClick={handleOpenNewClient}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal-dark hover:from-teal-dark hover:to-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Προσθήκη Πρώτου Πελάτη</span>
          </button>
        </div>
      )}

      {/* ── MODALS ── */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSaved={handleClientSaved}
        clientToEdit={clientToEdit}
        defaultCategory={categoryFilter === 'hotel' ? 'hotel' : 'airbnb'}
      />

      <PropertyModal
        isOpen={isPropertyModalOpen}
        onClose={() => setIsPropertyModalOpen(false)}
        onSaved={handlePropertySaved}
        clientId={propertyClientId}
        clientName={propertyClientName}
        propertyToEdit={propertyToEdit}
      />

      <CleaningModal
        isOpen={isCleaningModalOpen}
        onClose={() => {
          setIsCleaningModalOpen(false);
          setPreselectedClient(null);
          setPreselectedProperty(null);
        }}
        onSaved={() => {
          router.refresh();
        }}
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
                property_id: preselectedProperty?.id || preselectedClient.properties?.[0]?.id || '',
                property_name: preselectedProperty?.name || preselectedClient.properties?.[0]?.name || '',
                address: preselectedProperty?.address || preselectedClient.properties?.[0]?.address || '',
                area: preselectedProperty?.area || preselectedClient.properties?.[0]?.area || '',
                floor: preselectedProperty?.floor || preselectedClient.properties?.[0]?.floor || '',
                access_code: preselectedProperty?.access_code || preselectedClient.properties?.[0]?.access_code || '',
                entry_instructions: preselectedProperty?.entry_instructions || preselectedClient.properties?.[0]?.entry_instructions || '',
                cleaning_instructions:
                  preselectedProperty?.cleaning_instructions || preselectedClient.properties?.[0]?.cleaning_instructions || '',
                scheduled_date: new Date().toISOString().split('T')[0],
                scheduled_time: '11:00 - 14:00',
                status: 'scheduled',
                priority: 'normal',
              }
            : null
        }
      />

      {/* Custom Confirmation Deletion Modal for Client */}
      <ConfirmModal
        open={!!clientToDelete}
        title="Διαγραφή Πελάτη"
        description={`Είστε βέβαιοι ότι θέλετε να διαγράψετε οριστικά τον πελάτη "${clientToDelete?.name}"; Μαζί του θα διαγραφούν όλα τα καταχωρημένα καταλύματα και οι σχετικοί καθαρισμοί.`}
        confirmLabel="Διαγραφή Πελάτη"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingClient}
        onConfirm={handleConfirmDeleteClient}
        onCancel={() => setClientToDelete(null)}
        variant="danger"
      />

      {/* Custom Confirmation Deletion Modal for Property */}
      <ConfirmModal
        open={!!propertyToDelete}
        title="Διαγραφή Καταλύματος"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε οριστικά το κατάλυμα "${propertyToDelete?.name}"; Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.`}
        confirmLabel="Διαγραφή Καταλύματος"
        cancelLabel="Ακύρωση"
        isLoading={isDeletingProperty}
        onConfirm={handleConfirmDeleteProperty}
        onCancel={() => setPropertyToDelete(null)}
        variant="danger"
      />
    </div>
  );
}
