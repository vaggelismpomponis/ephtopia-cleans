'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

type Status = 'loading' | 'set-password' | 'success' | 'error';

export default function InvitePage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let active = true;

    async function establishInviteSession() {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken || !refreshToken) {
        if (active) {
          setErrorMsg('Μη έγκυρος σύνδεσμος πρόσκλησης. Ζητήστε νέα πρόσκληση.');
          setStatus('error');
        }
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (!active) return;

      if (error) {
        setErrorMsg(`Σφάλμα: ${error.message}`);
        setStatus('error');
      } else {
        setStatus('set-password');
      }
    }

    void establishInviteSession();
    return () => {
      active = false;
    };
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      setErrorMsg('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.');
      return;
    }
    if (password !== confirm) {
      setErrorMsg('Οι κωδικοί δεν ταιριάζουν.');
      return;
    }

    setErrorMsg('');
    setIsPending(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(`Σφάλμα ορισμού κωδικού: ${error.message}`);
      setIsPending(false);
    } else {
      setStatus('success');
      setTimeout(() => router.push('/admin'), 2000);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-100 flex items-center justify-center p-4"
      style={{ fontFamily: 'var(--font-source-sans), system-ui, sans-serif' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-[3px] bg-gradient-to-r from-transparent via-teal to-transparent opacity-60" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8 text-center">
              <Logo size="lg" showSubtitle subtitle="Σύστημα Διαχείρισης Περιεχομένου" className="flex-col !gap-3 text-center" />
            </div>

            {/* ── Loading ── */}
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-8 h-8 text-teal animate-spin" />
                <p className="text-slate-500 text-sm">Επαλήθευση πρόσκλησης...</p>
              </div>
            )}

            {/* ── Error ── */}
            {status === 'error' && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-red-600 text-sm">{errorMsg}</p>
              </div>
            )}

            {/* ── Set Password ── */}
            {status === 'set-password' && (
              <>
                <div className="flex items-center gap-2.5 bg-teal/[0.06] border border-teal/20 rounded-xl px-4 py-3 mb-6">
                  <ShieldCheck className="w-4 h-4 text-teal shrink-0" />
                  <p className="text-slate-500 text-xs">Πρόσκληση επαληθεύτηκε! Ορίστε έναν κωδικό πρόσβασης για τον λογαριασμό σας.</p>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <p className="text-red-600 text-sm">{errorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleSetPassword} className="space-y-4">
                  {/* New password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Νέος Κωδικός
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Τουλάχιστον 8 χαρακτήρες"
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-xl pl-10 pr-12 py-3.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Επιβεβαίωση Κωδικού
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        placeholder="Επαναλάβετε τον κωδικό"
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-teal/50 focus:ring-1 focus:ring-teal/30 rounded-xl pl-10 pr-12 py-3.5 text-slate-800 text-sm placeholder-slate-300 focus:outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2.5 bg-teal/15 hover:bg-teal/25 text-teal border border-teal/30 py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Αποθήκευση...
                      </>
                    ) : (
                      'Ορισμός Κωδικού & Είσοδος'
                    )}
                  </button>
                </form>
              </>
            )}

            {/* ── Success ── */}
            {status === 'success' && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Ο λογαριασμός δημιουργήθηκε!</p>
                  <p className="text-slate-500 text-sm">Ανακατεύθυνση στον πίνακα διαχείρισης...</p>
                </div>
                <Loader2 className="w-5 h-5 text-teal animate-spin" />
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-slate-400 text-[11px] mt-6">
          © {new Date().getFullYear()} Ephtopia Cleans. Η πρόσβαση διαχειριστή καταγράφεται και παρακολουθείται.
        </p>
      </motion.div>
    </div>
  );
}
