import { requireAdmin } from '@/lib/auth';
import { listUsersAction } from '@/app/actions/auth';
import { InviteUserForm } from '@/components/admin/InviteUserForm';
import { ShieldX } from 'lucide-react';

export const metadata = {
  title: 'Χρήστες · Admin · Ephtopia Cleans',
  robots: { index: false, follow: false },
};

/** Only this email can access user management. */
const SUPER_ADMIN_EMAIL = 'ebomponis@gmail.com';

export default async function UsersPage() {
  const currentUser = await requireAdmin();

  // Super-admin guard — only the owner email can manage users
  if (currentUser.email !== SUPER_ADMIN_EMAIL) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-center px-4">
        <ShieldX className="w-7 h-7 text-destructive mb-3" strokeWidth={1.75} aria-hidden="true" />
        <h1 className="text-xl font-bold text-navy mb-2">Δεν έχετε πρόσβαση</h1>
        <p className="text-muted text-sm max-w-xs">
          Η διαχείριση χρηστών είναι διαθέσιμη μόνο για τον κύριο διαχειριστή του συστήματος.
        </p>
      </div>
    );
  }

  const { users, error } = await listUsersAction();

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-dark mb-2 block">
          Διαχείριση Πρόσβασης
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy font-heading mb-2">
          Χρήστες
        </h1>
        <p className="text-muted text-sm">
          Κάλεσε νέους διαχειριστές μέσω email ή διαχειρίσου τους υπάρχοντες.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-red-600 text-sm">
          Σφάλμα φόρτωσης χρηστών: {error}
        </div>
      )}

      <InviteUserForm users={users} currentUserId={currentUser.id} />
    </div>
  );
}

