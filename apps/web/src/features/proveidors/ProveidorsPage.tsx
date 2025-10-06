import { useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../../components/Table';
import { formatISO } from '../../lib/date';

export function ProveidorsPage() {
  const { data } = useDataStore();

  const rows = useMemo(() => {
    return data.proveidors.map((proveidor) => {
      const latest = [...proveidor.fitxes].sort((a, b) => (a.dataISO < b.dataISO ? 1 : -1))[0];
      const declaracions = latest.declaracioAlergens
        .map((item) => `${item.codi}: ${item.present ? 'Present' : 'Absència'}${item.potContenir ? ' (pot contenir)' : ''}`)
        .join(' · ');
      const ingredientsAfectats = data.ingredients
        .filter((ingredient) => ingredient.proveidorId === proveidor.id)
        .filter((ingredient) => ingredient.dataDeclaracio < latest.dataISO).length;
      return [
        proveidor.nom,
        latest.versio,
        formatISO(latest.dataISO),
        declaracions,
        ingredientsAfectats > 0 ? `${ingredientsAfectats} ingredients a revisar` : 'Actualitzat'
      ];
    });
  }, [data.ingredients, data.proveidors]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Control de fitxes tècniques i versions. Si hi ha una versió nova cal revisar els ingredients associats.
      </p>
      <Table headers={['Proveïdor', 'Versió', 'Data', 'Declaració', 'Revisions']} rows={rows} />
    </div>
  );
}
