'use client';

import React, { useActionState, useTransition } from 'react';
import {
  Mail,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  UserCheck,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { inviteUserAction, deleteUserAction } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';
import { ConfirmModal } from '@/components/admin/ConfirmModal';

type InviteState = { error?: string; success?: string } | undefined;

interface UserRow {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  invited_at: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function UserStatusBadge({ user }: { user: UserRow }) {
  const hasSignedIn = !!user.last_sign_in_at;
  const isPendingInvite = !!user.invited_at && !hasSignedIn;

  if (isPendingInvite) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md px-2 py-0.5">
        <Clock className="w-3 h-3" strokeWidth={1.75} /> Σε αναμονή
      </span>
    );
  }
  if (hasSignedIn) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-warm-white text-teal-dark border border-border rounded-md px-2 py-0.5">
        <UserCheck className="w-3 h-3" strokeWidth={1.75} /> Ενεργός
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-warm-white text-muted border border-border rounded-md px-2 py-0.5">
      <ShieldAlert className="w-3 h-3" strokeWidth={1.75} /> Αδρανής
    </span>
  );
}

function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = React.useState<string | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const router = useRouter();

  const handleConfirm = () => {
    setModalOpen(false);
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.error) setDeleteError(result.error);
      else router.refresh();
    });
  };

  return (
    <div>
      {deleteError && <p className="text-destructive text-xs mb-1">{deleteError}</p>}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={isPending}
        aria-label={`Διαγραφή χρήστη ${email}`}
        className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-lg text-muted hover:text-destructive hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" strokeWidth={1.75} />}
      </button>

      <ConfirmModal
        open={modalOpen}
        title="Διαγραφή χρήστη"
        description="Αυτή η ενέργεια είναι μη αναστρέψιμη. Ο λογαριασμός του χρήστη θα διαγραφεί μόνιμα και δεν θα μπορεί να συνδεθεί ξανά."
        confirmLabel="Διαγραφή"
        cancelLabel="Άκυρο"
        requiredConfirmText={email}
        onConfirm={handleConfirm}
        onCancel={() => setModalOpen(false)}
        variant="danger"
      />
    </div>
  );
}

export function InviteUserForm({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [state, action, isPending] = useActionState<InviteState, FormData>(inviteUserAction, undefined);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state?.success]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-bold text-navy text-lg font-heading">Πρόσκληση Νέου Χρήστη</h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5">
            Ο χρήστης θα λάβει email με σύνδεσμο πρόσβασης
          </p>
        </div>

        {state?.success && (
          <div className="flex items-center gap-2.5 bg-warm-white border border-teal/30 rounded-lg px-4 py-3 mb-5">
            <CheckCircle className="w-4 h-4 text-teal-dark shrink-0" strokeWidth={1.75} />
            <p className="text-navy text-sm">{state.success}</p>
          </div>
        )}
        {state?.error && (
          <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5" role="alert">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0" strokeWidth={1.75} />
            <p className="text-destructive text-sm">{state.error}</p>
          </div>
        )}

        <form ref={formRef} action={action} className="flex gap-3 flex-col sm:flex-row">
          <div className="flex-1 min-w-0">
            <label htmlFor="invite-email" className="sr-only">Email νέου διαχειριστή</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" strokeWidth={1.75} />
              <input
                id="invite-email"
                name="email"
                type="email"
                inputMode="email"
                autoCapitalize="none"
                autoComplete="off"
                required
                placeholder="νεος@admin.com"
                className="w-full min-h-11 bg-white border border-border hover:border-navy/40 focus:border-teal focus:ring-2 focus:ring-teal/20 rounded-lg pl-10 pr-4 py-2.5 text-navy text-sm placeholder:text-muted-light focus:outline-none transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="min-h-11 inline-flex items-center justify-center gap-2 bg-teal-dark hover:bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap"
          >
            {isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /><span>Αποστολή...</span></>) : (<><Send className="w-4 h-4" strokeWidth={1.75} /><span>Αποστολή Πρόσκλησης</span></>)}
          </button>
        </form>

        <p className="text-muted text-xs mt-3 leading-relaxed">
          Ο προσκεκλημένος χρήστης θα έχει πλήρη πρόσβαση στον πίνακα διαχείρισης. Κάνε πρόσκληση μόνο σε έμπιστα άτομα.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-bold text-navy text-lg font-heading">Εγγεγραμμένοι Χρήστες</h2>
          <p className="text-xs sm:text-sm text-muted mt-0.5 tabular-nums">
            {users.length} {users.length === 1 ? 'χρήστης' : 'χρήστες'} συνολικά
          </p>
        </div>

        {users.length === 0 ? (
          <p className="text-muted text-sm text-center py-8">Δεν βρέθηκαν χρήστες.</p>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-4 py-3.5 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-navy truncate">{user.email}</span>
                    {user.id === currentUserId && (
                      <span className="text-xs font-medium bg-warm-white text-muted border border-border rounded-md px-2 py-0.5">Εσύ</span>
                    )}
                    <UserStatusBadge user={user} />
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted tabular-nums">
                    <span>Δημιουργία: {formatDate(user.created_at)}</span>
                    {user.last_sign_in_at && <span>Τελευταία σύνδεση: {formatDate(user.last_sign_in_at)}</span>}
                  </div>
                </div>

                {user.id !== currentUserId && <DeleteUserButton userId={user.id} email={user.email} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
