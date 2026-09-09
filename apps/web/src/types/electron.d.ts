interface ElectronAPI {
  setTitle: (title: string) => void;
  getVersion: () => Promise<string>;
  getPaths: () => Promise<{ config: string; data: string; cache: string; home: string }>;
  config: {
    read: () => Promise<{
      providers: Record<string, { name: string; npm: string; api?: string; baseUrl?: string }>;
      enabledModels: string[];
      customProviders: Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>;
    }>;
    write: (config: {
      providers: Record<string, { name: string; npm: string; api?: string; baseUrl?: string }>;
      enabledModels: string[];
      customProviders: Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>;
    }) => Promise<void>;
    getProvider: (id: string) => Promise<{ name: string; npm: string; api?: string; baseUrl?: string } | null>;
    setProvider: (id: string, data: { name: string; npm: string; api?: string; baseUrl?: string }) => Promise<void>;
    deleteProvider: (id: string) => Promise<void>;
    getEnabledModels: () => Promise<string[]>;
    setEnabledModels: (models: string[]) => Promise<void>;
    getCustomProviders: () => Promise<Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>>;
    setCustomProvider: (
      id: string,
      data: { name: string; baseUrl: string; npm?: string; api?: string },
    ) => Promise<void>;
    deleteCustomProvider: (id: string) => Promise<void>;
  };
  credentials: {
    get: (key: string) => Promise<string | null>;
    set: (key: string, value: string) => Promise<void>;
    delete: (key: string) => Promise<void>;
    list: () => Promise<string[]>;
    hasEncryption: () => Promise<boolean>;
  };
  sessions: {
    list: () => Promise<{ id: string; title: string; createdAt: number; updatedAt: number }[]>;
    create: (id: string, title: string) => Promise<void>;
    update: (id: string, data: { title?: string }) => Promise<void>;
    delete: (id: string) => Promise<void>;
    messages: (sessionId: string) => Promise<{ id: string; role: string; content: string; createdAt: number }[]>;
    addMessage: (id: string, sessionId: string, role: string, content: string) => Promise<void>;
  };
  executeCommand: (
    command: string,
    cwd?: string,
  ) => Promise<{ stdout: string; stderr: string; code: number; error?: string }>;
  executeCommandStreaming: (command: string, cwd?: string) => Promise<{ stdout: string; stderr: string; code: number }>;
  onTerminalStdout: (callback: (data: string) => void) => () => void;
  onTerminalStderr: (callback: (data: string) => void) => () => void;
}

interface Window {
  electronAPI?: ElectronAPI;
}
