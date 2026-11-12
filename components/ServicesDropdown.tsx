"use client";

import Link from "next/link";
import { ChevronDown, Layers, Home, Building2 } from "lucide-react";

export const SERVICE_SUB_ITEMS = [
  {
    label: "Όλες οι Υπηρεσίες",
    href: "/services",
    description: "Πλήρης κατάλογος & επισκόπηση",
    icon: Layers,
  },
  {
    label: "Υπηρεσίες για Airbnb",
    href: "/services/airbnb",
    description: "Καθαρισμός, σεντόνια & διαχείριση",
    icon: Home,
  },
  {
    label: "Υπηρεσίες για Ξενοδοχεία",
    href: "/services/xenodoxeia",
    description: "Καμαριέρες, λάντζα & εστίαση",
    icon: Building2,
  },
] as const;

interface ServicesDropdownProps {
  label: string;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}

export function ServicesDropdown({
  label,
  pathname,
  isOpen,
  onToggle,
  onOpen,
  onClose,
}: ServicesDropdownProps) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-1.5 min-h-10 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          isOpen
            ? "bg-warm-white text-navy"
            : "text-muted hover:text-navy hover:bg-warm-white"
        }`}
      >
        <span>{label}</span>
        <ChevronDown
          strokeWidth={1.75}
          className={`w-4 h-4 transition-transform duration-150 ${
            isOpen ? "rotate-180 text-teal-dark" : "text-muted-light"
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full pt-2 w-72 z-50">
          <div className="bg-white border border-border rounded-xl shadow-xs p-2 space-y-1">
            {SERVICE_SUB_ITEMS.map((subItem) => {
              const IconComponent = subItem.icon;
              const isActive = pathname === subItem.href;
              return (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  onClick={onClose}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-colors min-h-11 ${
                    isActive
                      ? "bg-warm-white text-teal-dark"
                      : "text-navy hover:bg-warm-white"
                  }`}
                >
                  <IconComponent
                    strokeWidth={1.75}
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      isActive ? "text-teal-dark" : "text-muted"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-snug">
                      {subItem.label}
                    </div>
                    <div className="text-xs text-muted leading-tight mt-0.5">
                      {subItem.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

