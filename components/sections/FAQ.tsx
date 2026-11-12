"use client";

import { ArrowRight } from "lucide-react";
import type { SiteContent, FAQItem } from "@/lib/get-content";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLivePreview } from "@/components/LivePreviewProvider";

interface FAQProps {
  siteContent: SiteContent;
  faqItems: FAQItem[];
}

export default function FAQ({
  siteContent: initialContent,
  faqItems: initialFaq,
}: FAQProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;
  const faqItems = preview?.faqItems || initialFaq;

  const handleScrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="faq"
      className="bg-white py-12 md:py-20 lg:py-24 border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 min-w-0">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-3 block">
              {siteContent.faq.sectionLabel}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy leading-tight">
              {siteContent.faq.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted leading-relaxed">
              Δεν βρήκατε αυτό που ψάχνετε; Μιλήστε απευθείας με την ομάδα μας.
            </p>
            <button
              type="button"
              onClick={handleScrollToContact}
              className="mt-4 inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-teal-dark hover:text-navy transition-colors cursor-pointer"
            >
              <span>Επικοινωνήστε μαζί μας</span>
              <ArrowRight className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            </button>
          </div>

          <div className="lg:col-span-8 min-w-0">
            <div className="rounded-xl border border-border bg-warm-white overflow-hidden">
              <Accordion className="divide-y divide-border">
                {faqItems.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border-0 px-5 sm:px-6"
                  >
                    <AccordionTrigger className="py-5 min-h-11 text-left text-base font-semibold text-navy hover:text-teal-dark hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm sm:text-[15px] text-muted leading-relaxed max-w-[65ch]">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
