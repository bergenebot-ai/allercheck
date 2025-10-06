import { useMemo, useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../../components/Table';
import { SeverityBadge } from '../../components/SeverityBadge';

export function ValidacioPage() {
  const { data, validations } = useDataStore();
  const summaries = Object.values(validations);
  const [filterSeveritat, setFilterSeveritat] = useState('');
  const [filterAlergen, setFilterAlergen] = useState('');

  const incidents = useMemo(() => {
    return summaries.flatMap((summary) =>
      summary.incidents.map((incident) => ({ ...incident, menuId: summary.menuId, generatedAt: summary.generatedAt }))
    );
  }, [summaries]);

  const alergensDisponibles = useMemo(() => {
    const set = new Set<string>();
    incidents.forEach((incident) => set.add(incident.alergogen));
    return Array.from(set.values());
  }, [incidents]);

  const filtered = incidents.filter((incident) =>
    (filterSeveritat ? incident.severitat === filterSeveritat : true) &&
    (filterAlergen ? incident.alergogen === filterAlergen : true)
  );

  const rows = filtered.map((incident) => [
    incident.menuId,
    incident.comensalId,
    incident.platId,
    <SeverityBadge key={incident.id} severitat={incident.severitat} />,
    incident.alergogen,
    incident.descripcio,
    `${incident.traçabilitat.ingredientId} → ${incident.traçabilitat.proveidorId} (${incident.traçabilitat.versioFitxa ?? 'n/d'})`
  ]);

  const alternatives = useMemo(() => {
    return data.comensals.map((comensal) => {
      const alergens = new Set(
        comensal.informes.flatMap((informe) => informe.alergies.map((alergia) => alergia.codi))
      );
      const platsSegurs = data.plats
        .filter((plat) => !(plat.alergensDerivats ?? []).some((alergen) => alergens.has(alergen)))
        .map((plat) => plat.nom);
      return { comensal: comensal.nom, platsSegurs };
    });
  }, [data.comensals, data.plats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="w-full md:w-48">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Severitat</label>
          <select
            value={filterSeveritat}
            onChange={(event) => setFilterSeveritat(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Totes</option>
            <option value="ERROR">Errors</option>
            <option value="RISC">Risc</option>
            <option value="REVISIO">Revisió</option>
          </select>
        </div>
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">Al·lergogen</label>
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
      <Table
        headers={['Menú', 'Comensal', 'Plat', 'Severitat', 'Al·lergogen', 'Descripció', 'Traçabilitat']}
        rows={rows}
        emptyMessage="Sense incidències amb el filtre aplicat"
      />
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h4 className="text-md font-semibold">Alternatives compatibles per dieta</h4>
        <div className="mt-2 space-y-2 text-sm">
          {alternatives.map((item) => (
            <p key={item.comensal}>
              <span className="font-semibold">{item.comensal}:</span> {item.platsSegurs.join(', ') || 'Cal definir alternatives'}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
