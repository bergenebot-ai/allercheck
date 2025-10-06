import Papa from 'papaparse';
import { formatISO } from './date';
import type { AuditEntry, Menu, PersistedState, ValidationSummary } from './types';

function downloadBlob(filename: string, blob: Blob) {
  if (typeof window === 'undefined') return;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(link.href), 0);
}

export function exportValidationCsv(summaries: ValidationSummary[]) {
  const rows = summaries.flatMap((summary) =>
    summary.incidents.map((incident) => ({
      menuId: summary.menuId,
      dataValidacio: formatISO(summary.generatedAt),
      comensalId: incident.comensalId,
      platId: incident.platId,
      alergogen: incident.alergogen,
      severitat: incident.severitat,
      descripcio: incident.descripcio,
      proveidor: incident.traçabilitat.proveidorId,
      ingredient: incident.traçabilitat.ingredientId,
      versio: incident.traçabilitat.versioFitxa ?? 'n/d'
    }))
  );
  const csv = Papa.unparse(rows);
  downloadBlob(`validacions-${Date.now()}.csv`, new Blob([csv], { type: 'text/csv' }));
}

export function exportAuditCsv(entries: AuditEntry[]) {
  const rows = entries.map((entry) => ({
    id: entry.id,
    tipus: entry.tipus,
    usuari: entry.usuari,
    rol: entry.rol,
    data: formatISO(entry.dataISO),
    accio: entry.accio,
    abans: entry.abans,
    despres: entry.despres,
    hash: entry.hash
  }));
  const csv = Papa.unparse(rows);
  downloadBlob(`auditoria-${Date.now()}.csv`, new Blob([csv], { type: 'text/csv' }));
}

export function openPrintableReport(menu: Menu, summary: ValidationSummary, data: PersistedState) {
  if (typeof window === 'undefined') return;
  const comensalsById = Object.fromEntries(data.comensals.map((c) => [c.id, c] as const));
  const platsById = Object.fromEntries(data.plats.map((p) => [p.id, p] as const));
  const html = `<!DOCTYPE html>
  <html lang="ca">
    <head>
      <meta charset="utf-8" />
      <title>Informe de certificació ${menu.id}</title>
      <style>
        body { font-family: 'Inter', sans-serif; margin: 2rem; }
        header { border-bottom: 2px solid #0f88ff; margin-bottom: 1rem; padding-bottom: 1rem; }
        h1 { font-size: 1.8rem; margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
        th, td { border: 1px solid #d1d5db; padding: 0.5rem; text-align: left; }
        th { background: #f3f4f6; }
        .badge { padding: 0.25rem 0.5rem; border-radius: 0.5rem; display: inline-block; }
        .error { background: #fee2e2; color: #b91c1c; }
        .risk { background: #fef3c7; color: #b45309; }
        .review { background: #e0e7ff; color: #3730a3; }
      </style>
    </head>
    <body>
      <header>
        <h1>Informe de certificació</h1>
        <p>Menú ${formatISO(menu.dataISO)} (${menu.torn}) · Estat: ${menu.estat}</p>
        <p>Segells: ${menu.segells
          .map((s) => `${s.rol} - ${s.usuari} (${formatISO(s.dataISO)})`)
          .join(', ') || 'Cap'}</p>
      </header>
      <section>
        <h2>Assignacions</h2>
        <table>
          <thead>
            <tr>
              <th>Comensal</th>
              <th>Plat</th>
              <th>Dieta</th>
            </tr>
          </thead>
          <tbody>
            ${menu.assignacions
              .map((assignacio) => {
                const comensal = comensalsById[assignacio.comensalId];
                const plat = platsById[assignacio.platId];
                return `<tr><td>${comensal?.nom ?? assignacio.comensalId}</td><td>${
                  plat?.nom ?? assignacio.platId
                }</td><td>${comensal?.dieta ?? 'n/d'}</td></tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Incidències</h2>
        <table>
          <thead>
            <tr>
              <th>Severitat</th>
              <th>Comensal</th>
              <th>Plat</th>
              <th>Al·lergogen</th>
              <th>Descripció</th>
              <th>Traçabilitat</th>
            </tr>
          </thead>
          <tbody>
            ${summary.incidents
              .map((incident) => {
                const badgeClass =
                  incident.severitat === 'ERROR'
                    ? 'badge error'
                    : incident.severitat === 'RISC'
                    ? 'badge risk'
                    : 'badge review';
                return `<tr>
                  <td><span class="${badgeClass}">${incident.severitat}</span></td>
                  <td>${comensalsById[incident.comensalId]?.nom ?? incident.comensalId}</td>
                  <td>${platsById[incident.platId]?.nom ?? incident.platId}</td>
                  <td>${incident.alergogen}</td>
                  <td>${incident.descripcio}</td>
                  <td>${incident.traçabilitat.ingredientId} · ${incident.traçabilitat.proveidorId} · ${
                  incident.traçabilitat.versioFitxa ?? 'n/d'
                }</td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </section>
    </body>
  </html>`;
  const popup = window.open('', '_blank');
  if (!popup) return;
  popup.document.write(html);
  popup.document.close();
  popup.focus();
}
