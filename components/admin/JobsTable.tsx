'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pencil,
  Trash2,
  Users,
  MapPin,
  CalendarDays,
  Eye,
  EyeOff,
  Plus,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toggleJobActive, deleteJob } from '@/app/actions/jobs';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import type { JobWithApplicationCount } from '@/lib/types/jobs';

const employmentTypeLabel: Record<string, string> = {
  'full-time': 'Πλήρης',
  'part-time': 'Μερική',
  contract: 'Σύμβαση',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('el-GR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface JobsTableProps {
  jobs: JobWithApplicationCount[];
}

export function JobsTable({ jobs: initialJobs }: JobsTableProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initialJobs);
  const [, startToggle] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ id: string; type: 'ok' | 'err' } | null>(null);

  const handleToggle = (id: string, current: boolean) => {
    setTogglingId(id);
    startToggle(async () => {
      const result = await toggleJobActive(id, !current);
      if (result.success) {
        setJobs((prev) => prev.map((j) => j.id === id ? { ...j, is_active: !current } : j));
        setFeedback({ id, type: 'ok' });
        setTimeout(() => setFeedback(null), 2000);
      } else {
        setFeedback({ id, type: 'err' });
        setTimeout(() => setFeedback(null), 2000);
      }
      setTogglingId(null);
    });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await deleteJob(deleteTarget.id);
    if (result.success) {
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      setDeleteTarget(null);
      router.refresh();
    } else {
      alert('Σφάλμα κατά τη διαγραφή: ' + result.error);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="font-bold text-slate-700 font-heading mb-2">Δεν υπάρχουν αγγελίες</h3>
        <p className="text-slate-400 text-sm mb-6">Δημιουργήστε την πρώτη σας αγγελία εργασίας.</p>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Νέα Αγγελία
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── Mobile Card View (< sm) ── */}
      <div className="sm:hidden space-y-3">
        {jobs.map((job) => {
          const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
          const isToggling = togglingId === job.id;
          const fb = feedback && feedback.id === job.id ? feedback.type : null;

          return (
            <div
              key={job.id}
              className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 ${!job.is_active ? 'opacity-60' : ''}`}
            >
              {/* Top row: Title + Active Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/admin/applications?job=${job.id}`}
                    className="font-bold text-slate-800 text-base hover:text-teal transition-colors block"
                  >
                    {job.title}
                  </Link>
                  <span className="inline-block text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                    {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                  </span>
                </div>

                <button
                  onClick={() => handleToggle(job.id, job.is_active)}
                  disabled={isToggling}
                  className={`relative shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all border ${
                    job.is_active
                      ? 'bg-teal/10 text-teal border-teal/20'
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}
                >
                  {isToggling ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : job.is_active ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                  {job.is_active ? 'Ενεργή' : 'Ανενεργή'}
                  {fb && (
                    <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${fb === 'ok' ? 'bg-teal' : 'bg-red-400'} animate-ping`} />
                  )}
                </button>
              </div>

              {/* Meta details */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="text-slate-300">·</span>
                <span>{job.department}</span>
                {job.deadline && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className={`flex items-center gap-1 ${isExpired ? 'text-red-400 font-semibold' : ''}`}>
                      <CalendarDays className="w-3.5 h-3.5" />
                      {isExpired ? 'Έληξε' : `Έως ${formatDate(job.deadline)}`}
                    </span>
                  </>
                )}
              </div>

              {/* Card Footer: Applications button + Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <Link
                  href={`/admin/applications?job=${job.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-teal/10 text-teal hover:bg-teal hover:text-white border border-teal/20 transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{job.application_count} {job.application_count === 1 ? 'Αίτηση' : 'Αιτήσεις'}</span>
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    href={`/careers/${job.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Προβολή στο site"
                    className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-teal/10 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    title="Επεξεργασία"
                    className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-teal/10 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ id: job.id, title: job.title })}
                    title="Διαγραφή"
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop Table View (>= sm) ── */}
      <div className="hidden sm:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-5 font-bold">Θέση / Τμήμα</th>
                <th className="py-3 px-4 text-center font-bold">Τύπος</th>
                <th className="py-3 px-4 text-center font-bold">Αιτήσεις</th>
                <th className="py-3 px-4 text-center font-bold">Κατάσταση</th>
                <th className="py-3 px-5 text-right font-bold">Ενέργειες</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => {
                const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
                const isToggling = togglingId === job.id;
                const fb = feedback && feedback.id === job.id ? feedback.type : null;

                return (
                  <tr
                    key={job.id}
                    className={`hover:bg-slate-50/50 transition-colors ${!job.is_active ? 'opacity-60' : ''}`}
                  >
                    <td className="py-4 px-5">
                      <Link
                        href={`/admin/applications?job=${job.id}`}
                        className="font-bold text-slate-800 text-sm hover:text-teal transition-colors block"
                        title="Προβολή αιτήσεων"
                      >
                        {job.title}
                      </Link>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />{job.location}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span>{job.department}</span>
                        {job.deadline && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className={`flex items-center gap-1 ${isExpired ? 'text-red-400' : ''}`}>
                              <CalendarDays className="w-3 h-3" />
                              {isExpired ? 'Έληξε' : `Έως ${formatDate(job.deadline)}`}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {employmentTypeLabel[job.employment_type] ?? job.employment_type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <Link
                        href={`/admin/applications?job=${job.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg bg-teal/10 text-teal hover:bg-teal hover:text-white border border-teal/20 transition-all shadow-sm"
                        title="Προβολή Αιτήσεων"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{job.application_count} {job.application_count === 1 ? 'Αίτηση' : 'Αιτήσεις'}</span>
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(job.id, job.is_active)}
                        disabled={isToggling}
                        title={job.is_active ? 'Απενεργοποίηση' : 'Ενεργοποίηση'}
                        className={`relative inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all border ${
                          job.is_active
                            ? 'bg-teal/10 text-teal border-teal/20 hover:bg-teal/20'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {isToggling ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : job.is_active ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {job.is_active ? 'Ενεργή' : 'Ανενεργή'}
                        {fb && (
                          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${fb === 'ok' ? 'bg-teal' : 'bg-red-400'} animate-ping`} />
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/careers/${job.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Προβολή στο site"
                          className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-teal/10 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/jobs/${job.id}/applications`}
                          title="Προβολή Αιτήσεων"
                          className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-teal/10 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/jobs/${job.id}`}
                          title="Επεξεργασία"
                          className="p-2 rounded-lg text-slate-400 hover:text-teal hover:bg-teal/10 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ id: job.id, title: job.title })}
                          title="Διαγραφή"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Διαγραφή Αγγελίας"
        description={`Είστε σίγουροι ότι θέλετε να διαγράψετε την αγγελία "${deleteTarget?.title ?? ''}"; Η ενέργεια αυτή δεν αναιρείται.`}
        confirmLabel="Διαγραφή"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
