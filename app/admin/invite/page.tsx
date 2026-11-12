'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
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
    return () => { active = false; };
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setErrorMsg('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες.'); return; }
    if (password !== confirm) { setErrorMsg('Οι κωδικοί δεν ταιριάζουν.'); return; }

    setErrorMsg('');
    setIsPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setErrorMsg(`Σφάλμα ορισμού κωδικού: ${error.message}`);
      setIsPending(false);
    } else {
      setStatus('success');
      setTimeout(() => router.push('/admin'), 1500);
    }
  };

  return (
    <div
      className="min-h-dvh bg-warm-white flex items-center justify-center p-4"
      style={{ fontFamily: 'var(--font-source-sans), system-ui, sans-serif' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <Logo size="lg" showSubtitle subtitle="Σύστημα Διαχείρισης Περιεχομένου" className="flex-col !gap-2 text-center" />
          </div>

          {status === 'loading' && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-6 h-6 text-teal-dark animate-spin" />
              <p className="text-muted text-sm">Επαλήθευση πρόσκλησης...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertCircle className="w-7 h-7 text-destructive" strokeWidth={1.75} />
              <p className="text-destructive text-sm">{errorMsg}</p>
            </div>
          )}

          {status === 'set-password' && (
            <>
              <div className="flex items-start gap-2.5 bg-warm-white border border-border rounded-lg px-3.5 py-3 mb-6">
                <ShieldCheck className="w-4 h-4 text-teal-dark shrink-0 mt-0.5" strokeWidth={1.75} />
                <p className="text-muted text-xs leading-relaxed">
                  Πρόσκληση επαληθεύτηκε! Ορίστε έναν κωδικό πρόσβασης για τον λογαριασμό σας.
                </p>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 mb-5" role="alert">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" strokeWidth={1.75} />
                  <p className="text-destructive text-sm">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <label htmlFor="invite-password" className="block text-sm font-medium text-navy mb-1.5">Νέος Κωδικός</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" strokeWidth={1.75} />
                    <input
                      id="invite-password"
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Τουλάχιστον 8 χαρακτήρες"
                      className="w-full min-h-11 bg-white border border-border hover:border-navy/40 focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg pl-10 pr-12 py-2.5 text-navy text-sm placeholder:text-muted-light focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 min-h-9 min-w-9 inline-flex items-center justify-center text-muted hover:text-navy transition-colors cursor-pointer"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="invite-confirm" className="block text-sm font-medium text-navy mb-1.5">Επιβεβαίωση Κωδικού</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" strokeWidth={1.75} />
                    <input
                      id="invite-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Επαναλάβετε τον κωδικό"
                      className="w-full min-h-11 bg-white border border-border hover:border-navy/40 focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg pl-10 pr-12 py-2.5 text-navy text-sm placeholder:text-muted-light focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? 'Απόκρυψη κωδικού' : 'Εμφάνιση κωδικού'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 min-h-9 min-w-9 inline-flex items-center justify-center text-muted hover:text-navy transition-colors cursor-pointer"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.75} /> : <Eye className="w-4 h-4" strokeWidth={1.75} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full min-h-11 flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white py-3 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Αποθήκευση...</span></>) : <span>Ορισμός Κωδικού &amp; Είσοδος</span>}
                </button>
              </form>
            </>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="w-7 h-7 text-teal-dark" strokeWidth={1.75} />
              <div>
                <p className="font-semibold text-navy mb-1">Ο λογαριασμός δημιουργήθηκε!</p>
                <p className="text-muted text-sm">Ανακατεύθυνση στον πίνακα διαχείρισης...</p>
              </div>
              <Loader2 className="w-5 h-5 text-teal-dark animate-spin" />
            </div>
          )}
        </div>

        <p className="text-center text-muted text-xs mt-6" suppressHydrationWarning>
          © {new Date().getFullYear()} Ephtopia Cleans. Η πρόσβαση διαχειριστή καταγράφεται.
        </p>
      </div>
    </div>
  );
}
