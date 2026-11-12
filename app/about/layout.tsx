import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ποιοι Είμαστε | Ephtopia Cleans — Καθαρισμός Airbnb",
  description:
    "Μάθετε για την Ephtopia Cleans — μια ελληνική εταιρεία που εξειδικεύεται στη διαχείριση ανθρώπινου δυναμικού, επαγγελματικών εγκαταστάσεων και καθαρισμού για ιδιοκτήτες Airbnb.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "Ποιοι Είμαστε | Ephtopia Cleans",
    description:
      "Αξιόπιστη ελληνική εταιρεία καθαρισμού Airbnb με πιστοποιημένο προσωπικό, φωτογραφική τεκμηρίωση και πλήρη συμμόρφωση με τη νομοθεσία.",
    url: "/about",
    type: "website",
    locale: "el_GR",
    siteName: "Ephtopia Cleans",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
