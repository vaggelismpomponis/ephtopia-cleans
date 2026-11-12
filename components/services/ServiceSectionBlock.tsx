import Link from "next/link";
import {
  BrushCleaning,
  Home,
  Camera,
  CalendarRange,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";

export const SERVICE_ICON_MAP = {
  Sparkles: BrushCleaning,
  SprayCan: BrushCleaning,
  BrushCleaning,
  Home,
  Camera,
  CalendarRange,
  Building2,
} as const;

export interface ServiceStepItem {
  step: string;
  title: string;
  description: string;
}

export interface ServiceFeatureItem {
  title: string;
  description?: string;
}

export interface ServiceDetailItem {
  slug: string;
  icon?: string;
  title: string;
  tagline?: string;
  description: string;
  howItWorks: readonly ServiceStepItem[];
  features: readonly ServiceFeatureItem[];
}

interface ServiceSectionBlockProps {
  service: ServiceDetailItem;
  index: number;
  isAlternating?: boolean;
  defaultIcon?: keyof typeof SERVICE_ICON_MAP;
}

export function ServiceSectionBlock({
  service,
  index,
  isAlternating = false,
  defaultIcon = "Building2",
}: ServiceSectionBlockProps) {
  const IconComp =
    SERVICE_ICON_MAP[service.icon as keyof typeof SERVICE_ICON_MAP] ||
    SERVICE_ICON_MAP[defaultIcon];
  const isEven = isAlternating && index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");

  return (
    <section
      id={service.slug}
      className={`py-12 md:py-20 lg:py-24 border-b border-border scroll-mt-20 ${
        isEven ? "bg-white" : "bg-warm-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-12 md:mb-16">
          <div className={`lg:col-span-6 min-w-0 ${isEven ? "lg:order-2" : ""}`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold tracking-widest text-teal-dark tabular-nums">{num}</span>
              <IconComp className="w-5 h-5 text-navy shrink-0" strokeWidth={1.75} aria-hidden="true" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy leading-tight">
              {service.title}
            </h2>
            {service.tagline && (
              <p className="mt-3 text-base text-teal-dark font-medium leading-relaxed">{service.tagline}</p>
            )}
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed max-w-[56ch]">
              {service.description}
            </p>

            <div className="mt-8">
              <Link
                href="/#contact"
                className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>Ξεκινήστε Σήμερα</span>
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </Link>
            </div>
          </div>

          {service.howItWorks.length > 0 && (
            <div className={`lg:col-span-6 min-w-0 ${isEven ? "lg:order-1" : ""}`}>
              <div className="rounded-xl border border-border bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-navy">Πώς Λειτουργεί</h3>
                </div>
                <ol className="divide-y divide-border">
                  {service.howItWorks.map((step, sIdx) => (
                    <li key={sIdx} className="p-5 sm:p-6 flex items-start gap-4">
                      <span className="text-xs font-bold tracking-widest text-teal-dark tabular-nums pt-0.5 shrink-0">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-navy mb-1">{step.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </div>

        {service.features.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-5">Τι Περιλαμβάνει</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.features.map((feature, fIdx) => (
                <div key={fIdx} className="rounded-xl border border-border bg-white p-5 flex items-start gap-3 min-w-0">
                  <Check className="w-4 h-4 text-teal-dark shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-navy mb-1">{feature.title}</h4>
                    {feature.description && (
                      <p className="text-xs sm:text-sm text-muted leading-relaxed">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
