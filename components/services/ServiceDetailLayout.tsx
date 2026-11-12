import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import {
  SERVICE_ICON_MAP,
  ServiceSectionBlock,
  type ServiceDetailItem,
} from "@/components/services/ServiceSectionBlock";

interface ServiceDetailLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  tagline?: string;
  items: readonly ServiceDetailItem[];
  showQuickNav?: boolean;
  heroCtaLabel?: string;
}

export function ServiceDetailLayout({
  eyebrow,
  title,
  subtitle,
  tagline,
  items,
  showQuickNav = false,
  heroCtaLabel,
}: ServiceDetailLayoutProps) {
  return (
    <main>
      <section className="bg-white border-b border-border pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 min-h-10 text-sm font-medium text-muted hover:text-navy transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span>Όλες οι Υπηρεσίες</span>
          </Link>

          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              {eyebrow}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-navy leading-[1.08] tracking-tight">
              {title}
            </h1>
            {tagline && (
              <p className="mt-4 text-base sm:text-lg font-medium text-teal-dark leading-relaxed">
                {tagline}
              </p>
            )}
            <p className="mt-4 text-base sm:text-lg text-muted max-w-[58ch] leading-relaxed">
              {subtitle}
            </p>

            {heroCtaLabel && (
              <div className="mt-8">
                <Link
                  href="/#contact"
                  className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>{heroCtaLabel}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                </Link>
              </div>
            )}

            {showQuickNav && items.length > 1 && (
              <div className="mt-8 flex flex-wrap gap-2.5">
                {items.map((item) => {
                  const IconComp =
                    SERVICE_ICON_MAP[
                    item.icon as keyof typeof SERVICE_ICON_MAP
                    ] || Sparkles;
                  return (
                    <a
                      key={item.slug}
                      href={`#${item.slug}`}
                      className="inline-flex items-center gap-2 min-h-10 px-4 py-2 rounded-lg border border-border bg-warm-white hover:border-navy/40 text-sm font-medium text-navy transition-colors"
                    >
                      <IconComp
                        className="w-4 h-4 text-teal-dark shrink-0"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      <span>{item.title}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {items.map((service, index) => (
        <ServiceSectionBlock
          key={service.slug}
          service={service}
          index={index}
          isAlternating={items.length > 1}
        />
      ))}
    </main>
  );
}

