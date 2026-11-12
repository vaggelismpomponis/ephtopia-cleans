import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getJob } from "@/app/actions/jobs";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { JobMetaGrid } from "@/components/careers/JobMetaGrid";
import {
  CalendarDays,
  ArrowLeft,
  CheckCircle,
  Star,
  Gift,
  Check,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Θέση Εργασίας | Ephtopia Cleans" };
  return {
    title: `${job.title} | Καριέρα — Ephtopia Cleans`,
    description: job.description.slice(0, 155),
    alternates: { canonical: `/careers/${id}` },
  };
}

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Πλήρης Απασχόληση",
  "part-time": "Μερική Απασχόληση",
  contract: "Σύμβαση",
};

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const typeLabel =
    employmentTypeLabel[job.employment_type] ?? job.employment_type;

  return (
    <div className="bg-warm-white min-h-dvh pt-24 md:pt-28 pb-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 min-h-10 text-sm font-medium text-muted hover:text-navy mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          <span>Πίσω στις αγγελίες</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6 min-w-0">
            <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-dark">
                  {job.department} · {typeLabel}
                </span>
                {isExpired && (
                  <span className="text-xs font-bold uppercase tracking-wider text-destructive">
                    · Έληξε
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy leading-tight mb-6">
                {job.title}
              </h1>

              <JobMetaGrid job={job} isExpired={isExpired} />
            </div>

            <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
              <h2 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 pb-3 border-b border-border">
                Περιγραφή Θέσης
              </h2>
              <p className="text-muted leading-relaxed whitespace-pre-line text-sm sm:text-base max-w-[65ch]">
                {job.description}
              </p>
            </div>

            {job.responsibilities.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
                <h2 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 pb-3 border-b border-border flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold shrink-0" strokeWidth={1.75} />
                  <span>Αρμοδιότητες</span>
                </h2>
                <ul className="space-y-3">
                  {(job.responsibilities as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-navy">
                      <CheckCircle className="w-4 h-4 text-teal-dark shrink-0 mt-1" strokeWidth={1.75} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
                <h2 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 pb-3 border-b border-border flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
                  <span>Απαιτήσεις</span>
                </h2>
                <ul className="space-y-3">
                  {(job.requirements as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-navy">
                      <Check className="w-4 h-4 text-teal-dark shrink-0 mt-1" strokeWidth={1.75} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits.length > 0 && (
              <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
                <h2 className="text-xs font-bold text-teal-dark uppercase tracking-widest mb-4 pb-3 border-b border-border flex items-center gap-2">
                  <Gift className="w-4 h-4 text-gold shrink-0" strokeWidth={1.75} />
                  <span>Παροχές</span>
                </h2>
                <ul className="space-y-3">
                  {(job.benefits as string[]).map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-navy">
                      <Gift className="w-4 h-4 text-gold shrink-0 mt-1" strokeWidth={1.75} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:col-span-5 xl:col-span-4 min-w-0">
            <div className="lg:sticky lg:top-24">
              {isExpired ? (
                <div className="bg-white border border-border rounded-xl p-6 text-center">
                  <CalendarDays className="w-6 h-6 text-destructive mx-auto mb-3" strokeWidth={1.75} />
                  <h2 className="text-lg font-bold text-navy mb-2">Η αγγελία έχει λήξει</h2>
                  <p className="text-sm text-muted mb-4">
                    Η προθεσμία για αυτή τη θέση έχει παρέλθει.
                  </p>
                  <Link href="/careers" className="inline-flex items-center min-h-10 text-sm font-semibold text-teal-dark hover:text-navy">
                    Δείτε άλλες αγγελίες →
                  </Link>
                </div>
              ) : (
                <div className="bg-white border border-border rounded-xl p-6 sm:p-8">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-navy mb-1">Υποβολή Αίτησης</h2>
                    <p className="text-sm text-muted leading-relaxed">
                      Συμπληρώστε τα στοιχεία σας για τη θέση{" "}
                      <strong className="text-navy">{job.title}</strong>.
                    </p>
                  </div>
                  <ApplicationForm jobId={job.id} jobTitle={job.title} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
