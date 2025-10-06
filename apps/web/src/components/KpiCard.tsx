interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: string;
}

export function KpiCard({ title, value, trend }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
      {trend ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{trend}</p> : null}
    </div>
  );
}
