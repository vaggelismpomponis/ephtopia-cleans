'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Star,
  HelpCircle,
  FileText,
  Tag,
  Mail,
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink,
  X,
  History,
  Briefcase,
  UserCheck,
  Home,
  Building2,
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

const navGroups = [
  {
    label: 'Καθαρισμοί',
    items: [
      { href: '/admin/cleanings/airbnb', label: 'Airbnb', icon: Home },
      { href: '/admin/cleanings/hotels', label: 'Ξενοδοχεία', icon: Building2 },
      { href: '/admin/cleanings/clients', label: 'Πελάτες', icon: Users },
    ],
  },
  {
    label: 'Περιεχόμενο',
    items: [
      { href: '/admin', label: 'Αρχική', icon: LayoutDashboard, exact: true },
      { href: '/admin/hero', label: 'Hero', icon: Star },
      { href: '/admin/problem', label: 'Πρόβλημα', icon: Layers },
      { href: '/admin/services', label: 'Υπηρεσίες', icon: FileText },
      { href: '/admin/testimonials', label: 'Αξιολογήσεις', icon: Users },
      { href: '/admin/pricing', label: 'Τιμολόγηση', icon: Tag },
      { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
      { href: '/admin/lead-form', label: 'Φόρμα', icon: Mail },
      { href: '/admin/footer', label: 'Footer', icon: Layers },
    ],
  },
  {
    label: 'Λειτουργίες',
    items: [
      { href: '/admin/jobs', label: 'Αγγελίες', icon: Briefcase },
      { href: '/admin/applications', label: 'Αιτήσεις CV', icon: UserCheck },
      { href: '/admin/users', label: 'Χρήστες', icon: UserPlus },
    ],
  },
];

/** Super-admin-only nav item */
const superAdminNavItem = {
  href: '/admin/history',
  label: 'Ιστορικό',
  icon: History,
};

interface SidebarProps {
  /** Mobile drawer open state (controlled by AdminShell) */
  mobileOpen?: boolean;
  /** Called when the mobile drawer should close */
  onClose?: () => void;
  /** Whether the current user is the super-admin (ebomponis@gmail.com) */
  isSuperAdmin?: boolean;
}

export function Sidebar({ mobileOpen = false, onClose, isSuperAdmin = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const navContent = (showLabels: boolean) => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 min-h-[72px] overflow-hidden">
        <LogoIcon size="sm" />
        <AnimatePresence>
          {showLabels && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm font-bold text-slate-800 font-heading leading-tight flex items-center gap-1">
                <span>Ephtopia</span>
                <span className="text-teal font-extrabold">Cleans</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Πίνακας Διαχείρισης</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <div className="space-y-6">
          {navGroups.map((group, idx) => (
            <div key={group.label}>
              {showLabels ? (
                <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.label}
                </div>
              ) : (
                idx > 0 && <div className="mx-3 mb-2 border-t border-slate-100" />
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={!showLabels ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                        active
                          ? 'bg-teal/10 text-teal border border-teal/25'
                          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Icon
                        className={`shrink-0 ${active ? 'text-teal' : 'text-slate-400 group-hover:text-slate-600'}`}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <AnimatePresence>
                        {showLabels && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Super-admin only: History */}
          {isSuperAdmin && (() => {
            const item = superAdminNavItem;
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <div>
                {showLabels ? (
                  <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Σύστημα
                  </div>
                ) : (
                  <div className="mx-3 mb-2 border-t border-slate-100" />
                )}
                <Link
                  key={item.href}
                  href={item.href}
                  title={!showLabels ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? 'bg-teal/10 text-teal border border-teal/25'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`shrink-0 ${active ? 'text-teal' : 'text-slate-400 group-hover:text-slate-600'}`}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <AnimatePresence>
                    {showLabels && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </div>
            );
          })()}
        </div>
      </nav>

      {/* Preview site link */}
      <div className="px-2 pb-2">
        <Link
          href="/"
          target="_blank"
          title={!showLabels ? 'Preview Site' : undefined}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all group"
        >
          <ExternalLink style={{ width: '18px', height: '18px' }} className="shrink-0 text-slate-400 group-hover:text-slate-600" />
          <AnimatePresence>
            {showLabels && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                Προεπισκόπηση
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (lg+) ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative hidden lg:flex flex-col h-full bg-white border-r border-slate-200 shrink-0 shadow-sm"
      >
        {navContent(!collapsed)}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[72px] translate-y-4 w-6 h-6 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center text-slate-500 hover:text-teal hover:border-teal/50 hover:bg-teal/5 transition-all z-10 shadow-md"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* ── Mobile drawer (< lg) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-white border-r border-slate-200 shadow-xl lg:hidden"
          >
            {navContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
