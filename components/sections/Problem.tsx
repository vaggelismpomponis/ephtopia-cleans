"use client";

import { ArrowRight, UserX, ShieldAlert, Clock } from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import { useLivePreview } from "@/components/LivePreviewProvider";

const iconMap = {
  UserX,
  ShieldAlert,
  Clock,
};

interface ProblemProps {
  siteContent: SiteContent;
}

export default function Problem({ siteContent: initialContent }: ProblemProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;

  const handleScrollToServices = () => {
    document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="problem"
      className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
            {siteContent.problem.sectionLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
            {siteContent.problem.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-[58ch] leading-relaxed">
            {siteContent.problem.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-border rounded-xl bg-white divide-y md:divide-y-0 md:divide-x divide-border">
          {siteContent.problem.cards.map((card, i) => {
            const IconComponent =
              iconMap[card.icon as keyof typeof iconMap] || Clock;
            const stepNumber = String(i + 1).padStart(2, "0");

            return (
              <article key={i} className="p-6 sm:p-8 flex flex-col gap-4 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold tracking-widest text-muted-light tabular-nums">
                    {stepNumber}
                  </span>
                  <IconComponent
                    className="w-5 h-5 text-teal-dark shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-bold text-navy leading-snug">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-[15px] text-muted leading-relaxed">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm sm:text-base text-muted">
            {siteContent.problem.transition}
          </p>
          <button
            type="button"
            onClick={handleScrollToServices}
            className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-teal-dark hover:text-navy transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>{siteContent.problem.transitionCta}</span>
            <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </section>
  );
}
