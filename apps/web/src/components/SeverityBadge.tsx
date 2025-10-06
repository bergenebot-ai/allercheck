import clsx from 'clsx';
import { TEXTS } from '../lib/texts';
import type { IncidentSeveritat } from '../lib/types';

const colorMap: Record<IncidentSeveritat, string> = {
  ERROR: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
  RISC: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
  REVISIO: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100'
};

export function SeverityBadge({ severitat }: { severitat: IncidentSeveritat }) {
  return (
    <span className={clsx('rounded-full px-2 py-1 text-xs font-semibold', colorMap[severitat])}>
      {TEXTS.severitat[severitat]}
    </span>
  );
}
