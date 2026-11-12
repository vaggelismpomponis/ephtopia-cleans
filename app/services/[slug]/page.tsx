import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteContent as staticContent } from "@/lib/content";
import { getContent, type SiteContent } from "@/lib/get-content";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";
import { ServiceDetailLayout } from "@/components/services/ServiceDetailLayout";
import type { ServiceDetailItem } from "@/components/services/ServiceSectionBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function normalizeServiceItems(content: SiteContent): ServiceDetailItem[] {
  const topLevelItems: ServiceDetailItem[] = content.servicesPage.items.map(
    (item) => ({
      slug: item.slug,
      icon: item.icon,
      title: item.title,
      tagline: item.tagline,
      description: item.description,
      howItWorks: item.howItWorks,
      features: item.features.map((f) =>
        typeof f === "string" ? { title: f } : f
      ),
    })
  );

  return [
    ...topLevelItems,
    ...content.airbnbServicesPage.items,
    ...content.hotelServicesPage.items,
  ];
}

export async function generateStaticParams() {
  return normalizeServiceItems(staticContent).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { siteContent } = await getContent();
  const service = normalizeServiceItems(siteContent).find(
    (item) => item.slug === slug
  );

  if (!service) {
    return { title: "Υπηρεσία | Ephtopia Cleans" };
  }

  return {
    title: `${service.title} | Ephtopia Cleans`,
    description: service.description.slice(0, 155),
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | Ephtopia Cleans`,
      description: service.tagline || service.description.slice(0, 155),
      url: `/services/${service.slug}`,
      type: "website",
      locale: "el_GR",
      siteName: "Ephtopia Cleans",
    },
  };
}

export default async function SingleServicePage({ params }: PageProps) {
  const { slug } = await params;
  const { siteContent } = await getContent();
  const service = normalizeServiceItems(siteContent).find(
    (item) => item.slug === slug
  );

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar siteContent={siteContent} />
      <ServiceDetailLayout
        eyebrow="Αναλυτική Υπηρεσία"
        title={service.title}
        tagline={service.tagline}
        subtitle={service.description}
        items={[service]}
        heroCtaLabel="Ζητήστε Προσφορά"
      />
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </>
  );
}
