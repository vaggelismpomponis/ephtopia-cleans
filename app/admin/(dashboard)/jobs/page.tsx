import { requireAdmin } from '@/lib/auth';
import { getAllJobs } from '@/app/actions/jobs';
import { JobsTable } from '@/components/admin/JobsTable';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminJobsPage() {
  await requireAdmin();
  const jobs = await getAllJobs();

  const activeCount = jobs.filter((j) => j.is_active).length;
  const totalApplications = jobs.reduce((sum, j) => sum + j.application_count, 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-1 block">
            Διαχείριση
          </span>
          <h2 className="text-2xl font-bold text-navy font-heading">Αγγελίες Εργασίας</h2>
          <p className="text-muted text-sm mt-1">
            Δημιουργία, επεξεργασία και παρακολούθηση αγγελιών εργασίας.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex items-center justify-center gap-2 min-h-10 bg-teal-dark hover:bg-navy text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>Νέα Αγγελία</span>
        </Link>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-3 border border-border rounded-xl bg-white divide-y sm:divide-y-0 sm:divide-x divide-border mb-6">
        {[
          { label: 'Σύνολο Αγγελιών', value: jobs.length },
          { label: 'Ενεργές', value: activeCount },
          { label: 'Αιτήσεις', value: totalApplications },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 sm:p-5 text-center min-w-0">
            <dd className="text-2xl font-bold text-navy font-heading tabular-nums">{value}</dd>
            <dt className="text-xs font-medium uppercase tracking-wider text-muted mt-1">{label}</dt>
          </div>
        ))}
      </dl>

      <JobsTable jobs={jobs} />
    </div>
  );
}
