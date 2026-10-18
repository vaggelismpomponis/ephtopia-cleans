import { requireAdmin } from '@/lib/auth';
import { getCleanings, getClients } from '@/app/actions/cleanings';
import { CleaningsView } from '@/components/admin/cleanings/CleaningsView';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Καθαρισμοί Airbnb · Admin Ephtopia Cleans',
};

export default async function AdminAirbnbCleaningsPage() {
  await requireAdmin();

  const [cleanings, clients] = await Promise.all([
    getCleanings('airbnb'),
    getClients('airbnb'),
  ]);

  return (
    <CleaningsView
      category="airbnb"
      initialCleanings={cleanings}
      clients={clients}
    />
  );
}
