import {
  ShieldCheck,
  Sparkles,
  Clock,
  Camera,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import type { SiteContent } from "@/lib/get-content";

const iconMap = {
  ShieldCheck,
  Sparkles,
  Clock,
  Camera,
};

const COMPLIANCE_BADGES = [
  "Ποινικό Μητρώο",
  "Ασφαλιστική Κάλυψη",
  "Επαγγελματικές Πιστοποιήσεις",
  "Νόμιμη Απασχόληση",
] as const;

const COVERAGE_AREAS = [
  "Κέντρο Αθήνας",
  "Νότια Προάστια",
  "Βόρεια Προάστια",
  "Υπόλοιπο Αττικής",
] as const;

export function AboutCredentials({ about }: { about: SiteContent["about"] }) {
  return (
    <>
      <section className="bg-white py-12 md:py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 md:mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              Οι Αξίες μας
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              Τι μας Κάνει Διαφορετικούς
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-xl bg-warm-white divide-y sm:divide-y-0 sm:divide-x divide-border">
            {about.values.map((value, i) => {
              const IconComponent =
                iconMap[value.icon as keyof typeof iconMap] || Sparkles;
              const num = String(i + 1).padStart(2, "0");

              return (
                <article key={i} className="p-6 sm:p-7 flex flex-col gap-3 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold tracking-widest text-muted-light tabular-nums">
                      {num}
                    </span>
                    <IconComponent
                      className="w-5 h-5 text-teal-dark shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-navy leading-snug">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
                Νομική Συμμόρφωση
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {about.complianceTitle}
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-[56ch]">
                {about.complianceText}
              </p>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <div className="rounded-xl border border-border bg-white p-6">
                <ul className="space-y-3">
                  {COMPLIANCE_BADGES.map((badge) => (
                    <li
                      key={badge}
                      className="flex items-center gap-2.5 text-sm font-medium text-navy"
                    >
                      <CheckCircle2
                        className="w-4 h-4 text-teal-dark shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span>{badge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-border grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
                Περιοχές Εξυπηρέτησης
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {about.coverageTitle}
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-[54ch]">
                {about.coverageText}
              </p>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COVERAGE_AREAS.map((city) => (
                  <div
                    key={city}
                    className="flex items-center gap-2.5 bg-white border border-border rounded-xl px-4 py-3.5 min-w-0"
                  >
                    <MapPin
                      className="w-4 h-4 text-teal-dark shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-semibold text-navy">{city}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
