import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/sections/Footer";
import CookieNotice from "@/components/CookieNotice";
import { getContent } from "@/lib/get-content";

export const metadata: Metadata = {
  title: "Καριέρα | Ephtopia Cleans — Θέσεις Εργασίας",
  description:
    "Δείτε τις ανοιχτές θέσεις εργασίας στην Ephtopia Cleans. Γίνετε μέλος της ομάδας μας και βοηθήστε να κάνουμε τα Airbnb καθαρά και ασφαλή.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    title: "Καριέρα | Ephtopia Cleans",
    description: "Ανοιχτές θέσεις εργασίας στην Ephtopia Cleans.",
    url: "/careers",
    siteName: "Ephtopia Cleans",
    type: "website",
    locale: "el_GR",
  },
  robots: { index: true, follow: true },
};

export default async function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteContent } = await getContent();
  return (
    <>
      <Navbar siteContent={siteContent} />
      <main>{children}</main>
      <Footer siteContent={siteContent} />
      <CookieNotice />
    </>
  );
}
