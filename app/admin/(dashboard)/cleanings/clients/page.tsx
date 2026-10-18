import { requireAdmin } from '@/lib/auth';
import { getClients } from '@/app/actions/cleanings';
import { ClientsManagement } from '@/components/admin/cleanings/ClientsManagement';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Πελατολόγιο & Καταλύματα · Admin Ephtopia Cleans',
};

export default async function AdminClientsPage() {
  await requireAdmin();

  const clients = await getClients();

  return <ClientsManagement initialClients={clients} />;
}
