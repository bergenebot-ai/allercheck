import type { ReactNode } from 'react';

interface TableProps {
  headers: ReactNode[];
  rows: ReactNode[][];
  emptyMessage?: string;
}

export function Table({ headers, rows, emptyMessage = 'Sense dades' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((cols, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                {cols.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                    {col}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
