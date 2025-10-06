import { useMemo } from 'react';
import { useDataStore } from '../../store/dataStore';
import { Table } from '../../components/Table';
import { exportAuditCsv } from '../../lib/export';
import { formatISO } from '../../lib/date';
import { Button } from '../../components/Button';

export function AuditoriaPage() {
  const { data } = useDataStore();

  const rows = useMemo(() => {
    return data.auditories.map((entrada) => [
      entrada.tipus,
      entrada.usuari,
      entrada.rol,
      formatISO(entrada.dataISO),
      entrada.accio,
      <code key={`${entrada.id}-abans`} className="whitespace-pre-wrap text-xs">{entrada.abans}</code>,
      <code key={`${entrada.id}-despres`} className="whitespace-pre-wrap text-xs">{entrada.despres}</code>,
      entrada.hash
    ]);
  }, [data.auditories]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Registre d'auditoria</h3>
          <p className="text-sm text-slate-500">
            Traçabilitat completa d'accions, amb hash curt del dataset en el moment de cada operació.
          </p>
        </div>
        <Button variant="secondary" onClick={() => exportAuditCsv(data.auditories)}>
          Exporta auditoria CSV
        </Button>
      </div>
      <Table
        headers={['Tipus', 'Usuari', 'Rol', 'Data', 'Acció', 'Abans', 'Després', 'Hash']}
        rows={rows}
        emptyMessage="Encara no hi ha accions registrades"
      />
    </div>
  );
}
