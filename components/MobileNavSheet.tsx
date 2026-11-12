"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import type { SiteContent } from "@/lib/get-content";
import Logo from "@/components/Logo";
import { SERVICE_SUB_ITEMS } from "@/components/ServicesDropdown";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MobileNavSheetProps {
  siteContent: SiteContent;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobileServicesOpen: boolean;
  onToggleMobileServices: () => void;
  onNavClick: (href: string) => void;
}

export function MobileNavSheet({
  siteContent,
  isOpen,
  onOpenChange,
  isMobileServicesOpen,
  onToggleMobileServices,
  onNavClick,
}: MobileNavSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger
        className="md:hidden inline-flex items-center justify-center min-h-11 min-w-11 rounded-lg text-navy hover:bg-warm-white transition-colors cursor-pointer"
        aria-label="Άνοιγμα μενού πλοήγησης"
      >
        <Menu className="w-5 h-5" strokeWidth={1.75} />
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full max-w-xs p-0 flex flex-col border-l border-border bg-white"
      >
        <SheetTitle className="sr-only">Μενού Πλοήγησης</SheetTitle>
        <div className="flex flex-col pt-12 px-6 pb-8 gap-1 overflow-y-auto">
          <div className="pb-5 mb-2 border-b border-border">
            <Logo brandName={siteContent.brand.name} size="sm" theme="light" />
          </div>

          {siteContent.nav.links.map((link) => {
            if (link.href === "/services") {
              return (
                <div key={link.href} className="border-b border-border py-1">
                  <button
                    type="button"
                    onClick={onToggleMobileServices}
                    aria-expanded={isMobileServicesOpen}
                    className="w-full flex items-center justify-between min-h-11 py-2 text-left text-base font-medium text-navy hover:text-teal-dark transition-colors cursor-pointer"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      strokeWidth={1.75}
                      className={`w-4 h-4 text-muted transition-transform duration-150 ${
                        isMobileServicesOpen ? "rotate-180 text-teal-dark" : ""
                      }`}
                    />
                  </button>
                  {isMobileServicesOpen && (
                    <div className="pl-3 pb-2 space-y-1">
                      {SERVICE_SUB_ITEMS.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => onOpenChange(false)}
                          className="flex items-center gap-2.5 min-h-10 text-sm font-medium text-muted hover:text-teal-dark py-1.5"
                        >
                          <sub.icon className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.href.startsWith("#")) {
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => onNavClick(link.href)}
                  className="text-left min-h-11 py-3 text-base font-medium text-navy hover:text-teal-dark transition-colors border-b border-border cursor-pointer"
                >
                  {link.label}
                </button>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => onOpenChange(false)}
                className="flex items-center min-h-11 py-3 text-base font-medium text-navy hover:text-teal-dark transition-colors border-b border-border"
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-6">
            <button
              type="button"
              onClick={() => onNavClick("#contact")}
              className="w-full min-h-11 bg-teal-dark hover:bg-navy text-white font-semibold py-3 px-4 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {siteContent.nav.cta}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

