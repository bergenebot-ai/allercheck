import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, NavLink } from 'react-router-dom';
import { useDataStore } from '../store/dataStore';
import { ToastProvider } from '../components/ToastProvider';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ComensalsPage } from '../features/comensals/ComensalsPage';
import { MenusPage } from '../features/menus/MenusPage';
import { PlatsPage } from '../features/plats/PlatsPage';
import { ProveidorsPage } from '../features/proveidors/ProveidorsPage';
import { ValidacioPage } from '../features/validacio/ValidacioPage';
import { AuditoriaPage } from '../features/auditoria/AuditoriaPage';
import { ConfiguracioPage } from '../features/configuracio/ConfiguracioPage';
import { TEXTS } from '../lib/texts';

const routes = [
  { path: '/dashboard', label: TEXTS.sidebar.dashboard, element: <DashboardPage /> },
  { path: '/comensals', label: TEXTS.sidebar.comensals, element: <ComensalsPage /> },
  { path: '/menus', label: TEXTS.sidebar.menus, element: <MenusPage /> },
  { path: '/plats', label: TEXTS.sidebar.plats, element: <PlatsPage /> },
  { path: '/proveidors', label: TEXTS.sidebar.proveidors, element: <ProveidorsPage /> },
  { path: '/validacio', label: TEXTS.sidebar.validacio, element: <ValidacioPage /> },
  { path: '/auditoria', label: TEXTS.sidebar.auditoria, element: <AuditoriaPage /> },
  { path: '/configuracio', label: TEXTS.sidebar.configuracio, element: <ConfiguracioPage /> }
];

function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const { data } = useDataStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const navLinks = useMemo(
    () =>
      routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={({ isActive }) =>
            `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          {route.label}
        </NavLink>
      )),
    []
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <aside className="sticky top-0 flex h-screen w-64 flex-col gap-4 border-r border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase text-primary-500">Certificació</p>
          <h1 className="text-lg font-bold">{TEXTS.appTitle}</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-auto">{navLinks}</nav>
        <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>{TEXTS.banners.demo}</p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode((value) => !value)}
              className="h-4 w-4 rounded border-slate-300"
            />
            Mode fosc
          </label>
          <p>Dades: {data.toggles.rols ? 'Rols actius' : 'Rols ocults'}</p>
        </div>
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold">Certificació contínua · Menús segurs</h2>
            <button
              onClick={() => window.print()}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Imprimeix / Desa PDF
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AppInner() {
  const init = useDataStore((state) => state.init);
  const hydrated = useDataStore((state) => state.hydrated);

  useEffect(() => {
    void init();
  }, [init]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-sm text-slate-500">Carregant dades de certificació…</p>
      </div>
    );
  }

  return <Layout />;
}

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ToastProvider>
  );
}
