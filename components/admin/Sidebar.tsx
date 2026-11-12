'use client';

import { usePathname } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ADMIN_NAV_GROUPS } from '@/components/admin/navConfig';
import { SidebarNavContent } from '@/components/admin/SidebarNavContent';
import {
  subscribeSidebarGroups,
  getSidebarGroupsSnapshot,
  getSidebarGroupsServerSnapshot,
  persistSidebarGroups,
} from '@/components/admin/sidebarStorage';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  isSuperAdmin?: boolean;
}

export function Sidebar({ mobileOpen = false, onClose, isSuperAdmin = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [routeOverrides, setRouteOverrides] = useState<Record<string, boolean>>({});
  const [prevPathname, setPrevPathname] = useState(pathname);

  const storedGroups = useSyncExternalStore(
    subscribeSidebarGroups,
    getSidebarGroupsSnapshot,
    getSidebarGroupsServerSnapshot
  );

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    const activeGroup = ADMIN_NAV_GROUPS.find((g) =>
      g.items.some((i) =>
        i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`)
      )
    );
    if (activeGroup && !(storedGroups[activeGroup.label] ?? true)) {
      setRouteOverrides((prev) => ({ ...prev, [activeGroup.label]: true }));
    }
  }

  const openGroups: Record<string, boolean> = { ...storedGroups, ...routeOverrides };

  const toggleGroup = (label: string) => {
    const nextValue = !(openGroups[label] ?? true);
    const next = { ...openGroups, [label]: nextValue };
    setRouteOverrides((prev) => ({ ...prev, [label]: nextValue }));
    persistSidebarGroups(next);
  };

  return (
    <>
      <aside
        className={`relative hidden lg:flex flex-col h-full bg-white border-r border-border shrink-0 transition-[width] duration-200 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <SidebarNavContent
          showLabels={!collapsed}
          pathname={pathname}
          openGroups={openGroups}
          isSuperAdmin={isSuperAdmin}
          onToggleGroup={toggleGroup}
          onClose={onClose}
        />
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Επέκταση πλαϊνού μενού' : 'Σύμπτυξη πλαϊνού μενού'}
          className="absolute -right-3 top-14 w-6 h-6 rounded-md bg-white border border-border flex items-center justify-center text-muted hover:text-navy hover:border-navy/40 transition-colors z-10 cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {mobileOpen && (
        <aside className="fixed inset-y-0 left-0 z-40 flex flex-col w-full max-w-xs bg-white border-r border-border lg:hidden">
          <SidebarNavContent
            showLabels
            pathname={pathname}
            openGroups={openGroups}
            isSuperAdmin={isSuperAdmin}
            onToggleGroup={toggleGroup}
            onClose={onClose}
          />
        </aside>
      )}
    </>
  );
}
