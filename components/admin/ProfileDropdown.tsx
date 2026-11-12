'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  ChevronDown,
  ShieldCheck,
  Shield,
  LayoutDashboard,
  Home,
  Building2,
  Users,
  History,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { logoutAction } from '@/app/actions/auth';

const SUPER_ADMIN_EMAIL = 'ebomponis@gmail.com';

interface ProfileDropdownProps {
  user: SupabaseUser;
  isSuperAdmin?: boolean;
}

function getInitials(email?: string, name?: string): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (!email) return 'AD';
  if (email.toLowerCase().includes('ephtopia')) return 'EC';
  const clean = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  return (clean.slice(0, 2) || 'AD').toUpperCase();
}

function formatRelativeTime(iso?: string | null): string | null {
  if (!iso) return null;
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('el-GR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return null;
  }
}

export function ProfileDropdown({ user, isSuperAdmin: propIsSuperAdmin }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  const isSuperAdmin = propIsSuperAdmin ?? (user.email === SUPER_ADMIN_EMAIL);
  const initials = getInitials(user.email, user.user_metadata?.full_name || user.user_metadata?.name);
  const lastSignInFormatted = formatRelativeTime(user.last_sign_in_at);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* ── PROFILE TRIGGER BUTTON ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`group flex items-center gap-2 sm:gap-2.5 p-1 sm:py-1.5 sm:px-2.5 sm:pr-3 rounded-2xl border transition-all cursor-pointer focus:outline-none ${
          isOpen
            ? 'bg-slate-100 border-teal/40 ring-2 ring-teal/20 shadow-xs'
            : 'bg-white hover:bg-slate-50/80 border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
        }`}
      >
        {/* Avatar badge with online indicator */}
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-gradient-to-br from-navy to-navy-light text-white font-extrabold text-xs flex items-center justify-center tracking-wider shadow-inner ring-1 ring-white/20">
            {initials}
          </div>
          {/* Active online dot */}
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal rounded-full ring-2 ring-white"
            title="Ενεργός"
          />
        </div>

        {/* User Info (Desktop / Tablet) */}
        <div className="hidden sm:flex flex-col text-left max-w-[140px] md:max-w-[170px] min-w-0">
          <span className="text-xs font-bold text-slate-800 truncate font-heading leading-tight group-hover:text-navy transition-colors">
            {user.email}
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 flex items-center gap-1">
            {isSuperAdmin ? (
              <span className="text-amber-600 font-semibold">Super Admin</span>
            ) : (
              <span className="text-teal font-semibold">Διαχειριστής</span>
            )}
          </span>
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-teal' : ''
          }`}
        />
      </button>

      {/* ── DROPDOWN MENU ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            aria-orientation="vertical"
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden z-50 divide-y divide-slate-100"
          >
            {/* 1. Header Profile Summary Card */}
            <div className="p-4 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40">
              <div className="flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-navy via-navy-light to-slate-800 text-white font-extrabold text-sm flex items-center justify-center tracking-wider shadow-sm ring-2 ring-teal/20">
                    {initials}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal rounded-full ring-2 ring-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 font-heading truncate">
                      Ephtopia Cleans
                    </span>
                    {isSuperAdmin ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        Super Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal/10 text-teal border border-teal/20">
                        <Shield className="w-3 h-3 text-teal" />
                        Διαχειριστής
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5" title={user.email}>
                    {user.email}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-teal" />
                    <span>Κατάσταση:</span>
                    <strong className="text-slate-600 font-semibold">Συνδεδεμένος</strong>
                    {lastSignInFormatted && (
                      <span className="text-slate-400 truncate">· {lastSignInFormatted}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Quick Navigation Links */}
            <div className="p-2 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Γρήγορη Πλοήγηση
              </div>

              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal/10 group-hover:text-teal flex items-center justify-center text-slate-500 transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </div>
                <span>Αρχική Dashboard</span>
              </Link>

              <Link
                href="/admin/cleanings/airbnb"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal/10 group-hover:text-teal flex items-center justify-center text-slate-500 transition-colors">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <span>Καθαρισμοί Airbnb</span>
              </Link>

              <Link
                href="/admin/cleanings/hotels"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal/10 group-hover:text-teal flex items-center justify-center text-slate-500 transition-colors">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span>Καθαρισμοί Ξενοδοχείων</span>
              </Link>

              <Link
                href="/admin/users"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors group"
                role="menuitem"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-teal/10 group-hover:text-teal flex items-center justify-center text-slate-500 transition-colors">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <span>Διαχείριση Χρηστών</span>
              </Link>

              {isSuperAdmin && (
                <Link
                  href="/admin/history"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-navy hover:bg-slate-50 transition-colors group"
                  role="menuitem"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center transition-colors">
                    <History className="w-3.5 h-3.5" />
                  </div>
                  <span>Ιστορικό Αλλαγών (Super Admin)</span>
                </Link>
              )}
            </div>

            {/* 3. External Link to Public Website */}
            <div className="p-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-50 transition-colors group"
                role="menuitem"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  <span>Προβολή Ιστοσελίδας</span>
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-slate-500">Νέα καρτέλα ↗</span>
              </Link>
            </div>

            {/* 4. Logout Action */}
            <div className="p-2 bg-slate-50/50">
              <button
                type="button"
                onClick={handleLogout}
                disabled={isPending}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer disabled:opacity-50 group"
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
                  )}
                  <span>{isPending ? 'Αποσύνδεση...' : 'Αποσύνδεση'}</span>
                </div>
                <span className="text-[10px] text-rose-400 font-normal">Έξοδος</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
