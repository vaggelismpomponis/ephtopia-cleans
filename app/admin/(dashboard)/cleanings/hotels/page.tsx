import { requireAdmin } from '@/lib/auth';
import { getCleanings, getClients } from '@/app/actions/cleanings';
import { CleaningsView } from '@/components/admin/cleanings/CleaningsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Καθαρισμοί Ξενοδοχείων · Admin Ephtopia Cleans',
};

export default async function AdminHotelCleaningsPage() {
  await requireAdmin();

  const [cleanings, clients] = await Promise.all([
    getCleanings('hotel'),
    getClients('hotel'),
  ]);

  return (
    <CleaningsView
      category="hotel"
      initialCleanings={cleanings}
      clients={clients}
    />
  );
}
