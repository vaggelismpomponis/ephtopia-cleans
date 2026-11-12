"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { SiteContent } from "@/lib/get-content";
import Logo from "@/components/Logo";
import { ServicesDropdown } from "@/components/ServicesDropdown";
import { MobileNavSheet } from "@/components/MobileNavSheet";

interface NavbarProps {
  siteContent: SiteContent;
}

export default function Navbar({ siteContent }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setIsServicesOpen(false);
    if (!href.startsWith("#")) return;

    if (pathname === "/") {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/${href}`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 border-b ${
        isScrolled ? "bg-white border-border" : "bg-white/95 border-border/60"
      }`}
    >
      <nav
        aria-label="Κύρια πλοήγηση"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Link
            href="/"
            className="flex items-center shrink-0 min-h-10"
            onClick={() => {
              setIsOpen(false);
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Logo brandName={siteContent.brand.name} size="md" theme="light" />
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {siteContent.nav.links.map((link) => {
              if (link.href === "/services") {
                return (
                  <ServicesDropdown
                    key={link.href}
                    label={link.label}
                    pathname={pathname}
                    isOpen={isServicesOpen}
                    onToggle={() => setIsServicesOpen((prev) => !prev)}
                    onOpen={() => setIsServicesOpen(true)}
                    onClose={() => setIsServicesOpen(false)}
                  />
                );
              }

              if (link.href.startsWith("#")) {
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => handleNavClick(link.href)}
                    className="min-h-10 px-3 rounded-lg text-sm font-medium text-muted hover:text-navy hover:bg-warm-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center min-h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-navy bg-warm-white"
                      : "text-muted hover:text-navy hover:bg-warm-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="w-px h-5 mx-2 bg-border" aria-hidden="true" />

            <button
              type="button"
              onClick={() => handleNavClick("#contact")}
              className="min-h-10 bg-teal-dark hover:bg-navy text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap"
            >
              {siteContent.nav.cta}
            </button>
          </div>

          <MobileNavSheet
            siteContent={siteContent}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            isMobileServicesOpen={isMobileServicesOpen}
            onToggleMobileServices={() => setIsMobileServicesOpen((prev) => !prev)}
            onNavClick={handleNavClick}
          />
        </div>
      </nav>
    </header>
  );
}
