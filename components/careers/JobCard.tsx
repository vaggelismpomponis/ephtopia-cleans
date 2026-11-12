import Link from "next/link";
import { MapPin, Euro, CalendarDays, ArrowRight, Briefcase } from "lucide-react";
import type { Job } from "@/lib/types/jobs";

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Πλήρης Απασχόληση",
  "part-time": "Μερική Απασχόληση",
  contract: "Σύμβαση",
};

interface JobCardProps {
  job: Job;
}

function formatDeadline(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isExpiringSoon(dateStr: string): boolean {
  const diff = new Date(dateStr).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}

export function JobCard({ job }: JobCardProps) {
  const typeLabel =
    employmentTypeLabel[job.employment_type] ?? job.employment_type;
  const expired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const soonExpiring = job.deadline ? isExpiringSoon(job.deadline) : false;

  return (
    <Link
      href={`/careers/${job.id}`}
      className="group flex flex-col justify-between rounded-xl border border-border bg-white p-6 hover:border-navy/40 transition-colors w-full h-full min-w-0"
      aria-label={`Δείτε αγγελία: ${job.title}`}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-dark truncate">
            {job.department} · {typeLabel}
          </span>
          <Briefcase
            className="w-4 h-4 text-navy shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-navy leading-snug group-hover:text-teal-dark transition-colors mb-3">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs sm:text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <MapPin
              className="w-4 h-4 text-muted-light shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>{job.location}</span>
          </span>
          {job.salary_range && (
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Euro
                className="w-4 h-4 text-muted-light shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>{job.salary_range}</span>
            </span>
          )}
          {job.deadline && (
            <span
              className={`inline-flex items-center gap-1.5 tabular-nums ${
                expired
                  ? "text-destructive"
                  : soonExpiring
                  ? "text-amber-700"
                  : ""
              }`}
            >
              <CalendarDays
                className="w-4 h-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>
                {expired
                  ? "Έληξε"
                  : `Έως ${formatDeadline(job.deadline)}`}
                {soonExpiring && !expired ? " (Λήγει σύντομα)" : ""}
              </span>
            </span>
          )}
        </div>

        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-5">
          {job.description}
        </p>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-navy group-hover:text-teal-dark transition-colors">
        <span>Δείτε την αγγελία</span>
        <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
      </div>
    </Link>
  );
}
