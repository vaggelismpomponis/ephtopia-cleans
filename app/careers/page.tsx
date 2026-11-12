import { getActiveJobs } from "@/app/actions/jobs";
import { getContent } from "@/lib/get-content";
import { JobCard } from "@/components/careers/JobCard";
import { Briefcase, ArrowRight, Mail } from "lucide-react";

export const revalidate = 60;

export default async function CareersPage() {
  const [jobs, { siteContent }] = await Promise.all([
    getActiveJobs(),
    getContent(),
  ]);
  const contactEmail = siteContent.footer.contact.email;

  return (
    <>
      <section className="bg-white border-b border-border pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-4 block">
              Θέσεις Εργασίας
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.08] tracking-tight">
              Καριέρα στην{" "}
              <span className="text-teal-dark">Ephtopia Cleans</span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-[54ch] leading-relaxed">
              Γίνε μέρος μιας ομάδας που κάνει τη διαφορά. Εργαζόμαστε με
              επαγγελματισμό, αξιοπιστία και μεράκι — και ψάχνουμε ανθρώπους που
              μοιράζονται τις ίδιες αξίες.
            </p>
          </div>

          <dl className="mt-10 pt-8 border-t border-border grid grid-cols-2 sm:flex sm:items-center gap-6 sm:gap-12">
            <div className="min-w-0">
              <dd className="text-2xl sm:text-3xl font-bold text-navy tracking-tight tabular-nums">
                {jobs.length}
              </dd>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                Ανοιχτές Θέσεις
              </dt>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" aria-hidden="true" />
            <div className="min-w-0">
              <dd className="text-2xl sm:text-3xl font-bold text-navy tracking-tight tabular-nums">
                50+
              </dd>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                Εργαζόμενοι
              </dt>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" aria-hidden="true" />
            <div className="col-span-2 sm:col-span-1 min-w-0">
              <dd className="text-2xl sm:text-3xl font-bold text-navy tracking-tight tabular-nums">
                2026
              </dd>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                Ίδρυση
              </dt>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 sm:p-12 text-center max-w-xl mx-auto">
              <Briefcase
                className="w-6 h-6 text-teal-dark mx-auto mb-3"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h2 className="text-xl font-bold text-navy mb-2">
                Δεν υπάρχουν ανοιχτές θέσεις αυτή τη στιγμή
              </h2>
              <p className="text-sm text-muted max-w-[44ch] mx-auto leading-relaxed mb-6">
                Δεν έχουμε τρέχουσες αγγελίες, αλλά μπορείτε να μας στείλετε το
                βιογραφικό σας και θα επικοινωνήσουμε μαζί σας για μελλοντικές
                ευκαιρίες.
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>Στείλτε το βιογραφικό σας</span>
              </a>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-2 block">
                  Αγγελίες Εργασίας
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                  {jobs.length === 1
                    ? "1 ανοιχτή θέση"
                    : `${jobs.length} ανοιχτές θέσεις`}
                </h2>
              </div>

              <div
                className={`grid gap-6 ${
                  jobs.length === 1 ? "max-w-xl" : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-xl border border-border bg-warm-white p-6 sm:p-10">
            <div className="max-w-xl min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-2 block">
                Ανοιχτή Αίτηση
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                Δεν βρήκες τη θέση που ψάχνεις;
              </h2>
              <p className="mt-2 text-base text-muted leading-relaxed">
                Στείλτε μας το βιογραφικό σας ούτως ή άλλως — ενημερωνόμαστε
                τακτικά για νέες ανάγκες και θα επικοινωνήσουμε μαζί σας άμεσα.
              </p>
            </div>
            <a
              href={`mailto:${contactEmail}?subject=Αυτόκλητο Βιογραφικό`}
              className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white font-semibold px-6 py-3 rounded-lg text-sm sm:text-base transition-colors shrink-0"
            >
              <span>Επικοινωνία &amp; Βιογραφικό</span>
              <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
