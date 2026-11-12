import type { Metadata } from "next";
import { getContent } from "@/lib/get-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";
import { ServiceDetailLayout } from "@/components/services/ServiceDetailLayout";

export const metadata: Metadata = {
  title: "Υπηρεσίες για Ξενοδοχεία | Ephtopia Cleans",
  description:
    "Εξειδικευμένο, πιστοποιημένο και πολύγλωσσο προσωπικό για ξενοδοχεία: καμαριέρες, καθαρισμός δωματίων, βαλές, λάντζα, μπουφές και σερβιτόροι.",
  alternates: {
    canonical: "/services/xenodoxeia",
  },
  openGraph: {
    title: "Υπηρεσίες για Ξενοδοχεία | Ephtopia Cleans",
    description:
      "Πλήρης κάλυψη ξενοδοχειακών μονάδων σε εξειδικευμένο και πιστοποιημένο προσωπικό.",
    url: "/services/xenodoxeia",
    type: "website",
    locale: "el_GR",
    siteName: "Ephtopia Cleans",
  },
};

export default async function HotelServicesPage() {
  const { siteContent } = await getContent();
  const pageContent = siteContent.hotelServicesPage;

  return (
    <>
      <Navbar siteContent={siteContent} />
      <ServiceDetailLayout
        eyebrow="Ξενοδοχειακές Μονάδες"
        title={pageContent.title}
        subtitle={pageContent.subtitle}
        items={pageContent.items}
        showQuickNav
        defaultIcon="Building2"
      />
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </>
  );
}
