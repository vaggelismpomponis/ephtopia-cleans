import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getJobForEdit, updateJob } from '@/app/actions/jobs';
import { JobForm } from '@/components/admin/JobForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const job = await getJobForEdit(id);

  if (!job) notFound();

  const handleUpdate = updateJob.bind(null, id);

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
        <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-1 block">
          Επεξεργασία
        </span>
        <h2 className="text-2xl font-bold text-navy font-heading">{job.title}</h2>
        <p className="text-muted text-sm mt-1">
          Επεξεργαστείτε τα στοιχεία της αγγελίας και πατήστε Αποθήκευση.
        </p>
      </div>

      <JobForm initialData={job} onSubmit={handleUpdate} submitLabel="Αποθήκευση Αλλαγών" />
    </div>
  );
}
