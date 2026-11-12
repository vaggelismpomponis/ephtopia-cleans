import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Υπηρεσίες | Ephtopia Cleans — Καθαρισμός Airbnb",
  description:
    "Αναλυτικές πληροφορίες για τις υπηρεσίες μας: επαγγελματικός καθαρισμός, αλλαγή κλινοσκεπασμάτων, φωτογραφική τεκμηρίωση και αυτόματος συντονισμός για ιδιοκτήτες Airbnb.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Υπηρεσίες | Ephtopia Cleans — Καθαρισμός Airbnb",
    description:
      "Αναλυτικές πληροφορίες για τις υπηρεσίες μας: επαγγελματικός καθαρισμός, αλλαγή κλινοσκεπασμάτων, φωτογραφική τεκμηρίωση και αυτόματος συντονισμός.",
    url: "/services",
    type: "website",
    locale: "el_GR",
    siteName: "Ephtopia Cleans",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
