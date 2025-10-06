import { useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { KpiCard } from '../../components/KpiCard';
import { StatusBadge } from '../../components/StatusBadge';
import { SeverityBadge } from '../../components/SeverityBadge';
import { Table } from '../../components/Table';
import { formatISO } from '../../lib/date';

export function DashboardPage() {
  const data = useDataStore((state) => state.data);
  const validations = useDataStore((state) => state.validations);
  const validateAll = useDataStore((state) => state.validateAll);

  const totals = useMemo(() => {
    const totalMenus = data.menus.length;
    const certificats = data.menus.filter((menu) => menu.estat === 'CERTIFICAT').length;
    const revisions = data.menus.filter((menu) => menu.estat === 'REVISIO').length;
    const pendents = totalMenus - certificats - revisions;
    const incidentsTotals = Object.values(validations).reduce((acc, summary) => acc + summary.incidents.length, 0);
    const errors = Object.values(validations).reduce(
      (acc, summary) => acc + summary.incidents.filter((incident) => incident.severitat === 'ERROR').length,
      0
    );
    return { totalMenus, certificats, revisions, pendents, incidentsTotals, errors };
  }, [data.menus, validations]);

  const incidentsRecents = useMemo(() => {
    return Object.values(validations)
      .flatMap((summary) => summary.incidents.map((incident) => ({ ...incident, menuId: summary.menuId })))
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .slice(0, 5);
  }, [validations]);

  const menusPerSegell = useMemo(() => {
    return data.menus.map((menu) => ({
      id: menu.id,
      estat: menu.estat,
      segells: menu.segells
        .map((segell) => `${segell.rol} (${formatISO(segell.dataISO)})`)
        .join(', ') || 'Sense segell'
    }));
  }, [data.menus]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Menús totals" value={totals.totalMenus} />
        <KpiCard title="Certificats" value={totals.certificats} trend={`Pendents: ${totals.pendents}`} />
        <KpiCard title="Revisions" value={totals.revisions} trend={`Errors crítics: ${totals.errors}`} />
        <KpiCard title="Incidències" value={totals.incidentsTotals} trend="Validació contínua" />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Estat global de validacions</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Resultats del motor de validació. Torneu a executar per actualitzar canvis de proveïdor o receptari.
          </p>
        </div>
        <button
          onClick={() => validateAll()}
          className="rounded-md border border-primary-200 bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700"
        >
          Revalida tots els menús
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Incidències recents</h4>
          <Table
            headers={['Menú', 'Severitat', 'Al·lergogen', 'Comensal', 'Descripció']}
            rows={incidentsRecents.map((incident) => [
              incident.menuId,
              <SeverityBadge key={incident.id} severitat={incident.severitat} />,
              incident.alergogen,
              incident.comensalId,
              incident.descripcio
            ])}
            emptyMessage="Sense incidències registrades"
          />
        </div>
        <div className="space-y-4">
          <h4 className="text-md font-semibold">Segells i certificacions</h4>
          <Table
            headers={['Menú', 'Estat', 'Segells']}
            rows={menusPerSegell.map((row) => [
              row.id,
              <StatusBadge key={row.id} estat={row.estat} />,
              row.segells
            ])}
          />
        </div>
      </div>
    </div>
  );
}
