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
  const isTodayActive = dateFilter === 'today';
  const isInProgressActive = statusFilter === 'in_progress';
  const isScheduledActive = statusFilter === 'scheduled';
  const isCompletedActive = statusFilter === 'completed';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Today */}
      <button
        type="button"
        onClick={() => onDateFilterChange(isTodayActive ? 'all' : 'today')}
        className={`text-left bg-white border rounded-xl p-3.5 sm:p-4 shadow-2xs transition-all cursor-pointer ${
          isTodayActive
            ? 'border-teal ring-2 ring-teal/20 bg-teal/5'
            : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Σημερινοί Καθαρισμοί
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
            {stats.todayCount}
          </span>
          {stats.todayCount > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {stats.completionRate}%
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">
          {isTodayActive ? 'Ενεργό φίλτρο ημέρας' : 'Κλικ για φιλτράρισμα'}
        </p>
      </button>

      {/* 2. In Progress */}
      <button
        type="button"
        onClick={() => onStatusFilterChange(isInProgressActive ? 'all' : 'in_progress')}
        className={`text-left bg-white border rounded-xl p-3.5 sm:p-4 shadow-2xs transition-all cursor-pointer ${
          isInProgressActive
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/30'
            : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Σε Εξέλιξη Τώρα
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
            {stats.inProgressCount}
          </span>
          {stats.inProgressCount > 0 && (
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Live
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">Συνεργεία στον χώρο</p>
      </button>

      {/* 3. Scheduled */}
      <button
        type="button"
        onClick={() => onStatusFilterChange(isScheduledActive ? 'all' : 'scheduled')}
        className={`text-left bg-white border rounded-xl p-3.5 sm:p-4 shadow-2xs transition-all cursor-pointer ${
          isScheduledActive
            ? 'border-blue-400 ring-2 ring-blue-400/20 bg-blue-50/30'
            : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Προγραμματισμένοι
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
            {stats.upcomingCount}
          </span>
          <span className="text-[10px] font-semibold text-slate-500">Προσεχείς</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">Αναμονή ανάθεσης/ώρας</p>
      </button>

      {/* 4. Completed Today */}
      <button
        type="button"
        onClick={() => onStatusFilterChange(isCompletedActive ? 'all' : 'completed')}
        className={`text-left bg-white border rounded-xl p-3.5 sm:p-4 shadow-2xs transition-all cursor-pointer ${
          isCompletedActive
            ? 'border-emerald-400 ring-2 ring-emerald-400/20 bg-emerald-50/30'
            : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50'
        }`}
      >
        <div className="mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
            Ολοκληρωμένοι Σήμερα
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tabular-nums">
            {stats.completedToday}
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            Ready
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 truncate">Έτοιμα για check-in</p>
      </button>
    </div>
  );
}
