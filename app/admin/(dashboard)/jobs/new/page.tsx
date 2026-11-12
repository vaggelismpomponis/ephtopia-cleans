import { requireAdmin } from '@/lib/auth';
import { JobForm } from '@/components/admin/JobForm';
import { createJob } from '@/app/actions/jobs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewJobPage() {
  await requireAdmin();

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
          Νέα Καταχώρηση
        </span>
        <h2 className="text-2xl font-bold text-navy font-heading">Δημιουργία Αγγελίας</h2>
        <p className="text-muted text-sm mt-1">
          Συμπληρώστε τα παρακάτω πεδία για να δημιουργήσετε νέα αγγελία εργασίας.
        </p>
      </div>

      <JobForm onSubmit={createJob} submitLabel="Δημιουργία Αγγελίας" />
    </div>
  );
}
