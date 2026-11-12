'use client';

interface CleaningsStatsProps {
  stats: {
    todayCount: number;
    inProgressCount: number;
    upcomingCount: number;
    completedToday: number;
    completionRate: number;
  };
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  statusFilter: string;
  onStatusFilterChange: (filter: string) => void;
}

export function CleaningsStats({
  stats,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
}: CleaningsStatsProps) {
  const items = [
    {
      key: 'today',
      label: 'Σημερινοί',
      value: stats.todayCount,
      meta: stats.todayCount > 0 ? `${stats.completionRate}% ολοκλήρωση` : 'Χωρίς εγγραφές',
      active: dateFilter === 'today',
      onClick: () => onDateFilterChange(dateFilter === 'today' ? 'all' : 'today'),
    },
    {
      key: 'in_progress',
      label: 'Σε Εξέλιξη',
      value: stats.inProgressCount,
      meta: 'Συνεργεία εντός χώρου',
      active: statusFilter === 'in_progress',
      onClick: () => onStatusFilterChange(statusFilter === 'in_progress' ? 'all' : 'in_progress'),
    },
    {
      key: 'scheduled',
      label: 'Προσεχείς',
      value: stats.upcomingCount,
      meta: 'Προγραμματισμένοι',
      active: statusFilter === 'scheduled',
      onClick: () => onStatusFilterChange(statusFilter === 'scheduled' ? 'all' : 'scheduled'),
    },
    {
      key: 'completed',
      label: 'Ολοκληρωμένοι',
      value: stats.completedToday,
      meta: 'Σημερινές παραδόσεις',
      active: statusFilter === 'completed',
      onClick: () => onStatusFilterChange(statusFilter === 'completed' ? 'all' : 'completed'),
    },
  ];

  return (
    <section aria-label="Δείκτες καθαρισμών">
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border rounded-xl bg-white divide-y lg:divide-y-0 sm:divide-x divide-border overflow-hidden">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={item.onClick}
            aria-pressed={item.active}
            className={`text-left p-4 sm:p-5 transition-colors cursor-pointer min-w-0 relative ${
              item.active ? 'bg-warm-white' : 'hover:bg-warm-white/60'
            }`}
          >
            {item.active && (
              <span className="absolute inset-x-0 top-0 h-0.5 bg-teal-dark" aria-hidden="true" />
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted block truncate">
              {item.label}
            </span>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-heading text-2xl sm:text-3xl font-extrabold text-navy tabular-nums">
                {item.value}
              </span>
              {item.active && (
                <span className="text-[11px] font-semibold text-teal-dark">Φίλτρο</span>
              )}
            </div>
            <p className="text-xs text-muted mt-1 truncate">{item.meta}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
