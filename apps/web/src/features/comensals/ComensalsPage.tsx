import { useMemo, useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../../components/Table';
import { formatISO } from '../../lib/date';

export function ComensalsPage() {
  const { data } = useDataStore();
  const [search, setSearch] = useState('');
  const [filterAlergen, setFilterAlergen] = useState('');

  const alergensDisponibles = useMemo(() => {
    const set = new Set<string>();
    data.comensals.forEach((comensal) => {
      comensal.informes.forEach((informe) => {
        informe.alergies.forEach((alergia) => set.add(alergia.codi));
      });
    });
    return Array.from(set.values());
  }, [data.comensals]);

  const rows = useMemo(() => {
    return data.comensals
      .filter((comensal) =>
        `${comensal.nom} ${comensal.dieta ?? ''}`.toLowerCase().includes(search.toLowerCase())
      )
      .filter((comensal) =>
        filterAlergen
          ? comensal.informes.some((informe) =>
              informe.alergies.some((alergia) => alergia.codi === filterAlergen)
            )
          : true
      )
      .map((comensal, index) => {
        const informe = [...comensal.informes].sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1))[0];
        const nom = data.anonimitza ? `Com-${index + 1}` : comensal.nom;
        return [
          nom,
          comensal.dieta ?? 'General',
          informe ? formatISO(informe.dataISO) : 'n/d',
          informe
            ? informe.alergies
                .map((alergia) => `${alergia.codi} (${alergia.severitat})`)
                .join(', ')
            : 'Sense registres'
        ];
      });
  }, [data, filterAlergen, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Cerca per nom o dieta
          </label>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900"
            placeholder="Ex. sense gluten"
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Filtra per al·lergogen
          </label>
          <select
            value={filterAlergen}
            onChange={(event) => setFilterAlergen(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Tots</option>
            {alergensDisponibles.map((alergogen) => (
              <option key={alergogen} value={alergogen}>
                {alergogen}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Table headers={["Comensal", 'Dieta', 'Darrera revisió', 'Al·lèrgies registrades']} rows={rows} />
    </div>
  );
}
