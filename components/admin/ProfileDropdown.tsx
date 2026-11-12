'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Home,
  Building2,
  Users,
  History,
  ExternalLink,
  Loader2,
  User as UserIcon,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { logoutAction } from '@/app/actions/auth';

const SUPER_ADMIN_EMAIL = 'ebomponis@gmail.com';

interface ProfileDropdownProps {
  user: SupabaseUser;
  isSuperAdmin?: boolean;
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

  const isSuperAdmin = propIsSuperAdmin ?? user.email === SUPER_ADMIN_EMAIL;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const navItems = [
    { href: '/admin', label: 'Αρχική Dashboard', icon: LayoutDashboard },
    { href: '/admin/cleanings/airbnb', label: 'Καθαρισμοί Airbnb', icon: Home },
    { href: '/admin/cleanings/hotels', label: 'Καθαρισμοί Ξενοδοχείων', icon: Building2 },
    { href: '/admin/users', label: 'Διαχείριση Χρηστών', icon: Users },
    ...(isSuperAdmin ? [{ href: '/admin/history', label: 'Ιστορικό Αλλαγών', icon: History }] : []),
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={`flex items-center gap-2 min-h-10 px-2.5 sm:px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
          isOpen
            ? 'bg-warm-white border-navy/40 text-navy'
            : 'bg-white hover:bg-warm-white border-border text-navy'
        }`}
      >
        <UserIcon className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
        <div className="hidden sm:flex flex-col text-left max-w-[170px] min-w-0">
          <span className="text-xs font-semibold text-navy truncate leading-tight">
            {user.email}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted mt-0.5 leading-none">
            {isSuperAdmin ? 'Super Admin' : 'Διαχειριστής'}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-150 shrink-0 ${
            isOpen ? 'rotate-180 text-teal-dark' : ''
          }`}
          strokeWidth={1.75}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xs border border-border overflow-hidden z-50 divide-y divide-border"
        >
          <div className="p-4 bg-warm-white">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-navy font-heading">Ephtopia Cleans</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-border text-navy">
                {isSuperAdmin ? 'Super Admin' : 'Διαχειριστής'}
              </span>
            </div>
            <p className="text-xs text-muted truncate" title={user.email}>{user.email}</p>
          </div>

          <div className="p-1.5 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 min-h-10 px-3 py-2 rounded-lg text-xs font-semibold text-navy hover:bg-warm-white hover:text-teal-dark transition-colors"
                role="menuitem"
              >
                <item.icon className="w-4 h-4 text-muted shrink-0" strokeWidth={1.75} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="p-1.5 space-y-1">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between min-h-10 px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-navy hover:bg-warm-white transition-colors"
              role="menuitem"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                <span>Προβολή Ιστοσελίδας</span>
              </span>
              <span className="text-[10px] text-muted-light">↗</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isPending}
              className="flex items-center justify-between w-full min-h-10 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
              role="menuitem"
            >
              <span className="flex items-center gap-2.5">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" strokeWidth={1.75} />}
                <span>{isPending ? 'Αποσύνδεση...' : 'Αποσύνδεση'}</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
