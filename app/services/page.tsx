import Link from "next/link";
import {
  Home,
  Camera,
  CalendarRange,
  Building2,
  ArrowRight,
  Check,
} from "lucide-react";
import { getContent } from "@/lib/get-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";

const iconMap = {
  Sparkles: Home,
  SprayCan: Home,
  Home,
  Camera,
  CalendarRange,
  Building2,
};

export default async function ServicesLandingPage() {
  const { siteContent } = await getContent();
  const { items: categories, title, subtitle } = siteContent.servicesPage;

  return (
    <>
      <Navbar siteContent={siteContent} />
      <main>
        <section className="bg-white border-b border-border pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-4 block">
                Οι Υπηρεσίες μας
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.08] tracking-tight">
                {title}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted max-w-[56ch] leading-relaxed">
                {subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-warm-white py-12 md:py-20 lg:py-24 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat, idx) => {
                const IconComponent =
                  iconMap[cat.icon as keyof typeof iconMap] || Home;
                const num = String(idx + 1).padStart(2, "0");

                return (
                  <Link
                    key={cat.slug}
                    href={`/services/${cat.slug}`}
                    className="group flex flex-col justify-between h-full rounded-xl border border-border bg-white p-6 sm:p-8 hover:border-navy/40 transition-colors min-w-0"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-5">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-dark tabular-nums">
                          Υπηρεσία {num}
                        </span>
                        <IconComponent
                          className="w-5 h-5 text-navy shrink-0"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-navy mb-3 group-hover:text-teal-dark transition-colors">
                        {cat.title}
                      </h2>
                      <p className="text-sm sm:text-[15px] text-muted leading-relaxed mb-6">
                        {cat.description}
                      </p>

                      <div className="border-t border-border pt-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-light mb-3">
                          Βασικά Πλεονεκτήματα
                        </h3>
                        <ul className="space-y-2.5">
                          {cat.features.slice(0, 3).map((f, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-navy font-medium"
                            >
                              <Check
                                className="w-4 h-4 text-teal-dark shrink-0 mt-0.5"
                                strokeWidth={1.75}
                                aria-hidden="true"
                              />
                              <span>{typeof f === "string" ? f : f.title}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm font-semibold text-navy group-hover:text-teal-dark transition-colors">
                      <span>Δείτε Αναλυτικά</span>
                      <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-xl border border-border bg-warm-white p-6 sm:p-10">
              <div className="max-w-xl min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
                  Έτοιμοι να Ξεκινήσετε;
                </h2>
                <p className="mt-2 text-base text-muted leading-relaxed">
                  Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε εντός 24 ωρών.
                </p>
              </div>
              <Link
                href="/#contact"
                className="w-full sm:w-auto min-h-11 px-6 py-3 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2 shrink-0"
              >
                <span>Ξεκινήστε Δωρεάν</span>
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </>
  );
}
