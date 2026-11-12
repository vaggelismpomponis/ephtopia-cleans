import {
  LayoutDashboard,
  Star,
  HelpCircle,
  FileText,
  Tag,
  Mail,
  Users,
  UserPlus,
  Layers,
  History,
  Briefcase,
  UserCheck,
  Home,
  Building2,
  type LucideIcon,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const SUPER_ADMIN_EMAIL = 'ebomponis@gmail.com';

export const ADMIN_HOME_ITEM: AdminNavItem = {
  href: '/admin',
  label: 'Επισκόπηση',
  icon: LayoutDashboard,
  exact: true,
};

export const ADMIN_CMS_ITEMS: AdminNavItem[] = [
  { href: '/admin/hero', label: 'Hero', icon: Star },
  { href: '/admin/problem', label: 'Πρόβλημα', icon: Layers },
  { href: '/admin/services', label: 'Υπηρεσίες', icon: FileText },
  { href: '/admin/testimonials', label: 'Αξιολογήσεις', icon: Users },
  { href: '/admin/pricing', label: 'Τιμολόγηση', icon: Tag },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/lead-form', label: 'Φόρμα', icon: Mail },
  { href: '/admin/footer', label: 'Footer', icon: Layers },
];

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = [
  {
    label: 'Καθαρισμοί',
    items: [
      { href: '/admin/cleanings/airbnb', label: 'Airbnb', icon: Home },
      { href: '/admin/cleanings/hotels', label: 'Ξενοδοχεία', icon: Building2 },
      { href: '/admin/cleanings/clients', label: 'Πελάτες', icon: Users },
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
  {
    label: 'Περιεχόμενο CMS',
    items: ADMIN_CMS_ITEMS,
  },
];

export const SUPER_ADMIN_NAV_ITEM: AdminNavItem = {
  href: '/admin/history',
  label: 'Ιστορικό Αλλαγών',
  icon: History,
};

export function getAdminRouteMeta(pathname: string): { group: string; title: string } {
  if (pathname === '/admin') return { group: 'Κέντρο Ελέγχου', title: 'Επισκόπηση Λειτουργιών' };
  if (pathname === '/admin/history') return { group: 'Σύστημα', title: 'Ιστορικό Αλλαγών' };
  if (pathname === '/admin/jobs/new') return { group: 'Λειτουργίες', title: 'Νέα Αγγελία Εργασίας' };
  if (pathname.startsWith('/admin/jobs/')) return { group: 'Λειτουργίες', title: 'Επεξεργασία Αγγελίας' };

  for (const group of ADMIN_NAV_GROUPS) {
    const match = group.items.find((item) =>
      item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    if (match) return { group: group.label, title: match.label };
  }

  return { group: 'Διαχείριση', title: 'Dashboard' };
}
