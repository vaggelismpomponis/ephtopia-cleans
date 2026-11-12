'use client';

import { useState, useTransition } from 'react';
import { Job, JobApplication, ApplicationStatus, STATUS_LABELS } from '@/lib/types/jobs';
import { updateApplicationStatus } from '@/app/actions/jobs';
import {
  CalendarDays,
  Download,
  Eye,
  FileText,
  Mail,
  Phone,
  User,
  Clock,
  XCircle,
  Award,
  ChevronDown,
  Loader2,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';

interface ApplicationsListProps {
  initialApplications: JobApplication[];
  jobs?: Job[];
  selectedJobId?: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('el-GR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_ICONS: Record<ApplicationStatus, LucideIcon> = {
  new: Clock,
  viewed: Eye,
  rejected: XCircle,
  hired: Award,
};

export default function ApplicationsList({ initialApplications }: ApplicationsListProps) {
  const [applications, setApplications] = useState<JobApplication[]>(initialApplications);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus) => {
    setUpdatingId(appId);
    // Optimistic update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    startTransition(async () => {
      const res = await updateApplicationStatus(appId, newStatus);
      if (!res.success) {
        // Revert on error
        setApplications(initialApplications);
        alert('Αποτυχία ενημέρωσης κατάστασης: ' + (res.error || 'Σφάλμα'));
      }
      setUpdatingId(null);
    });
  };

  const handleCvView = (app: JobApplication) => {
    if (app.status === 'new') {
      handleStatusChange(app.id, 'viewed');
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = activeFilter === 'all' || (app.status || 'new') === activeFilter;
    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const cleanQPhone = q.replace(/\s+/g, '');
    const cleanAppPhone = app.phone ? app.phone.replace(/\s+/g, '') : '';

    const nameMatch = app.full_name?.toLowerCase().includes(q);
    const emailMatch = app.email?.toLowerCase().includes(q);
    const phoneMatch = cleanAppPhone.includes(cleanQPhone);

    return nameMatch || emailMatch || phoneMatch;
  });

  const getCount = (statusKey: string) => {
    if (statusKey === 'all') return applications.length;
    return applications.filter((app) => (app.status || 'new') === statusKey).length;
  };

  const filters: { key: string; label: string }[] = [
    { key: 'all', label: 'Όλες' },
    { key: 'new', label: STATUS_LABELS.new.label },
    { key: 'viewed', label: STATUS_LABELS.viewed.label },
    { key: 'rejected', label: STATUS_LABELS.rejected.label },
    { key: 'hired', label: STATUS_LABELS.hired.label },
  ];

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm">Δεν υπάρχουν αιτήσεις για αυτή τη θέση.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls: Search Bar & Filter Tabs */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Αναζήτηση με όνομα, email ή τηλέφωνο..."
            className="w-full pl-10 pr-9 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200">
          {filters.map((f) => {
            const count = getCount(f.key);
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-navy text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-slate-500 text-sm">
            {searchQuery
              ? 'Δεν βρέθηκε καμία αίτηση που να ταιριάζει με τα κριτήρια αναζήτησης.'
              : 'Δεν βρέθηκαν αιτήσεις με τη συγκεκριμένη κατάσταση.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, i) => {
            const currentStatus = app.status || 'new';
            const statusConfig = STATUS_LABELS[currentStatus] || STATUS_LABELS.new;
            const StatusIcon = STATUS_ICONS[currentStatus] || STATUS_ICONS.new;
            const isUpdating = updatingId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  {/* Left: Applicant info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-teal">
                        {app.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm flex items-center flex-wrap gap-2">
                        <span>{app.full_name}</span>
                        {app.job_title && (
                          <span className="text-[11px] font-semibold text-teal bg-teal/10 px-2 py-0.5 rounded-md border border-teal/20">
                            {app.job_title}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">Αίτηση #{i + 1}</div>
                    </div>
                  </div>

                  {/* Right: Status selector + Date */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative inline-flex items-center">
                      <StatusIcon className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${statusConfig.text}`} />
                      <select
                        value={currentStatus}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className={`appearance-none pl-8 pr-7 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${statusConfig.bg} ${statusConfig.hoverBg} ${statusConfig.text} ${statusConfig.border} ${statusConfig.hoverBorder} hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal/30 disabled:opacity-50`}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, cfg]) => (
                          <option key={key} value={key} className="bg-white text-slate-800">
                            {cfg.label}
                          </option>
                        ))}
                      </select>
                      {isUpdating ? (
                        <Loader2 className="w-3 h-3 animate-spin absolute right-2.5 pointer-events-none text-slate-400" />
                      ) : (
                        <ChevronDown className={`w-3 h-3 absolute right-2.5 pointer-events-none ${statusConfig.text}`} />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {formatDate(app.submitted_at)}
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <a
                    href={`mailto:${app.email}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    {app.email}
                  </a>
                  <a
                    href={`tel:${app.phone}`}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    {app.phone}
                  </a>
                </div>

                {/* Cover letter */}
                {app.cover_letter && (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                      Συνοδευτικό Μήνυμα
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {app.cover_letter}
                    </p>
                  </div>
                )}

                {/* CV action buttons */}
                {app.cv_url ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={app.cv_view_url || app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCvView(app)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-teal bg-slate-100 hover:bg-teal/10 border border-slate-200 hover:border-teal/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Προβολή CV
                    </a>
                    <a
                      href={app.cv_url}
                      download={`CV_${app.full_name.trim().replace(/\s+/g, '_')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleCvView(app)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-dark bg-teal/10 hover:bg-teal/15 border border-teal/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Λήψη CV
                    </a>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    Δεν επισυνάφθηκε CV
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
