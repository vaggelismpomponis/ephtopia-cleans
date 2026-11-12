'use client';

import { useState, useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

type LoginState = { error?: string } | undefined;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, isPending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div
      className="min-h-dvh bg-warm-white flex items-center justify-center p-4"
      style={{ fontFamily: 'var(--font-source-sans), system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 min-h-10 text-xs font-semibold text-muted hover:text-navy transition-colors bg-white border border-border hover:border-navy/40 px-3.5 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" strokeWidth={1.75} />
            <span>Επιστροφή στην Ιστοσελίδα</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <Logo
              size="lg"
              showSubtitle
              subtitle="Σύστημα Διαχείρισης Περιεχομένου"
              className="flex-col !gap-2 text-center"
            />
          </div>

          <div className="flex items-start gap-2.5 bg-warm-white border border-border rounded-lg px-3.5 py-3 mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-dark shrink-0 mt-0.5" strokeWidth={1.75} />
            <p className="text-muted text-xs leading-relaxed">
              Πρόσβαση μόνο για διαχειριστές. Επικοινωνήστε με τον διαχειριστή αν χρειάζεστε πρόσβαση.
            </p>
          </div>

          {state?.error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 mb-6" role="alert">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" strokeWidth={1.75} />
              <p className="text-destructive text-sm">{state.error}</p>
            </div>
          )}

          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-navy mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" strokeWidth={1.75} />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  required
                  placeholder="admin@ephtopia.eu"
                  className="w-full min-h-11 bg-white border border-border hover:border-navy/40 focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg pl-10 pr-4 py-2.5 text-navy text-sm placeholder:text-muted-light focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-navy mb-1.5">
                Κωδικός
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" strokeWidth={1.75} />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full min-h-11 bg-white border border-border hover:border-navy/40 focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg pl-10 pr-12 py-2.5 text-navy text-sm placeholder:text-muted-light focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-9 min-w-9 inline-flex items-center justify-center text-muted hover:text-navy transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full min-h-11 flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Σύνδεση...</span>
                </>
              ) : (
                <span>Είσοδος στον Πίνακα Ελέγχου</span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-muted text-xs mt-6" suppressHydrationWarning>
          © {new Date().getFullYear()} Ephtopia Cleans. Η πρόσβαση διαχειριστή καταγράφεται.
        </p>
      </div>
    </div>
  );
}
