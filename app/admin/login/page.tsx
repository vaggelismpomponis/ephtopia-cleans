'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { loginAction } from '@/app/actions/auth';
import { Eye, EyeOff, Loader2, Lock, Mail, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Logo from '@/components/Logo';

type LoginState = { error?: string } | undefined;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, action, isPending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-source-sans), system-ui, sans-serif' }}>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Go to Website Button top */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal transition-all bg-white border border-slate-200 hover:border-teal/30 px-3.5 py-2 rounded-xl shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal" />
            Επιστροφή στην Ιστοσελίδα
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card top accent */}
          <div className="h-[3px] bg-gradient-to-r from-transparent via-teal to-transparent opacity-60" />

          <div className="p-8 sm:p-10">
            {/* Logo & Brand */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center mb-8 text-center"
            >
              <Logo
                size="lg"
                showSubtitle={true}
                subtitle="Σύστημα Διαχείρισης Περιεχομένου"
                className="flex-col !gap-3 text-center"
              />
            </motion.div>

            {/* Admin-only notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2.5 bg-teal/[0.06] border border-teal/20 rounded-xl px-4 py-3 mb-8"
            >
              <ShieldCheck className="w-4 h-4 text-teal shrink-0" />
              <p className="text-slate-500 text-xs">Πρόσβαση μόνο για διαχειριστές. Επικοινωνήστε με τον διαχειριστή αν χρειάζεστε πρόσβαση.</p>
            </motion.div>

            {/* Error message */}
            {state?.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-red-600 text-sm">{state.error}</p>
              </motion.div>
            )}

            {/* Login Form */}
            <form action={action} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="admin@ephtopia.eu"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-xl pl-10 pr-4 py-3.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Κωδικός
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-xl pl-10 pr-12 py-3.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2.5 bg-teal/15 hover:bg-teal/25 text-teal border border-teal/30 py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Σύνδεση...
                  </>
                ) : (
                  'Είσοδος στον Πίνακα Ελέγχου'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 text-[11px] mt-6">
          © {new Date().getFullYear()} Ephtopia Cleans. Η πρόσβαση διαχειριστή καταγράφεται και παρακολουθείται.
        </p>
      </motion.div>
    </div>
  );
}
