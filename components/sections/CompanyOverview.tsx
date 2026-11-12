"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import { useLivePreview } from "@/components/LivePreviewProvider";

interface CompanyOverviewProps {
  siteContent: SiteContent;
}

const COMPLIANCE_POINTS = [
  "Ποινικό μητρώο, ασφαλιστική κάλυψη και νόμιμες πιστοποιήσεις προσωπικού",
  "Παρουσία εντός 2 ωρών από κάθε check-out σε Αθήνα και Αττική",
  "Ψηφιακή αναφορά με φωτογραφίες πριν και μετά στο email σας",
] as const;

export default function CompanyOverview({
  siteContent: initialContent,
}: CompanyOverviewProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;

  return (
    <section className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 min-w-0">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border bg-white">
              <Image
                src="/hero-bg.png"
                alt="Επαγγελματική προετοιμασία δωματίου φιλοξενίας στην Ελλάδα"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              {siteContent.hero.profileLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
              Ελληνική εξειδίκευση στη διαχείριση χώρων φιλοξενίας
            </h2>
            <p className="mt-4 text-base text-muted leading-relaxed max-w-[54ch]">
              {siteContent.hero.profileText}
            </p>

            <ul className="mt-6 space-y-3 border-t border-border pt-6">
              {COMPLIANCE_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-navy">
                  <CheckCircle2
                    className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-teal-dark hover:text-navy transition-colors"
              >
                <span>Γνωρίστε την εταιρεία μας</span>
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

