import Link from 'next/link';
import { Printer } from 'lucide-react';
import { CleaningRecord, CLEANING_STATUS_CONFIG } from '@/lib/types/cleanings';

const CATEGORY_LABEL: Record<CleaningRecord['category'], string> = {
  airbnb: 'Airbnb',
  hotel: 'Ξενοδοχείο',
};

function formatScheduleDate(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return 'Σήμερα';
  const [y, m, d] = dateStr.split('-');
  return y && m && d ? `${d}/${m}/${y}` : dateStr;
}

function getRowMeta(cleaning: CleaningRecord, todayStr: string) {
  return {
    statusCfg: CLEANING_STATUS_CONFIG[cleaning.status],
    categoryLabel: CATEGORY_LABEL[cleaning.category],
    dateLabel: formatScheduleDate(cleaning.scheduled_date, todayStr),
    crew: [cleaning.cleaner_name, cleaning.driver_name].filter(Boolean).join(' · ') || '—',
    listHref: cleaning.category === 'airbnb' ? '/admin/cleanings/airbnb' : '/admin/cleanings/hotels',
    printHref: `/admin/cleanings/${cleaning.id}/print`,
  };
}

export function ScheduleMobileCard({
  cleaning,
  todayStr,
}: {
  cleaning: CleaningRecord;
  todayStr: string;
}) {
  const meta = getRowMeta(cleaning, todayStr);

  return (
    <div className="p-4 space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={meta.listHref} className="text-sm font-semibold text-navy truncate block">
            {cleaning.property_name || cleaning.client_name}
          </Link>
          <p className="text-xs text-muted truncate">
            {cleaning.client_name} · {meta.categoryLabel}
          </p>
        </div>
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${meta.statusCfg.bg} ${meta.statusCfg.text} ${meta.statusCfg.border}`}
        >
          {meta.statusCfg.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted pt-1">
        <span className="tabular-nums font-medium text-navy">
          {meta.dateLabel} · {cleaning.scheduled_time}
        </span>
        <span className="truncate max-w-[160px]">{meta.crew}</span>
      </div>

      <div className="pt-1 flex justify-end">
        <Link href={meta.printHref} className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-navy">
          <Printer className="w-3.5 h-3.5" strokeWidth={1.75} />
          Δελτίο
        </Link>
      </div>
    </div>
  );
}

export function ScheduleDesktopRow({
  cleaning,
  todayStr,
}: {
  cleaning: CleaningRecord;
  todayStr: string;
}) {
  const meta = getRowMeta(cleaning, todayStr);

  return (
    <tr className="hover:bg-warm-white/60 transition-colors">
      <td className="py-3 px-4 max-w-[220px]">
        <Link
          href={meta.listHref}
          className="font-semibold text-navy hover:text-teal-dark transition-colors block truncate"
        >
          {cleaning.property_name || cleaning.client_name}
        </Link>
        <span className="text-xs text-muted block truncate">{cleaning.client_name}</span>
      </td>
      <td className="py-3 px-3 text-xs font-medium text-muted whitespace-nowrap">
        {meta.categoryLabel}
      </td>
      <td className="py-3 px-3 text-xs text-navy tabular-nums whitespace-nowrap">
        <span className="font-semibold">{meta.dateLabel}</span>
        <span className="text-muted"> · {cleaning.scheduled_time}</span>
      </td>
      <td className="py-3 px-3 text-xs text-muted max-w-[150px] truncate">{meta.crew}</td>
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${meta.statusCfg.bg} ${meta.statusCfg.text} ${meta.statusCfg.border}`}
        >
          {meta.statusCfg.label}
        </span>
      </td>
      <td className="py-3 px-4 text-right whitespace-nowrap">
        <Link
          href={meta.printHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-navy px-2 py-1 rounded-md hover:bg-warm-white transition-colors"
          title="Εκτύπωση δελτίου"
        >
          <Printer className="w-3.5 h-3.5" strokeWidth={1.75} />
          <span className="hidden xl:inline">Δελτίο</span>
        </Link>
      </td>
    </tr>
  );
}

