'use client';

import Link from 'next/link';
import { ChevronDown, ExternalLink, X } from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import {
  ADMIN_HOME_ITEM,
  ADMIN_NAV_GROUPS,
  SUPER_ADMIN_NAV_ITEM,
  type AdminNavItem,
} from '@/components/admin/navConfig';

interface SidebarNavContentProps {
  showLabels: boolean;
  pathname: string;
  openGroups: Record<string, boolean>;
  isSuperAdmin: boolean;
  onToggleGroup: (label: string) => void;
  onClose?: () => void;
}

function isRouteActive(pathname: string, href: string, exact?: boolean): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

function NavItemLink({ item, pathname, showLabels }: { item: AdminNavItem; pathname: string; showLabels: boolean }) {
  const active = isRouteActive(pathname, item.href, item.exact);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={!showLabels ? item.label : undefined}
      className={`flex items-center gap-3 min-h-10 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-warm-white text-teal-dark border border-border font-semibold'
          : 'text-muted hover:text-navy hover:bg-warm-white border border-transparent'
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-dark' : 'text-muted'}`} strokeWidth={1.75} />
      {showLabels && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function SidebarNavContent({ showLabels, pathname, openGroups, isSuperAdmin, onToggleGroup, onClose }: SidebarNavContentProps) {
  return (
    <>
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0 overflow-hidden">
        <LogoIcon size="sm" />
        {showLabels && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-navy font-heading leading-tight">
              Ephtopia <span className="text-teal-dark">Cleans</span>
            </div>
            <div className="text-[11px] text-muted font-medium">Enterprise Admin</div>
          </div>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto lg:hidden min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg text-muted hover:text-navy hover:bg-warm-white transition-colors cursor-pointer"
            aria-label="Κλείσιμο μενού"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      <nav aria-label="Πλοήγηση διαχείρισης" className="flex-1 px-2.5 py-4 overflow-y-auto space-y-5">
        <NavItemLink item={ADMIN_HOME_ITEM} pathname={pathname} showLabels={showLabels} />

        {ADMIN_NAV_GROUPS.map((group) => {
          const isExpanded = openGroups[group.label] ?? true;
          return (
            <div key={group.label}>
              {showLabels ? (
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.label)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between px-3 py-1.5 mb-1 text-[11px] font-bold text-muted-light hover:text-navy uppercase tracking-widest cursor-pointer"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isExpanded ? '' : '-rotate-90'}`} strokeWidth={1.75} />
                </button>
              ) : (
                <div className="mx-2 mb-2 border-t border-border" />
              )}

              {(isExpanded || !showLabels) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavItemLink key={item.href} item={item} pathname={pathname} showLabels={showLabels} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isSuperAdmin && (
          <div>
            {showLabels ? (
              <div className="px-3 py-1.5 mb-1 text-[11px] font-bold text-muted-light uppercase tracking-widest">Σύστημα</div>
            ) : (
              <div className="mx-2 mb-2 border-t border-border" />
            )}
            <NavItemLink item={SUPER_ADMIN_NAV_ITEM} pathname={pathname} showLabels={showLabels} />
          </div>
        )}
      </nav>

      <div className="p-2.5 border-t border-border">
        <Link
          href="/"
          target="_blank"
          title={!showLabels ? 'Προβολή Site' : undefined}
          className="flex items-center gap-3 min-h-10 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-navy hover:bg-warm-white transition-colors"
        >
          <ExternalLink className="w-4 h-4 shrink-0" strokeWidth={1.75} />
          {showLabels && <span>Προβολή Site</span>}
        </Link>
      </div>
    </>
  );
}
