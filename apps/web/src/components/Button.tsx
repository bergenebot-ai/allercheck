import type { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<Required<ButtonProps>['variant'], string> = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-900 focus:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100',
    ghost: 'bg-transparent hover:bg-slate-200 text-slate-900 dark:text-slate-100 dark:hover:bg-slate-700'
  };
  return <button className={clsx(base, variants[variant], className)} {...props} />;
}
