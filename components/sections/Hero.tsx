"use client";

import { ArrowRight, ArrowDownRight, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/get-content";
import { useLivePreview } from "@/components/LivePreviewProvider";

interface HeroProps {
  siteContent: SiteContent;
}

export default function Hero({ siteContent: initialContent }: HeroProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;

  const handleScrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="bg-white border-b border-border pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-36 lg:pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-4 block">
              Νέα υπηρεσία στην Ελλάδα
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy leading-[1.08] tracking-tight">
              {siteContent.hero.headline}{" "}
              <span className="text-teal-dark block sm:inline">
                {siteContent.hero.headlineAccent}
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted max-w-[52ch] leading-relaxed">
              {siteContent.hero.subheadline}
            </p>

            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
              <Link
                href="/services"
                className="w-full sm:w-auto min-h-12 px-6 py-3 rounded-lg border border-border bg-warm-white hover:bg-white hover:border-navy/40 text-navy text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2"
              >
                <span>{siteContent.hero.ctaSecondary}</span>
                <ArrowDownRight className="w-4 h-4 text-muted shrink-0" strokeWidth={1.75} />
              </Link>
              <button
                type="button"
                onClick={handleScrollToContact}
                className="w-full sm:w-auto min-h-12 px-6 py-3 rounded-lg bg-teal-dark hover:bg-navy text-white text-sm sm:text-base font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{siteContent.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0">
            <div className="relative aspect-[4/3] lg:aspect-[4/5] w-full rounded-xl overflow-hidden border border-border bg-warm-white">
              <Image
                src="/hero-room.png"
                alt="Καθαρό και τακτοποιημένο υπνοδωμάτιο Airbnb με φρέσκα λευκά σεντόνια"
                fill
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
                <span>Αθήνα &amp; Αττική</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
                <span>Έλεγχος 50+ σημείων &amp; Report</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
