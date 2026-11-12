'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import { SUPER_ADMIN_EMAIL } from '@/components/admin/navConfig';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AdminShellProps {
  user: SupabaseUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

  const isEditorPage = !!pathname.match(
    /^\/admin\/(hero|problem|services|testimonials|pricing|faq|lead-form|footer)$/
  );
  const isCleaningsPage = pathname.startsWith('/admin/cleanings');
  const isOverviewPage = pathname === '/admin';

  const containerMaxWidth =
    isEditorPage
      ? 'max-w-[1700px]'
      : isOverviewPage || isCleaningsPage
      ? 'max-w-7xl'
      : 'max-w-5xl';

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-navy/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div id="admin-sidebar" className="no-print print:hidden">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isSuperAdmin={isSuperAdmin}
        />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0 w-full print:block print:overflow-visible print:w-full">
        <div id="admin-topbar" className="no-print print:hidden">
          <TopBar user={user} onMenuClick={() => setMobileOpen(true)} isSuperAdmin={isSuperAdmin} />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible print:bg-white print:block">
          <div className={`${containerMaxWidth} mx-auto w-full print:max-w-none print:w-full print:m-0 print:p-0`}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
