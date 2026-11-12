"use client";

import Link from "next/link";
import {
  Sparkles,
  SprayCan,
  ShieldCheck,
  Camera,
  CalendarRange,
  Building2,
  Check,
  ArrowUpRight,
} from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import { useLivePreview } from "@/components/LivePreviewProvider";

const iconMap = {
  Sparkles,
  SprayCan,
  ShieldCheck,
  Camera,
  CalendarRange,
  Building2,
};

interface ServicesProps {
  siteContent: SiteContent;
}

export default function Services({ siteContent: initialContent }: ServicesProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;

  return (
    <section
      id="services"
      className="bg-white py-12 md:py-20 lg:py-24 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              {siteContent.services.sectionLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              {siteContent.services.title}
            </h2>
          </div>

          <div className="max-w-md min-w-0">
            <p className="text-base text-muted leading-relaxed">
              {siteContent.services.subtitle}
            </p>
            <Link
              href="/services"
              className="mt-3 inline-flex items-center gap-1.5 min-h-10 text-sm font-semibold text-teal-dark hover:text-navy transition-colors"
            >
              <span>Πλήρης κατάλογος υπηρεσιών</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {siteContent.services.items.map((service, i) => {
            const IconComponent =
              iconMap[service.icon as keyof typeof iconMap] || Sparkles;
            const num = String(i + 1).padStart(2, "0");
            const href =
              "href" in service
                ? (service as { href: string }).href
                : "/services";

            return (
              <Link
                key={service.slug || i}
                href={href}
                className="group flex flex-col h-full rounded-xl border border-border bg-warm-white p-6 sm:p-8 hover:border-navy/40 transition-colors min-w-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-teal-dark tabular-nums">
                    {num}
                  </span>
                  <IconComponent
                    className="w-5 h-5 text-navy shrink-0"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-navy mt-4 mb-3 group-hover:text-teal-dark transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-6">
                  {service.description}
                </p>

                <ul className="border-t border-border pt-6 space-y-2.5 flex-1">
                  {service.features.map((feature, fIdx) => (
                    <li
                      key={fIdx}
                      className="flex items-start gap-2.5 text-sm text-navy font-medium"
                    >
                      <Check
                        className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-navy group-hover:text-teal-dark transition-colors">
                  <span>Μάθετε Περισσότερα</span>
                  <ArrowUpRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
