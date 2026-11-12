'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ExternalLink } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ProfileDropdown } from '@/components/admin/ProfileDropdown';
import { getAdminRouteMeta } from '@/components/admin/navConfig';

interface TopBarProps {
  user: SupabaseUser;
  onMenuClick?: () => void;
  isSuperAdmin?: boolean;
}

export function TopBar({ user, onMenuClick, isSuperAdmin }: TopBarProps) {
  const pathname = usePathname();
  const { group, title } = getAdminRouteMeta(pathname);

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-white shrink-0 w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center min-h-10 min-w-10 rounded-lg text-muted hover:text-navy hover:bg-warm-white transition-colors shrink-0 cursor-pointer"
          aria-label="Άνοιγμα μενού"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="truncate">{group}</span>
            <span aria-hidden="true">/</span>
            <span className="text-teal-dark font-semibold truncate">{title}</span>
          </div>
          <h1 className="text-navy font-bold text-sm sm:text-base font-heading leading-tight truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 min-h-9 px-3 rounded-lg border border-border bg-warm-white hover:bg-white hover:border-navy/40 text-xs font-semibold text-navy transition-colors"
        >
          <span>Ιστοσελίδα</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted" strokeWidth={1.75} />
        </Link>
        <ProfileDropdown user={user} isSuperAdmin={isSuperAdmin} />
      </div>
    </header>
  );
}
