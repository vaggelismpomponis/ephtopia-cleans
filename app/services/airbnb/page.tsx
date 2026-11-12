import type { Metadata } from "next";
import { getContent } from "@/lib/get-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";
import { ServiceDetailLayout } from "@/components/services/ServiceDetailLayout";

export const metadata: Metadata = {
  title: "Υπηρεσίες για Airbnb | Ephtopia Cleans",
  description:
    "Ολοκληρωμένες λύσεις καθαρισμού Airbnb, αλλαγής κλινοσκεπασμάτων, φωτογραφικής τεκμηρίωσης πριν/μετά και πλήρους διαχείρισης turnover στην Αττική.",
  alternates: {
    canonical: "/services/airbnb",
  },
  openGraph: {
    title: "Υπηρεσίες για Airbnb | Ephtopia Cleans",
    description:
      "Καθαρισμός, αλλαγή κλινοσκεπασμάτων και φωτογραφική τεκμηρίωση για καταλύματα βραχυχρόνιας μίσθωσης.",
    url: "/services/airbnb",
    type: "website",
    locale: "el_GR",
    siteName: "Ephtopia Cleans",
  },
};

export default async function AirbnbServicesPage() {
  const { siteContent } = await getContent();
  const pageContent = siteContent.airbnbServicesPage;

  return (
    <>
      <Navbar siteContent={siteContent} />
      <ServiceDetailLayout
        eyebrow="Airbnb & Βραχυχρόνιες Μισθώσεις"
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        items={pageContent.items}
        showQuickNav
        defaultIcon="BrushCleaning"
      />
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </>
  );
}
