'use client';

import { Menu } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ProfileDropdown } from '@/components/admin/ProfileDropdown';

interface TopBarProps {
  user: SupabaseUser;
  sectionTitle?: string;
  onMenuClick?: () => void;
  isSuperAdmin?: boolean;
}

export function TopBar({ user, sectionTitle, onMenuClick, isSuperAdmin }: TopBarProps) {
  return (
    <header className="h-16 sm:h-[72px] border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-6 bg-white shrink-0 shadow-xs w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-slate-800 font-extrabold text-sm sm:text-base font-heading leading-tight truncate">
            {sectionTitle ?? 'Dashboard'}
          </h1>
          <p className="text-slate-400 text-[10px] sm:text-xs truncate">Ephtopia Cleans · Διαχείριση</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Profile Avatar & Interactive Dropdown Menu */}
        <ProfileDropdown user={user} isSuperAdmin={isSuperAdmin} />
      </div>
    </header>
  );
}
