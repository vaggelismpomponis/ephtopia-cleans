import type { Metadata } from "next";
import { Manrope, Source_Sans_3, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "greek"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "greek"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ephtopia-cleans.gr"),
  title: "Καθαρισμός Airbnb | Ephtopia Cleans — Χωρίς Στρες",
  description:
    "Επαγγελματικός καθαρισμός Airbnb και αλλαγή κλινοσκεπασμάτων στην Ελλάδα. Εξειδικευμένο προσωπικό, φωτογραφική τεκμηρίωση, αυτόματος συντονισμός.",
  keywords: [
    "Airbnb καθαρισμός",
    "κλινοσκεπάσματα",
    "property management Ελλάδα",
    "turnover cleaning",
    "πιστοποιημένο προσωπικό",
    "καθαρισμός καταλύματος",
  ],
  authors: [{ name: "Ephtopia Cleans" }],
  openGraph: {
    title: "Καθαρισμός Airbnb | Ephtopia Cleans",
    description:
      "Επαγγελματικός καθαρισμός & αλλαγή κλινοσκεπασμάτων με πιστοποιημένο προσωπικό. Μία υπηρεσία. Μηδέν στρες.",
    type: "website",
    locale: "el_GR",
    siteName: "Ephtopia Cleans",
  },
  twitter: {
    card: "summary_large_image",
    title: "Καθαρισμός Airbnb | Ephtopia Cleans",
    description:
      "Επαγγελματικός καθαρισμός & αλλαγή κλινοσκεπασμάτων με πιστοποιημένο προσωπικό. Μία υπηρεσία. Μηδέν στρες.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ephtopia Cleans",
    description:
      "Επαγγελματικός καθαρισμός και αλλαγή κλινοσκεπασμάτων για ιδιοκτήτες Airbnb στην Αθήνα & Αττική.",
    url: "https://ephtopia-cleans.gr",
    areaServed: [
      { "@type": "City", name: "Αθήνα" },
      { "@type": "AdministrativeArea", name: "Αττική" },
    ],
    serviceType: ["Cleaning Service", "Property Protection"],
    priceRange: "€35 - €149",
  };

  return (
    <html
      lang="el"
      className={cn("antialiased", manrope.variable, sourceSans.variable, "font-sans", geist.variable)}
    >
      <head>
        <script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
