import { MapPin, Briefcase, Clock, CalendarDays, Mail } from "lucide-react";
import type { Job } from "@/lib/types/jobs";

const employmentTypeLabel: Record<string, string> = {
  "full-time": "Πλήρης Απασχόληση",
  "part-time": "Μερική Απασχόληση",
  contract: "Σύμβαση",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("el-GR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface JobMetaGridProps {
  job: Job;
  isExpired: boolean;
}

export function JobMetaGrid({ job, isExpired }: JobMetaGridProps) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border text-sm">
      <div className="flex items-start gap-2.5 min-w-0">
        <MapPin
          className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-light">
            Τοποθεσία
          </dt>
          <dd className="font-semibold text-navy">{job.location}</dd>
        </div>
      </div>

      <div className="flex items-start gap-2.5 min-w-0">
        <Briefcase
          className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-light">
            Τύπος
          </dt>
          <dd className="font-semibold text-navy">
            {employmentTypeLabel[job.employment_type] ?? job.employment_type}
          </dd>
        </div>
      </div>

      {job.salary_range && (
        <div className="flex items-start gap-2.5 min-w-0">
          <Clock
            className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-light">
              Αμοιβή
            </dt>
            <dd className="font-semibold text-navy tabular-nums">
              {job.salary_range}
            </dd>
          </div>
        </div>
      )}

      {job.deadline && (
        <div className="flex items-start gap-2.5 min-w-0">
          <CalendarDays
            className={`w-4 h-4 shrink-0 mt-0.5 ${isExpired ? "text-destructive" : "text-teal-dark"
              }`}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <dt className="text-xs font-medium uppercase tracking-wider text-muted-light">
              Προθεσμία
            </dt>
            <dd
              className={`font-semibold tabular-nums ${isExpired ? "text-destructive" : "text-navy"
                }`}
            >
              {formatDate(job.deadline)}
            </dd>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2.5 min-w-0 sm:col-span-2">
        <Mail
          className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <dt className="text-xs font-medium uppercase tracking-wider text-muted-light">
            Επικοινωνία
          </dt>
          <dd>
            <a
              href={`mailto:${job.contact_email}`}
              className="font-semibold text-teal-dark hover:text-navy transition-colors break-all"
            >
              {job.contact_email}
            </a>
          </dd>
        </div>
      </div>
    </dl>
  );
}

