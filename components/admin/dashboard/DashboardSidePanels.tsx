import Link from 'next/link';
import { ArrowRight, Users, FileCheck } from 'lucide-react';
import { JobApplication, STATUS_LABELS } from '@/lib/types/jobs';
import { ADMIN_CMS_ITEMS, SUPER_ADMIN_NAV_ITEM } from '@/components/admin/navConfig';

interface DashboardSidePanelsProps {
  recentApplications: JobApplication[];
  isSuperAdmin: boolean;
}

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit' });
}

export function DashboardSidePanels({
  recentApplications,
  isSuperAdmin,
}: DashboardSidePanelsProps) {
  const cmsItems = isSuperAdmin
    ? [...ADMIN_CMS_ITEMS, SUPER_ADMIN_NAV_ITEM]
    : ADMIN_CMS_ITEMS;

  return (
    <div className="space-y-5 min-w-0">
      {/* Recent CV Applications */}
      <section className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileCheck className="w-4 h-4 text-muted shrink-0" strokeWidth={1.75} />
            <h3 className="font-heading text-sm font-bold text-navy truncate">
              Πρόσφατες Αιτήσεις
            </h3>
          </div>
          <Link
            href="/admin/applications"
            className="text-xs font-semibold text-teal-dark hover:underline shrink-0"
          >
            Όλες
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-xs font-medium text-navy">Καμία πρόσφατη αίτηση</p>
            <p className="text-xs text-muted mt-1">
              Οι νέες αιτήσεις υποψηφίων θα εμφανίζονται εδώ.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentApplications.map((app) => {
              const badge = STATUS_LABELS[app.status];
              return (
                <Link
                  key={app.id}
                  href="/admin/applications"
                  className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-warm-white transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{app.full_name}</p>
                    <p className="text-xs text-muted truncate">
                      {app.job_title} · <span className="tabular-nums">{formatShortDate(app.submitted_at)}</span>
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    {badge.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CMS & System Directory */}
      <section className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-bold text-navy">
            Διαχείριση Περιεχομένου &amp; Συστήματος
          </h3>
        </div>

        <div className="divide-y divide-border">
          {cmsItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-2.5 flex items-center justify-between gap-3 hover:bg-warm-white transition-colors group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className="w-4 h-4 text-muted group-hover:text-teal-dark transition-colors shrink-0"
                    strokeWidth={1.75}
                  />
                  <span className="text-xs font-semibold text-navy truncate">{item.label}</span>
                </span>
                <ArrowRight
                  className="w-3.5 h-3.5 text-muted-light group-hover:text-navy transition-colors shrink-0"
                  strokeWidth={1.75}
                />
              </Link>
            );
          })}

          <Link
            href="/admin/users"
            className="px-5 py-2.5 flex items-center justify-between gap-3 hover:bg-warm-white transition-colors group"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Users
                className="w-4 h-4 text-muted group-hover:text-teal-dark transition-colors shrink-0"
                strokeWidth={1.75}
              />
              <span className="text-xs font-semibold text-navy truncate">Χρήστες Admin</span>
            </span>
            <ArrowRight
              className="w-3.5 h-3.5 text-muted-light group-hover:text-navy transition-colors shrink-0"
              strokeWidth={1.75}
            />
          </Link>
        </div>
      </section>
    </div>
  );
}

