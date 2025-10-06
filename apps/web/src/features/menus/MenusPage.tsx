import { useMemo, useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { StatusBadge } from '../../components/StatusBadge';
import { SeverityBadge } from '../../components/SeverityBadge';
import { Table } from '../../components/Table';
import { Button } from '../../components/Button';
import { exportValidationCsv, openPrintableReport } from '../../lib/export';
import { formatISO } from '../../lib/date';
import { useToast } from '../../components/ToastProvider';
import { TEXTS } from '../../lib/texts';

export function MenusPage() {
  const { data, validations } = useDataStore();
  const validateMenu = useDataStore((state) => state.validateMenu);
  const addSegell = useDataStore((state) => state.addSegell);
  const resetSegells = useDataStore((state) => state.resetSegells);
  const [filterEstat, setFilterEstat] = useState('');
  const [search, setSearch] = useState('');
  const { showToast } = useToast();

  const menusFiltrats = useMemo(() => {
    return data.menus
      .filter((menu) => (filterEstat ? menu.estat === filterEstat : true))
      .filter((menu) =>
        search
          ? menu.assignacions.some((assignacio) => assignacio.comensalId.toLowerCase().includes(search.toLowerCase())) ||
            menu.plats.some((platId) => platId.toLowerCase().includes(search.toLowerCase()))
          : true
      );
  }, [data.menus, filterEstat, search]);

  const rows = menusFiltrats.map((menu) => {
    const summary = validations[menu.id];
    const incidents = summary?.incidents ?? [];
    const errors = incidents.filter((incident) => incident.severitat === 'ERROR').length;
    const riscos = incidents.filter((incident) => incident.severitat === 'RISC').length;
    const revisions = incidents.filter((incident) => incident.severitat === 'REVISIO').length;

    return [
      <div key={`${menu.id}-info`} className="space-y-1">
        <p className="font-medium">{menu.id}</p>
        <p className="text-xs text-slate-500">{formatISO(menu.dataISO)} · {menu.torn}</p>
      </div>,
      <StatusBadge key={`${menu.id}-estat`} estat={menu.estat} />,
      <div key={`${menu.id}-incidents`} className="flex flex-wrap gap-2">
        {errors > 0 && <SeverityBadge severitat="ERROR" />}
        {riscos > 0 && <SeverityBadge severitat="RISC" />}
        {revisions > 0 && <SeverityBadge severitat="REVISIO" />}
        {incidents.length === 0 && <span className="text-xs text-emerald-600">Cap incidència</span>}
      </div>,
      <div key={`${menu.id}-segells`} className="space-y-1 text-xs">
        {menu.segells.length === 0 ? (
          <span className="text-slate-500">Sense segells</span>
        ) : (
          menu.segells.map((segell) => (
            <div key={segell.rol}>
              {segell.rol} · {segell.usuari} · {formatISO(segell.dataISO)}
            </div>
          ))
        )}
      </div>,
      <div key={`${menu.id}-accions`} className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            validateMenu(menu.id);
            showToast(`Validació executada per ${menu.id}`, 'success');
          }}
        >
          {TEXTS.actions.validar}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (!summary) {
              showToast('Executa la validació abans d\'exportar', 'error');
              return;
            }
            openPrintableReport(menu, summary, data);
          }}
        >
          {TEXTS.actions.exportarInforme}
        </Button>
        <Button
          variant="primary"
          disabled={errors > 0 || revisions > 0}
          onClick={() => {
            addSegell(menu.id, { rol: 'DN', usuari: 'DN demo', dataISO: new Date().toISOString() });
            showToast(`Segell DN aplicat al menú ${menu.id}`);
          }}
        >
          {TEXTS.actions.segellDN}
        </Button>
        <Button
          variant="primary"
          disabled={errors > 0 || revisions > 0 || !menu.segells.some((segell) => segell.rol === 'DN')}
          onClick={() => {
            addSegell(menu.id, { rol: 'TA', usuari: 'TA demo', dataISO: new Date().toISOString() });
            showToast(`Segell TA aplicat al menú ${menu.id}`);
          }}
        >
          {TEXTS.actions.segellTA}
        </Button>
        <Button variant="ghost" onClick={() => resetSegells(menu.id)}>
          Reinicia segells
        </Button>
      </div>
    ];
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-600 dark:text-slate-300">Filtra per estat</label>
          <select
            value={filterEstat}
            onChange={(event) => setFilterEstat(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Tots</option>
            {Object.entries(TEXTS.estatLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cerca per comensal o plat"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-slate-700 dark:bg-slate-900 md:w-80"
        />
        <Button variant="secondary" onClick={() => exportValidationCsv(Object.values(validations))}>
          {TEXTS.actions.exportarCsv}
        </Button>
      </div>
      <Table
        headers={['Menú', 'Estat', 'Incidències', 'Segells', 'Accions']}
        rows={rows}
        emptyMessage="Cap menú amb el filtre actual"
      />
    </div>
  );
}
