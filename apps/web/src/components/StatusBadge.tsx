import clsx from 'clsx';
import { TEXTS } from '../lib/texts';
import type { EstatValidacio } from '../lib/types';

const colorMap: Record<EstatValidacio, string> = {
  BORRADOR: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100',
  VALIDAT_1_2: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  VALIDAT_2_2: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100',
  CERTIFICAT: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100',
  REVISIO: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
};

export function StatusBadge({ estat }: { estat: EstatValidacio }) {
  return (
    <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', colorMap[estat])}>
      {TEXTS.estatLabels[estat]}
    </span>
  );
}
