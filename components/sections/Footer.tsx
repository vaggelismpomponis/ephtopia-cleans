"use client";

import { Mail, Phone, PhoneCall, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import type { SiteContent } from "@/lib/get-content";
import Logo from "@/components/Logo";
import { useLivePreview } from "@/components/LivePreviewProvider";

interface FooterProps {
  siteContent: SiteContent;
}

export default function Footer({ siteContent: initialContent }: FooterProps) {
  const preview = useLivePreview();
  const siteContent = preview?.siteContent || initialContent;

  const linkGroups = [
    siteContent.footer.columns.service,
    siteContent.footer.columns.coverage,
    siteContent.footer.columns.legal,
  ];

  return (
    <footer className="bg-navy text-slate-300 border-t border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <div className="mb-4">
              <Logo brandName={siteContent.brand.name} theme="dark" size="md" />
            </div>
            <p className="text-sm leading-relaxed text-slate-300 max-w-xs">
              {siteContent.footer.description}
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title} className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                {group.title}
              </p>
              <ul className="space-y-1.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        className="inline-flex items-center min-h-9 text-sm text-white hover:text-teal-light transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-flex items-center min-h-9 text-sm text-white hover:text-teal-light transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              {siteContent.footer.contact.title}
            </p>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${siteContent.footer.contact.email}`}
                  className="inline-flex items-center gap-2 min-h-9 text-sm text-white hover:text-teal-light transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-teal shrink-0" strokeWidth={1.75} />
                  <span>{siteContent.footer.contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteContent.footer.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 min-h-9 text-sm text-white hover:text-teal-light transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-teal shrink-0" strokeWidth={1.75} />
                  <span>{siteContent.footer.contact.phone}</span>
                </a>
              </li>
              {siteContent.footer.contact.landline && (
                <li>
                  <a
                    href={`tel:${siteContent.footer.contact.landline.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 min-h-9 text-sm text-white hover:text-teal-light transition-colors tabular-nums"
                  >
                    <PhoneCall className="w-4 h-4 text-teal shrink-0" strokeWidth={1.75} />
                    <span>{siteContent.footer.contact.landline}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span suppressHydrationWarning>{siteContent.brand.copyright}</span>
            <span className="text-slate-500" aria-hidden="true">
              ·
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 min-h-9 text-slate-300 hover:text-teal-light transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
              <span>Admin Dashboard</span>
            </Link>
          </div>

          <p className="text-xs text-slate-300">
            Σχεδιασμός &amp; Υλοποίηση:{" "}
            <a
              className="text-teal-light hover:text-white transition-colors"
              href="https://ebomponis.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vaggelis Bomponis
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
