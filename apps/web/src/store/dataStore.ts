import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { storageClient } from '../lib/storage';
import { nowISO } from '../lib/date';
import { seedState } from '../data/seeds';
import { summariseAllMenus, validateMenu } from '../lib/validation';
import type {
  AuditEntry,
  Menu,
  PersistedState,
  Segell,
  ValidationSummary
} from '../lib/types';

const cloneState = (state: PersistedState): PersistedState =>
  JSON.parse(JSON.stringify(state)) as PersistedState;

interface DataStoreState {
  data: PersistedState;
  hydrated: boolean;
  validations: Record<string, ValidationSummary>;
  init: () => Promise<void>;
  validateAll: () => void;
  validateMenu: (menuId: string) => void;
  addSegell: (menuId: string, segell: Segell) => void;
  resetSegells: (menuId: string) => void;
  applySeed: () => Promise<void>;
  clearData: () => Promise<void>;
  toggleFeature: (key: keyof PersistedState['toggles']) => void;
  toggleAnonimitza: () => void;
  addAudit: (entry: Omit<AuditEntry, 'id' | 'hash' | 'dataISO'>) => void;
}

function hashSnapshot(snapshot: unknown): string {
  const json = JSON.stringify(snapshot);
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash << 5) - hash + json.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36).slice(0, 8);
}

function deriveMenuStatus(menu: Menu, summary: ValidationSummary): Menu['estat'] {
  const hasError = summary.incidents.some((incident) => incident.severitat === 'ERROR');
  const hasReview = summary.incidents.some((incident) => incident.severitat === 'REVISIO');
  if (hasReview) return 'REVISIO';
  if (hasError) return 'BORRADOR';

  const hasDN = menu.segells.some((segell) => segell.rol === 'DN');
  const hasTA = menu.segells.some((segell) => segell.rol === 'TA');
  if (hasDN && hasTA) return 'CERTIFICAT';
  if (hasDN) return 'VALIDAT_1_2';
  if (hasTA) return 'VALIDAT_2_2';
  return 'BORRADOR';
}

async function persistState(data: PersistedState) {
  await storageClient.save(data);
}

export const useDataStore = create<DataStoreState>((set, get) => ({
  data: cloneState(seedState),
  hydrated: false,
  validations: {},
  init: async () => {
    const persisted = await storageClient.load();
    const base = persisted ? cloneState(persisted) : cloneState(seedState);
    set({ data: base, hydrated: true });
    get().validateAll();
  },
  validateAll: () => {
    const { data } = get();
    const summaries = summariseAllMenus(data);
    const validations = Object.fromEntries(summaries.map((summary) => [summary.menuId, summary]));
    const updatedMenus = data.menus.map((menu) => ({
      ...menu,
      estat: deriveMenuStatus(menu, validations[menu.id])
    }));
    const updatedState: PersistedState = { ...data, menus: updatedMenus };
    set({ data: updatedState, validations });
    void persistState(updatedState);
  },
  validateMenu: (menuId: string) => {
    const { data, validations } = get();
    const menu = data.menus.find((item) => item.id === menuId);
    if (!menu) return;
    const summary = validateMenu(menu, data);
    const nextValidations = { ...validations, [menuId]: summary };
    const updatedMenus = data.menus.map((item) =>
      item.id === menuId ? { ...item, estat: deriveMenuStatus(item, summary) } : item
    );
    const updatedState: PersistedState = { ...data, menus: updatedMenus };
    set({ data: updatedState, validations: nextValidations });
    void persistState(updatedState);
  },
  addSegell: (menuId, segell) => {
    const { data, addAudit } = get();
    const menu = data.menus.find((item) => item.id === menuId);
    if (!menu) return;
    const segells = menu.segells.filter((item) => item.rol !== segell.rol).concat(segell);
    const updatedMenus = data.menus.map((item) =>
      item.id === menuId
        ? {
            ...item,
            segells
          }
        : item
    );
    const updatedState: PersistedState = { ...data, menus: updatedMenus };
    const summary = validateMenu({ ...menu, segells }, updatedState);
    const estat = deriveMenuStatus({ ...menu, segells }, summary);
    const finalMenus = updatedMenus.map((item) =>
      item.id === menuId ? { ...item, estat } : item
    );
    const finalState: PersistedState = { ...updatedState, menus: finalMenus };
    set({ data: finalState, validations: { ...get().validations, [menuId]: summary } });
    void persistState(finalState);
    addAudit({
      tipus: 'SEGELL',
      usuari: segell.usuari,
      rol: segell.rol,
      accio: `Afegit segell ${segell.rol} al menú ${menuId}`,
      abans: JSON.stringify(menu.segells),
      despres: JSON.stringify(segells)
    });
  },
  resetSegells: (menuId) => {
    const { data, addAudit } = get();
    const menu = data.menus.find((item) => item.id === menuId);
    if (!menu) return;
    const updatedMenus = data.menus.map((item) =>
      item.id === menuId ? { ...item, segells: [], estat: 'BORRADOR' } : item
    );
    const updatedState: PersistedState = { ...data, menus: updatedMenus };
    set({ data: updatedState });
    void persistState(updatedState);
    addAudit({
      tipus: 'SEGELL',
      usuari: 'sistema',
      rol: 'DN',
      accio: `Segells reiniciats al menú ${menuId}`,
      abans: JSON.stringify(menu.segells),
      despres: '[]'
    });
  },
  applySeed: async () => {
    const cloned = cloneState(seedState);
    set({ data: cloned });
    get().validateAll();
    await persistState(cloned);
  },
  clearData: async () => {
    await storageClient.clear();
    const cloned = cloneState(seedState);
    set({ data: cloned, validations: {} });
    get().validateAll();
  },
  toggleFeature: (key) => {
    const { data } = get();
    const toggles = { ...data.toggles, [key]: !data.toggles[key] };
    const updatedState: PersistedState = { ...data, toggles };
    set({ data: updatedState });
    void persistState(updatedState);
  },
  toggleAnonimitza: () => {
    const { data } = get();
    const updatedState: PersistedState = { ...data, anonimitza: !data.anonimitza };
    set({ data: updatedState });
    void persistState(updatedState);
  },
  addAudit: (entry) => {
    const { data } = get();
    const auditEntry: AuditEntry = {
      id: nanoid(),
      dataISO: nowISO(),
      hash: hashSnapshot(data),
      ...entry
    };
    const auditories = [auditEntry, ...data.auditories].slice(0, 200);
    const updatedState: PersistedState = { ...data, auditories };
    set({ data: updatedState });
    void persistState(updatedState);
  }
}));
