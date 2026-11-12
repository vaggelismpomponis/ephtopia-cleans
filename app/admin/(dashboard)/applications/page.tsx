import { requireAdmin } from '@/lib/auth';
import { getAllJobs, getApplications } from '@/app/actions/jobs';
import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';
import ApplicationsList from '@/components/admin/ApplicationsList';

interface PageProps {
  searchParams: Promise<{ job?: string }>;
}

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { job: selectedJobId } = await searchParams;

  const [jobs, applications] = await Promise.all([
    getAllJobs(),
    getApplications(selectedJobId),
  ]);

  const currentJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 min-h-9 text-sm text-muted hover:text-navy mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>Πίσω στις αγγελίες</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-1 block">
              Διαχείριση CVs
            </span>
            <h2 className="text-2xl font-bold text-navy font-heading">
              {currentJob ? `Αιτήσεις: ${currentJob.title}` : 'Όλες οι Αιτήσεις'}
            </h2>
            <p className="text-muted text-sm mt-1">
              {applications.length === 0
                ? 'Δεν υπάρχουν αιτήσεις.'
                : `${applications.length} ${applications.length === 1 ? 'αίτηση' : 'αιτήσεις'}`}
            </p>
          </div>

          {jobs.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="job-filter" className="text-xs font-semibold text-muted shrink-0 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
                <span>Θέση:</span>
              </label>
              <form method="GET" className="inline-block">
                <select
                  id="job-filter"
                  name="job"
                  defaultValue={selectedJobId || 'all'}
                  className="min-h-10 bg-white border border-border rounded-lg px-3 py-2 text-xs sm:text-sm font-medium text-navy focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-colors cursor-pointer"
                >
                  <option value="all">Όλες οι θέσεις ({jobs.reduce((acc, j) => acc + j.application_count, 0)})</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.application_count})
                    </option>
                  ))}
                </select>
                <noscript>
                  <button type="submit" className="ml-2 text-xs bg-teal text-white px-2 py-1 rounded">
                    Φίλτρο
                  </button>
                </noscript>
              </form>
            </div>
          )}
        </div>
      </div>

      <ApplicationsList initialApplications={applications} jobs={jobs} selectedJobId={selectedJobId || 'all'} />
    </div>
  );
}
