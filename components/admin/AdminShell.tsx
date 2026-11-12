'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from '@/components/admin/Sidebar';
import { TopBar } from '@/components/admin/TopBar';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const SUPER_ADMIN_EMAIL = 'ebomponis@gmail.com';

interface AdminShellProps {
  user: SupabaseUser;
  children: React.ReactNode;
}

export function AdminShell({ user, children }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;
  const isEditorPage = !!pathname.match(/^\/admin\/(hero|problem|services|testimonials|pricing|faq|lead-form|footer)$/);
  const isCleaningsPage = pathname.startsWith('/admin/cleanings');
  const isWidePage = isEditorPage || isCleaningsPage;

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div id="admin-sidebar" className="no-print print:hidden">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} isSuperAdmin={isSuperAdmin} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0 w-full print:block print:overflow-visible print:w-full">
        <div id="admin-topbar" className="no-print print:hidden">
          <TopBar user={user} onMenuClick={() => setMobileOpen(true)} isSuperAdmin={isSuperAdmin} />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible print:bg-white print:block">
          <div className={`${isWidePage ? 'max-w-[1700px]' : 'max-w-4xl'} mx-auto w-full print:max-w-none print:w-full print:m-0 print:p-0`}>
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
