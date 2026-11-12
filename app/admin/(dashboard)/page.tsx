import Link from 'next/link';
import { Plus, Users } from 'lucide-react';
import { requireAdmin } from '@/lib/auth';
import { SUPER_ADMIN_EMAIL } from '@/components/admin/navConfig';
import { getCleanings, getClients } from '@/app/actions/cleanings';
import { getAllJobs, getApplications } from '@/app/actions/jobs';
import { DashboardKpiBar } from '@/components/admin/dashboard/DashboardKpiBar';
import { OperationsScheduleTable } from '@/components/admin/dashboard/OperationsScheduleTable';
import { DashboardSidePanels } from '@/components/admin/dashboard/DashboardSidePanels';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [user, cleanings, clients, jobs, applications] = await Promise.all([
    requireAdmin(),
    getCleanings(),
    getClients(),
    getAllJobs(),
    getApplications(),
  ]);

  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: 'Europe/Athens' });
  const todayLabel = now.toLocaleDateString('el-GR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Athens',
  });

  const nonCancelled = cleanings.filter((c) => c.status !== 'cancelled');
  const todayCleanings = nonCancelled.filter((c) => c.scheduled_date === todayStr);
  const todayCompleted = todayCleanings.filter((c) => c.status === 'completed').length;
  const completionRate =
    todayCleanings.length > 0 ? Math.round((todayCompleted / todayCleanings.length) * 100) : 0;

  const inProgressCount = nonCancelled.filter((c) => c.status === 'in_progress').length;
  const upcomingCleanings = nonCancelled
    .filter((c) => c.scheduled_date >= todayStr && c.status !== 'completed')
    .sort((a, b) =>
      `${a.scheduled_date} ${a.scheduled_time}`.localeCompare(`${b.scheduled_date} ${b.scheduled_time}`),
    );

  const totalProperties = clients.reduce((sum, client) => sum + (client.properties?.length ?? 0), 0);
  const activeJobsCount = jobs.filter((job) => job.is_active).length;
  const newApplicationsCount = applications.filter((app) => app.status === 'new').length;
  const isSuperAdmin = user.email === SUPER_ADMIN_EMAIL;

  return (
    <div className="space-y-6">
      {/* Executive Command Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted capitalize">
            {todayLabel}
          </p>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-navy mt-1">
            Κέντρο Επιχειρήσεων
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/cleanings/clients"
            className="inline-flex items-center gap-1.5 border border-border bg-white hover:border-navy/30 text-navy text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4 text-muted" strokeWidth={1.75} />
            Πελάτες
          </Link>
          <Link
            href="/admin/cleanings/airbnb"
            className="inline-flex items-center gap-1.5 bg-teal hover:bg-teal-dark text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            Νέος Καθαρισμός
          </Link>
        </div>
      </header>

      {/* Primary KPI Strip */}
      <DashboardKpiBar
        todayTotal={todayCleanings.length}
        todayCompleted={todayCompleted}
        completionRate={completionRate}
        inProgressCount={inProgressCount}
        upcomingCount={upcomingCleanings.length}
        totalClients={clients.length}
        totalProperties={totalProperties}
        activeJobsCount={activeJobsCount}
        newApplicationsCount={newApplicationsCount}
      />

      {/* Main Operations & Side Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 min-w-0">
          <OperationsScheduleTable
            cleanings={upcomingCleanings.slice(0, 8)}
            todayStr={todayStr}
          />
        </div>

        <div className="lg:col-span-4 min-w-0">
          <DashboardSidePanels
            recentApplications={applications.slice(0, 4)}
            isSuperAdmin={isSuperAdmin}
          />
        </div>
      </div>
    </div>
  );
}
