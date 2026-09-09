/**
 * Unified storage layer that works in both Electron and web environments.
 *
 * - Electron: Uses IPC to access config files, safeStorage credentials, and SQLite sessions
 * - Web: Uses IndexedDB for sessions and localStorage for config/credentials (with warnings)
 */

const isElectron = typeof window !== "undefined" && window.electronAPI != null;

function getElectronAPI(): NonNullable<Window["electronAPI"]> {
  if (!window.electronAPI) throw new Error("Electron API not available");
  return window.electronAPI;
}

// ─── Config ────────────────────────────────────────────────────────
export interface ProviderConfig {
  name: string;
  npm: string;
  api?: string;
  baseUrl?: string;
}

export interface AppConfig {
  providers: Record<string, ProviderConfig>;
  enabledModels: string[];
  customProviders: Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>;
}

const DEFAULT_CONFIG: AppConfig = {
  providers: {},
  enabledModels: [],
  customProviders: {},
};

const CONFIG_KEY = "workspaacing:config";

export const configStorage = {
  async read(): Promise<AppConfig> {
    if (isElectron) {
      return getElectronAPI().config.read() ?? DEFAULT_CONFIG;
    }
    try {
      const raw = localStorage.getItem(CONFIG_KEY);
      if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    } catch {
      /* ignore */
    }
    return DEFAULT_CONFIG;
  },

  async write(config: AppConfig): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.write(config);
    }
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  async getProvider(id: string): Promise<ProviderConfig | null> {
    if (isElectron) {
      return getElectronAPI().config.getProvider(id);
    }
    const config = await configStorage.read();
    return config.providers[id] || null;
  },

  async setProvider(id: string, data: ProviderConfig): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.setProvider(id, data);
    }
    const config = await configStorage.read();
    config.providers[id] = data;
    await configStorage.write(config);
  },

  async deleteProvider(id: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.deleteProvider(id);
    }
    const config = await configStorage.read();
    delete config.providers[id];
    await configStorage.write(config);
  },

  async getEnabledModels(): Promise<string[]> {
    if (isElectron) {
      return getElectronAPI().config.getEnabledModels();
    }
    const config = await configStorage.read();
    return config.enabledModels;
  },

  async setEnabledModels(models: string[]): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.setEnabledModels(models);
    }
    const config = await configStorage.read();
    config.enabledModels = models;
    await configStorage.write(config);
  },

  async getCustomProviders(): Promise<Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>> {
    if (isElectron) {
      return getElectronAPI().config.getCustomProviders();
    }
    const config = await configStorage.read();
    return config.customProviders;
  },

  async setCustomProvider(
    id: string,
    data: { name: string; baseUrl: string; npm?: string; api?: string },
  ): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.setCustomProvider(id, data);
    }
    const config = await configStorage.read();
    config.customProviders[id] = data;
    await configStorage.write(config);
  },

  async deleteCustomProvider(id: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().config.deleteCustomProvider(id);
    }
    const config = await configStorage.read();
    delete config.customProviders[id];
    await configStorage.write(config);
  },
};

// ─── Credentials ───────────────────────────────────────────────────
const CREDS_KEY = "workspaacing:credentials";

export const credentialsStorage = {
  async get(key: string): Promise<string | null> {
    if (isElectron) {
      return getElectronAPI().credentials.get(key);
    }
    // Web fallback: localStorage (NOT secure - warn in console)
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        return store[key] || null;
      }
    } catch {
      /* ignore */
    }
    return null;
  },

  async set(key: string, value: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().credentials.set(key, value);
    }
    // Web fallback: localStorage (NOT secure)
    console.warn("[Workspaacing] API keys stored in localStorage. Use Electron desktop app for secure storage.");
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      const store = raw ? JSON.parse(raw) : {};
      store[key] = value;
      localStorage.setItem(CREDS_KEY, JSON.stringify(store));
    } catch {
      /* ignore */
    }
  },

  async delete(key: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().credentials.delete(key);
    }
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        delete store[key];
        localStorage.setItem(CREDS_KEY, JSON.stringify(store));
      }
    } catch {
      /* ignore */
    }
  },

  async list(): Promise<string[]> {
    if (isElectron) {
      return getElectronAPI().credentials.list();
    }
    try {
      const raw = localStorage.getItem(CREDS_KEY);
      if (raw) return Object.keys(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    return [];
  },

  async hasEncryption(): Promise<boolean> {
    if (isElectron) {
      return getElectronAPI().credentials.hasEncryption();
    }
    return false;
  },
};

// ─── Sessions (IndexedDB for web, SQLite for Electron) ─────────────
const DB_NAME = "workspaacing";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("sessions")) {
        const store = db.createObjectStore("sessions", { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
      if (!db.objectStoreNames.contains("messages")) {
        const store = db.createObjectStore("messages", { keyPath: "id" });
        store.createIndex("sessionId", "sessionId");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  sessionId?: string;
  role: string;
  content: string;
  createdAt: number;
}

const _sessionsStorage = {
  async list(): Promise<Session[]> {
    if (isElectron) {
      return getElectronAPI().sessions.list();
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sessions", "readonly");
      const store = tx.objectStore("sessions");
      const index = store.index("updatedAt");
      const request = index.openCursor(null, "prev");
      const results: Session[] = [];
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          results.push(cursor.value as Session);
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },

  async create(id: string, title: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().sessions.create(id, title);
    }
    const db = await openDB();
    const now = Date.now();
    const session: Session = { id, title, createdAt: now, updatedAt: now };
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sessions", "readwrite");
      tx.objectStore("sessions").put(session);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async update(id: string, data: { title?: string }): Promise<void> {
    if (isElectron) {
      return getElectronAPI().sessions.update(id, data);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sessions", "readwrite");
      const store = tx.objectStore("sessions");
      const getReq = store.get(id);
      getReq.onsuccess = () => {
        const session = getReq.result as Session | undefined;
        if (session) {
          if (data.title) session.title = data.title;
          session.updatedAt = Date.now();
          store.put(session);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async delete(id: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().sessions.delete(id);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["sessions", "messages"], "readwrite");
      tx.objectStore("sessions").delete(id);
      const messagesStore = tx.objectStore("messages");
      const index = messagesStore.index("sessionId");
      const request = index.openCursor(IDBKeyRange.only(id));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async messages(sessionId: string): Promise<Message[]> {
    if (isElectron) {
      return getElectronAPI().sessions.messages(sessionId);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("messages", "readonly");
      const index = tx.objectStore("messages").index("sessionId");
      const request = index.getAll(IDBKeyRange.only(sessionId));
      request.onsuccess = () => {
        const messages = (request.result as Message[]).sort((a, b) => a.createdAt - b.createdAt);
        resolve(messages);
      };
      request.onerror = () => reject(request.error);
    });
  },

  async addMessage(id: string, sessionId: string, role: string, content: string): Promise<void> {
    if (isElectron) {
      return getElectronAPI().sessions.addMessage(id, sessionId, role, content);
    }
    const db = await openDB();
    const now = Date.now();
    const message: Message = { id, sessionId, role, content, createdAt: now };
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["messages", "sessions"], "readwrite");
      tx.objectStore("messages").put(message);
      const sessionsStore = tx.objectStore("sessions");
      const getReq = sessionsStore.get(sessionId);
      getReq.onsuccess = () => {
        const session = getReq.result as Session | undefined;
        if (session) {
          session.updatedAt = now;
          sessionsStore.put(session);
        }
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
};

// ─── Paths ─────────────────────────────────────────────────────────
const _pathsStorage = {
  async get(): Promise<{ config: string; data: string; cache: string; home: string }> {
    if (isElectron) {
      return getElectronAPI().getPaths();
    }
    return {
      config: "~/.config/workspaacing",
      data: "~/.local/share/workspaacing",
      cache: "~/.cache/workspaacing",
      home: "~",
    };
  },
};
