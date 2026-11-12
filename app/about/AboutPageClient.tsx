import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import { AboutCredentials } from "@/components/about/AboutCredentials";

interface AboutPageClientProps {
  siteContent: SiteContent;
}

export default function AboutPageClient({ siteContent }: AboutPageClientProps) {
  const about = siteContent.about;

  return (
    <main>
      <section className="bg-white border-b border-border pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-4 block">
              {about.heroLabel}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.08] tracking-tight">
              {about.title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-[56ch] leading-relaxed">
              {about.subtitle}
            </p>
          </div>

          <dl className="mt-10 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
            {about.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={i === 2 ? "col-span-2 sm:col-span-1 min-w-0" : "min-w-0"}
              >
                <dd className="text-2xl sm:text-3xl font-bold text-navy tracking-tight tabular-nums">
                  {stat.value}
                </dd>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted mt-1">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
                Αποστολή
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {about.missionTitle}
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-[54ch]">
                {about.missionText}
              </p>
            </div>

            <div className="min-w-0 lg:border-l lg:border-border lg:pl-12 pt-8 lg:pt-0 border-t lg:border-t-0 border-border">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
                Ιστορία
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {about.storyTitle}
              </h2>
              <p className="mt-4 text-base text-muted leading-relaxed max-w-[54ch]">
                {about.storyText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AboutCredentials about={about} />

      <section className="bg-white py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-xl border border-border bg-warm-white p-6 sm:p-10">
            <div className="max-w-xl min-w-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                {about.ctaTitle}
              </h2>
              <p className="mt-2 text-base text-muted leading-relaxed">
                {about.ctaText}
              </p>
            </div>
            <div className="flex flex-col-reverse sm:flex-row gap-3 shrink-0">
              <Link
                href="/services"
                className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-lg border border-border bg-white hover:border-navy/40 text-navy text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Δείτε τις Υπηρεσίες μας</span>
                <ArrowRight className="w-4 h-4 text-muted shrink-0" strokeWidth={1.75} />
              </Link>
              <Link
                href="/#contact"
                className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>{about.ctaButton}</span>
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
