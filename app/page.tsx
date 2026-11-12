import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Services from "@/components/sections/Services";
import CompanyOverview from "@/components/sections/CompanyOverview";
import FAQ from "@/components/sections/FAQ";
import LeadForm from "@/components/sections/LeadForm";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";
import { getContent } from "@/lib/get-content";
import { LivePreviewProvider } from "@/components/LivePreviewProvider";

export const metadata: Metadata = {
  title: "Καθαρισμός Airbnb & Κλινοσκεπάσματα | Ephtopia Cleans",
  description:
    "Επαγγελματικός καθαρισμός Airbnb, αλλαγή κλινοσκεπασμάτων και φωτογραφική τεκμηρίωση σε Αθήνα & Αττική. Πιστοποιημένο προσωπικό και αυτόματος συντονισμός.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Καθαρισμός Airbnb & Κλινοσκεπάσματα | Ephtopia Cleans",
    description:
      "Επαγγελματικός καθαρισμός Airbnb και αλλαγή κλινοσκεπασμάτων με πιστοποιημένο προσωπικό στην Αθήνα και Αττική.",
    url: "/",
    siteName: "Ephtopia Cleans",
    locale: "el_GR",
    type: "website",
  },
};

export default async function Home() {
  const { siteContent, faqItems, pricingTiers } = await getContent();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <LivePreviewProvider
      initialContent={siteContent}
      initialFaqItems={faqItems}
      initialPricingTiers={pricingTiers}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar siteContent={siteContent} />
      <main>
        <Hero siteContent={siteContent} />
        <Problem siteContent={siteContent} />
        <Services siteContent={siteContent} />
        <CompanyOverview siteContent={siteContent} />
        <FAQ siteContent={siteContent} faqItems={faqItems} />
        <LeadForm siteContent={siteContent} />
      </main>
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </LivePreviewProvider>
  );
}
