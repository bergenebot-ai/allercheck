import { useDataStore } from '../../store/dataStore';
import { storageBackend } from '../../lib/storage';
import { Button } from '../../components/Button';
import { TEXTS } from '../../lib/texts';

export function ConfiguracioPage() {
  const { data } = useDataStore();
  const toggleFeature = useDataStore((state) => state.toggleFeature);
  const toggleAnonimitza = useDataStore((state) => state.toggleAnonimitza);
  const applySeed = useDataStore((state) => state.applySeed);
  const clearData = useDataStore((state) => state.clearData);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="text-lg font-semibold">Opcions del sistema</h3>
        <p className="text-sm text-slate-500">Backend d'emmagatzematge: {storageBackend}</p>
        <p className="text-sm text-slate-500">Funcions de rols: {data.toggles.rols ? 'Actives' : 'Inactives'}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => applySeed()}>
            {TEXTS.actions.generacioSeeds}
          </Button>
          <Button variant="ghost" onClick={() => clearData()}>
            {TEXTS.actions.neteja}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-md font-semibold">Mòduls opcionals</h4>
          <div className="mt-3 space-y-2 text-sm">
            {Object.entries(data.toggles).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700">
                <span className="capitalize">{key}</span>
                <input type="checkbox" checked={value} onChange={() => toggleFeature(key as keyof typeof data.toggles)} />
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-md font-semibold">Protecció de dades demo</h4>
          <label className="mt-2 flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
            <span>Anonimitza noms de comensals</span>
            <input type="checkbox" checked={data.anonimitza} onChange={() => toggleAnonimitza()} />
          </label>
          <p className="mt-2 text-xs text-slate-500">
            Quan s'activa, les taules mostren codis enlloc de noms reals per facilitar la compartició d'informes.
          </p>
        </div>
      </div>
    </div>
  );
}
