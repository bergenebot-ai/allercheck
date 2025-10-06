import Dexie from 'dexie';
import type { PersistedState } from './types';

const STORAGE_KEY = 'certi-menus-state';

type StorageBackend = 'localStorage' | 'dexie';

interface StorageClient {
  load(): Promise<PersistedState | undefined>;
  save(data: PersistedState): Promise<void>;
  clear(): Promise<void>;
}

class DexieClient implements StorageClient {
  private db: Dexie;

  constructor() {
    this.db = new Dexie('certi-menus');
    this.db.version(1).stores({ snapshots: 'id' });
  }

  async load(): Promise<PersistedState | undefined> {
    const row = await (this.db.table('snapshots') as Dexie.Table<{ id: number; data: PersistedState }, number>).get(
      1
    );
    return row?.data;
  }

  async save(data: PersistedState): Promise<void> {
    await (this.db.table('snapshots') as Dexie.Table<{ id: number; data: PersistedState }, number>).put({
      id: 1,
      data
    });
  }

  async clear(): Promise<void> {
    await (this.db.table('snapshots') as Dexie.Table<{ id: number; data: PersistedState }, number>).clear();
  }
}

class LocalStorageClient implements StorageClient {
  async load(): Promise<PersistedState | undefined> {
    if (typeof localStorage === 'undefined') return undefined;
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as PersistedState) : undefined;
  }

  async save(data: PersistedState): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async clear(): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function createStorageClient(kind: StorageBackend): StorageClient {
  if (kind === 'dexie') {
    return new DexieClient();
  }
  return new LocalStorageClient();
}

export const storageBackend: StorageBackend =
  (import.meta.env.VITE_STORAGE_BACKEND as StorageBackend) || 'localStorage';

export const storageClient = createStorageClient(storageBackend);
