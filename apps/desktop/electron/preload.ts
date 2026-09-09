import { contextBridge, ipcRenderer } from "electron";

const electronAPI = {
  setTitle: (title: string): void => {
    ipcRenderer.send("set-title", title);
  },
  getVersion: (): Promise<string> => {
    return ipcRenderer.invoke("get-version");
  },
  onMenuClick: (callback: (action: string) => void): (() => void) => {
    const handler = (_event: unknown, action: string): void => {
      callback(action);
    };
    ipcRenderer.on("menu-click", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("menu-click", handler as (...args: unknown[]) => void);
    };
  },

  // ─── File system ────────────────────────────────────────────────
  readFile: (path: string): Promise<string> => {
    return ipcRenderer.invoke("read-file", path);
  },
  writeFile: (path: string, content: string): Promise<void> => {
    return ipcRenderer.invoke("write-file", path, content);
  },
  listDirectory: (path: string): Promise<{ name: string; path: string; isDir: boolean }[]> => {
    return ipcRenderer.invoke("list-directory", path);
  },
  createDirectory: (path: string): Promise<void> => {
    return ipcRenderer.invoke("create-directory", path);
  },
  deleteFile: (path: string): Promise<void> => {
    return ipcRenderer.invoke("delete-file", path);
  },
  fileExists: (path: string): Promise<boolean> => {
    return ipcRenderer.invoke("file-exists", path);
  },

  // ─── Paths ──────────────────────────────────────────────────────
  getPaths: (): Promise<{ config: string; data: string; cache: string; home: string }> => {
    return ipcRenderer.invoke("get-paths");
  },

  // ─── Config ─────────────────────────────────────────────────────
  config: {
    read: (): Promise<{
      providers: Record<string, { name: string; baseUrl?: string; npm?: string }>;
      enabledModels: string[];
      customProviders: Record<string, { name: string; baseUrl: string }>;
    }> => {
      return ipcRenderer.invoke("config:read");
    },
    write: (config: {
      providers: Record<string, { name: string; npm: string; api?: string; baseUrl?: string }>;
      enabledModels: string[];
      customProviders: Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>;
    }): Promise<void> => {
      return ipcRenderer.invoke("config:write", config);
    },
    getProvider: (id: string): Promise<{ name: string; npm: string; api?: string; baseUrl?: string } | null> => {
      return ipcRenderer.invoke("config:get-provider", id);
    },
    setProvider: (id: string, data: { name: string; npm: string; api?: string; baseUrl?: string }): Promise<void> => {
      return ipcRenderer.invoke("config:set-provider", id, data);
    },
    deleteProvider: (id: string): Promise<void> => {
      return ipcRenderer.invoke("config:delete-provider", id);
    },
    getEnabledModels: (): Promise<string[]> => {
      return ipcRenderer.invoke("config:get-enabled-models");
    },
    setEnabledModels: (models: string[]): Promise<void> => {
      return ipcRenderer.invoke("config:set-enabled-models", models);
    },
    getCustomProviders: (): Promise<Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>> => {
      return ipcRenderer.invoke("config:get-custom-providers");
    },
    setCustomProvider: (id: string, data: { name: string; baseUrl: string; npm?: string; api?: string }): Promise<void> => {
      return ipcRenderer.invoke("config:set-custom-provider", id, data);
    },
    deleteCustomProvider: (id: string): Promise<void> => {
      return ipcRenderer.invoke("config:delete-custom-provider", id);
    },
  },

  // ─── Credentials (safeStorage) ──────────────────────────────────
  credentials: {
    get: (key: string): Promise<string | null> => {
      return ipcRenderer.invoke("creds:get", key);
    },
    set: (key: string, value: string): Promise<void> => {
      return ipcRenderer.invoke("creds:set", key, value);
    },
    delete: (key: string): Promise<void> => {
      return ipcRenderer.invoke("creds:delete", key);
    },
    list: (): Promise<string[]> => {
      return ipcRenderer.invoke("creds:list");
    },
    hasEncryption: (): Promise<boolean> => {
      return ipcRenderer.invoke("creds:has-encryption");
    },
  },

  // ─── Sessions (SQLite) ──────────────────────────────────────────
  sessions: {
    list: (): Promise<{ id: string; title: string; createdAt: number; updatedAt: number }[]> => {
      return ipcRenderer.invoke("sessions:list");
    },
    create: (id: string, title: string): Promise<void> => {
      return ipcRenderer.invoke("sessions:create", id, title);
    },
    update: (id: string, data: { title?: string }): Promise<void> => {
      return ipcRenderer.invoke("sessions:update", id, data);
    },
    delete: (id: string): Promise<void> => {
      return ipcRenderer.invoke("sessions:delete", id);
    },
    messages: (sessionId: string): Promise<{ id: string; role: string; content: string; createdAt: number }[]> => {
      return ipcRenderer.invoke("sessions:messages", sessionId);
    },
    addMessage: (id: string, sessionId: string, role: string, content: string): Promise<void> => {
      return ipcRenderer.invoke("sessions:add-message", id, sessionId, role, content);
    },
  },

  // ─── Commands ───────────────────────────────────────────────────
  executeCommand: (
    command: string,
    cwd?: string,
  ): Promise<{ stdout: string; stderr: string; code: number; error?: string }> => {
    return ipcRenderer.invoke("execute-command", command, cwd);
  },
  executeCommandStreaming: (
    command: string,
    cwd?: string,
  ): Promise<{ stdout: string; stderr: string; code: number }> => {
    return ipcRenderer.invoke("execute-command-streaming", command, cwd);
  },
  onTerminalStdout: (callback: (data: string) => void): (() => void) => {
    const handler = (_event: unknown, data: string): void => {
      callback(data);
    };
    ipcRenderer.on("terminal:stdout", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("terminal:stdout", handler as (...args: unknown[]) => void);
    };
  },
  onTerminalStderr: (callback: (data: string) => void): (() => void) => {
    const handler = (_event: unknown, data: string): void => {
      callback(data);
    };
    ipcRenderer.on("terminal:stderr", handler as (...args: unknown[]) => void);
    return () => {
      ipcRenderer.removeListener("terminal:stderr", handler as (...args: unknown[]) => void);
    };
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);

export type ElectronAPI = typeof electronAPI;
