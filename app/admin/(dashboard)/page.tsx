import { requireAdmin } from '@/lib/auth';
import { getCleaningStats } from '@/app/actions/cleanings';
import Link from 'next/link';
import {
  Star,
  HelpCircle,
  FileText,
  Tag,
  Mail,
  Users,
  Layers,
  ExternalLink,
  ArrowRight,
  Briefcase,
  Home,
  Building2,
  Sparkles,
} from 'lucide-react';

const contentSections = [
  { href: '/admin/hero', label: 'Hero', icon: Star, description: 'Τίτλος, υπότιτλος, κουμπιά CTA, στατιστικά' },
  { href: '/admin/problem', label: 'Πρόβλημα', icon: Layers, description: 'Τίτλος ενότητας, κάρτες προβλημάτων, μεταβατικό κείμενο' },
  { href: '/admin/services', label: 'Υπηρεσίες', icon: FileText, description: 'Τίτλοι υπηρεσιών, περιγραφές, χαρακτηριστικά' },
  { href: '/admin/testimonials', label: 'Αξιολογήσεις', icon: Users, description: 'Σχόλια πελατών, ονόματα, πόλεις, βαθμολογίες' },
  { href: '/admin/pricing', label: 'Τιμολόγηση', icon: Tag, description: 'Ονόματα πακέτων, τιμές, λίστες χαρακτηριστικών' },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle, description: 'Ερωτήσεις και απαντήσεις (προσθήκη/επεξεργασία/διαγραφή)' },
  { href: '/admin/lead-form', label: 'Φόρμα', icon: Mail, description: 'Ετικέτες φόρμας, placeholders, κείμενο CTA' },
  { href: '/admin/footer', label: 'Footer', icon: Layers, description: 'Στοιχεία επικοινωνίας, σύνδεσμοι, social URLs, περιγραφή' },
  { href: '/admin/jobs', label: 'Αγγελίες', icon: Briefcase, description: 'Δημιουργία, επεξεργασία και διαχείριση αγγελιών εργασίας' },
];

export default async function AdminDashboardPage() {
  const user = await requireAdmin();
  const firstName = user.email?.split('@')[0] ?? 'Admin';

  const stats = await getCleaningStats();

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-xs font-semibold text-teal tracking-wide">Διαχείριση Ενεργή</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 font-heading mb-2">
          Καλώς ήρθες, <span className="gradient-text">{firstName}</span>
        </h2>
        <p className="text-slate-500 text-sm">
          Διαχειρίσου τους καθαρισμούς σε Airbnb και Ξενοδοχεία, εκτύπωσε δελτία αποστολής ή επεξεργάσου το περιεχόμενο του site.
        </p>
      </div>

      {/* ── CORE OPERATIONS: CLEANINGS & CLIENTS ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal" />
              <span>Διαχείριση Καθαρισμών & Πελατών</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ξεχωριστός προγραμματισμός, κωδικοί πρόσβασης και εκτυπώσιμα δελτία για οδηγούς/συνεργεία.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* Airbnb Card */}
          <Link
            href="/admin/cleanings/airbnb"
            className="group relative bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-teal/40 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-teal/10 text-teal flex items-center justify-center group-hover:bg-teal group-hover:text-white transition-colors">
                  <Home className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold bg-teal/10 text-teal px-2.5 py-1 rounded-full">
                  {stats.airbnbToday} Σήμερα
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base font-heading mb-1 group-hover:text-teal transition-colors">
                Καθαρισμοί Airbnb
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Προγραμματισμός turnovers, καταχώρηση lockbox/κωδικών εισόδου και εκτύπωση καρτών.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal mt-4 pt-3 border-t border-slate-100">
              <span>Άνοιγμα πίνακα</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Hotels Card */}
          <Link
            href="/admin/cleanings/hotels"
            className="group relative bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-blue-400/40 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                  {stats.hotelsToday} Σήμερα
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base font-heading mb-1 group-hover:text-blue-600 transition-colors">
                Καθαρισμοί Ξενοδοχείων
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Housekeeping δωματίων, πτερύγων και παράδοση ιματισμού σε ξενοδοχειακές μονάδες.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 mt-4 pt-3 border-t border-slate-100">
              <span>Άνοιγμα πίνακα</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Clients Card */}
          <Link
            href="/admin/cleanings/clients"
            className="group relative bg-white hover:bg-slate-50/80 border border-slate-200 hover:border-teal/40 rounded-2xl p-5 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full">
                  Βάση Πελατών
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base font-heading mb-1 group-hover:text-purple-600 transition-colors">
                Πελατολόγιο & Καταλύματα
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Αποθήκευση στοιχείων πελατών, ακινήτων, ορόφων, κωδικών εισόδου και οδηγιών.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 mt-4 pt-3 border-t border-slate-100">
              <span>Διαχείριση πελατών</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── CMS SITE CONTENT SECTIONS ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 font-heading">
              Περιεχόμενο Ιστότοπου (CMS)
            </h3>
            <p className="text-xs text-slate-400">
              Επεξεργασία κειμένων, τιμών, συχνών ερωτήσεων και αγγελιών εργασίας.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-slate-400 hover:text-teal text-xs font-semibold transition-colors group"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Προεπισκόπηση</span>
          </Link>
        </div>

        {/* Section grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contentSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-teal/30 rounded-xl p-3.5 transition-all duration-300 shadow-sm hover:shadow min-w-0"
              >
                <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center shrink-0 group-hover:bg-teal/20 transition-colors">
                  <Icon className="w-4 h-4 text-teal/70 group-hover:text-teal transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-700 group-hover:text-slate-900 text-xs transition-colors mb-0.5">
                    {section.label}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight truncate">
                    {section.description}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal/70 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
