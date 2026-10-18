import { requireAdmin } from '@/lib/auth';
import { getCleaning } from '@/app/actions/cleanings';
import { notFound } from 'next/navigation';
import { StandalonePrintSlip } from '@/components/admin/cleanings/StandalonePrintSlip';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Εκτύπωση Δελτίου Αποστολής · Ephtopia Cleans',
};

interface PrintPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCleaningPrintPage({ params }: PrintPageProps) {
  await requireAdmin();
  const { id } = await params;
  const cleaning = await getCleaning(id);

  if (!cleaning) {
    notFound();
  }

  return <StandalonePrintSlip cleaning={cleaning} />;
}
