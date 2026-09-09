import { app, BrowserWindow, shell, ipcMain, safeStorage } from "electron";
import * as path from "node:path";
import * as fs from "node:fs";
import { exec, spawn } from "node:child_process";
import os from "node:os";
import net from "node:net";

const isDev = !app.isPackaged;

// ─── XDG-style paths ───────────────────────────────────────────────
function getConfigDir(): string {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "workspaacing");
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "workspaacing");
  }
  // Linux / other
  const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), ".config");
  return path.join(xdgConfig, "workspaacing");
}

function getDataDir(): string {
  if (process.platform === "win32") {
    return path.join(process.env.APPDATA || path.join(os.homedir(), "AppData", "Roaming"), "workspaacing");
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "workspaacing");
  }
  const xdgData = process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
  return path.join(xdgData, "workspaacing");
}

function getCacheDir(): string {
  if (process.platform === "win32") {
    return path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local"), "workspaacing", "cache");
  }
  if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library", "Caches", "workspaacing");
  }
  const xdgCache = process.env.XDG_CACHE_HOME || path.join(os.homedir(), ".cache");
  return path.join(xdgCache, "workspaacing");
}

const CONFIG_DIR = getConfigDir();
const DATA_DIR = getDataDir();
const CACHE_DIR = getCacheDir();
const CONFIG_FILE = path.join(CONFIG_DIR, "config.json");
const CREDENTIALS_FILE = path.join(DATA_DIR, "credentials.enc");
const SESSIONS_DB = path.join(DATA_DIR, "sessions.db");

// ─── Ensure directories exist ──────────────────────────────────────
function ensureDirs(): void {
  for (const dir of [CONFIG_DIR, DATA_DIR, CACHE_DIR]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ─── Config file helpers ───────────────────────────────────────────
interface ProviderConfig {
  name: string;
  npm: string;
  api?: string;
  baseUrl?: string;
}

interface AppConfig {
  providers: Record<string, ProviderConfig>;
  enabledModels: string[];
  customProviders: Record<string, { name: string; baseUrl: string; npm?: string; api?: string }>;
}

const DEFAULT_CONFIG: AppConfig = {
  providers: {},
  enabledModels: [],
  customProviders: {},
};

function readConfig(): AppConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const raw = fs.readFileSync(CONFIG_FILE, "utf-8");
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_CONFIG;
}

function writeConfig(config: AppConfig): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

// ─── Credentials (safeStorage) ─────────────────────────────────────
interface CredentialStore {
  [key: string]: string; // base64 encoded encrypted values
}

function readCredentials(): CredentialStore {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const encrypted = fs.readFileSync(CREDENTIALS_FILE);
      if (safeStorage.isEncryptionAvailable()) {
        const decrypted = safeStorage.decryptString(encrypted);
        return JSON.parse(decrypted);
      }
      // Fallback: decrypt without OS encryption (not recommended)
      return JSON.parse(encrypted.toString("utf-8"));
    }
  } catch {
    /* ignore */
  }
  return {};
}

function writeCredentials(store: CredentialStore): void {
  const json = JSON.stringify(store);
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(json);
    fs.writeFileSync(CREDENTIALS_FILE, encrypted);
  } else {
    fs.writeFileSync(CREDENTIALS_FILE, json, "utf-8");
  }
}

// ─── SQLite sessions ───────────────────────────────────────────────
let db: import("better-sqlite3").Database | null = null;

function initDatabase(): void {
  try {
    // Dynamic import for better-sqlite3
    const Database = require("better-sqlite3");
    db = new Database(SESSIONS_DB);
    db!.pragma("journal_mode = WAL");
    db!.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT 'Nova sessão',
        created_at INTEGER NOT NULL DEFAULT (unixepoch('now')),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch('now')),
        data TEXT NOT NULL DEFAULT '{}'
      );
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch('now')),
        FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
      );
    `);
  } catch (err) {
    console.warn("SQLite not available, sessions will use fallback:", err);
  }
}

function getSessions(): { id: string; title: string; createdAt: number; updatedAt: number }[] {
  if (!db) return [];
  return db.prepare("SELECT id, title, created_at as createdAt, updated_at as updatedAt FROM sessions ORDER BY updated_at DESC").all() as { id: string; title: string; createdAt: number; updatedAt: number }[];
}

function createSession(id: string, title: string): void {
  if (!db) return;
  db.prepare("INSERT INTO sessions (id, title) VALUES (?, ?)").run(id, title);
}

function updateSession(id: string, data: { title?: string }): void {
  if (!db) return;
  if (data.title) {
    db.prepare("UPDATE sessions SET title = ?, updated_at = unixepoch('now') WHERE id = ?").run(data.title, id);
  }
}

function deleteSession(id: string): void {
  if (!db) return;
  db.prepare("DELETE FROM messages WHERE session_id = ?").run(id);
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id);
}

function getMessages(sessionId: string): { id: string; role: string; content: string; createdAt: number }[] {
  if (!db) return [];
  return db.prepare("SELECT id, role, content, created_at as createdAt FROM messages WHERE session_id = ? ORDER BY created_at ASC").all(sessionId) as { id: string; role: string; content: string; createdAt: number }[];
}

function addMessage(id: string, sessionId: string, role: string, content: string): void {
  if (!db) return;
  db.prepare("INSERT INTO messages (id, session_id, role, content) VALUES (?, ?, ?, ?)").run(id, sessionId, role, content);
  db.prepare("UPDATE sessions SET updated_at = unixepoch('now') WHERE id = ?").run(sessionId);
}

// ─── Electron main ─────────────────────────────────────────────────
let mainWindow: BrowserWindow | null = null;
let nextServer: import("node:child_process").ChildProcess | null = null;

function findAvailablePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        resolve(addr.port);
      } else {
        reject(new Error("Failed to find available port"));
      }
      server.close();
    });
    server.on("error", reject);
  });
}

function startNextServer(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const appRoot = isDev ? path.join(__dirname, "..", "..") : path.dirname(app.getAppPath());
    const serverJs = path.join(appRoot, ".next-standalone", "server.js");

    nextServer = spawn(process.execPath, [serverJs], {
      cwd: appRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
    });

    nextServer.stdout?.on("data", (data: Buffer) => {
      const msg = data.toString();
      if (msg.includes("Ready") || msg.includes("ready")) {
        resolve();
      }
    });

    nextServer.stderr?.on("data", (data: Buffer) => {
      const msg = data.toString();
      if (msg.includes("Ready") || msg.includes("ready")) {
        resolve();
      }
    });

    nextServer.on("error", reject);
    nextServer.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        reject(new Error(`Next.js server exited with code ${code}`));
      }
    });

    setTimeout(() => resolve(), 5000);
  });
}

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Workspaacing",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 16, y: 16 },
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    const port = await findAvailablePort();
    try {
      await startNextServer(port);
      mainWindow.loadURL(`http://localhost:${port}`);
    } catch (err) {
      console.error("Failed to start Next.js server:", err);
      mainWindow.loadURL("data:text/html,<h1>Failed to start server</h1>");
    }
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }: { url: string }) => {
    shell.openExternal(url);
    return { action: "deny" as const };
  });
}

function registerIPC(): void {
  ipcMain.handle("get-version", () => app.getVersion());

  ipcMain.on("set-title", (_event, title: string) => {
    if (mainWindow) {
      mainWindow.setTitle(title);
    }
  });

  // ─── File system (generic) ─────────────────────────────────────
  ipcMain.handle("read-file", async (_event, filePath: string) => {
    return fs.promises.readFile(filePath, "utf-8");
  });

  ipcMain.handle("write-file", async (_event, filePath: string, content: string) => {
    await fs.promises.writeFile(filePath, content, "utf-8");
  });

  ipcMain.handle("list-directory", async (_event, dirPath: string) => {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDir: entry.isDirectory(),
    }));
  });

  ipcMain.handle("create-directory", async (_event, dirPath: string) => {
    await fs.promises.mkdir(dirPath, { recursive: true });
  });

  ipcMain.handle("delete-file", async (_event, filePath: string) => {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await fs.promises.rm(filePath, { recursive: true });
    } else {
      await fs.promises.unlink(filePath);
    }
  });

  ipcMain.handle("file-exists", async (_event, filePath: string) => {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  });

  // ─── Paths ─────────────────────────────────────────────────────
  ipcMain.handle("get-paths", () => ({
    config: CONFIG_DIR,
    data: DATA_DIR,
    cache: CACHE_DIR,
    home: os.homedir(),
  }));

  // ─── Config ────────────────────────────────────────────────────
  ipcMain.handle("config:read", () => readConfig());

  ipcMain.handle("config:write", (_event, config: AppConfig) => {
    writeConfig(config);
  });

  ipcMain.handle("config:get-provider", (_event, providerId: string) => {
    const config = readConfig();
    return config.providers[providerId] || null;
  });

  ipcMain.handle("config:set-provider", (_event, providerId: string, data: ProviderConfig) => {
    const config = readConfig();
    config.providers[providerId] = data;
    writeConfig(config);
  });

  ipcMain.handle("config:delete-provider", (_event, providerId: string) => {
    const config = readConfig();
    delete config.providers[providerId];
    writeConfig(config);
  });

  ipcMain.handle("config:get-enabled-models", () => {
    return readConfig().enabledModels;
  });

  ipcMain.handle("config:set-enabled-models", (_event, models: string[]) => {
    const config = readConfig();
    config.enabledModels = models;
    writeConfig(config);
  });

  ipcMain.handle("config:get-custom-providers", () => {
    return readConfig().customProviders;
  });

  ipcMain.handle("config:set-custom-provider", (_event, id: string, data: { name: string; baseUrl: string; npm?: string; api?: string }) => {
    const config = readConfig();
    config.customProviders[id] = data;
    writeConfig(config);
  });

  ipcMain.handle("config:delete-custom-provider", (_event, id: string) => {
    const config = readConfig();
    delete config.customProviders[id];
    writeConfig(config);
  });

  // ─── Credentials (safeStorage) ─────────────────────────────────
  ipcMain.handle("creds:get", (_event, key: string) => {
    const store = readCredentials();
    return store[key] || null;
  });

  ipcMain.handle("creds:set", (_event, key: string, value: string) => {
    const store = readCredentials();
    store[key] = value;
    writeCredentials(store);
  });

  ipcMain.handle("creds:delete", (_event, key: string) => {
    const store = readCredentials();
    delete store[key];
    writeCredentials(store);
  });

  ipcMain.handle("creds:list", () => {
    const store = readCredentials();
    return Object.keys(store);
  });

  ipcMain.handle("creds:has-encryption", () => safeStorage.isEncryptionAvailable());

  // ─── Sessions (SQLite) ─────────────────────────────────────────
  ipcMain.handle("sessions:list", () => getSessions());

  ipcMain.handle("sessions:create", (_event, id: string, title: string) => {
    createSession(id, title);
  });

  ipcMain.handle("sessions:update", (_event, id: string, data: { title?: string }) => {
    updateSession(id, data);
  });

  ipcMain.handle("sessions:delete", (_event, id: string) => {
    deleteSession(id);
  });

  ipcMain.handle("sessions:messages", (_event, sessionId: string) => {
    return getMessages(sessionId);
  });

  ipcMain.handle("sessions:add-message", (_event, id: string, sessionId: string, role: string, content: string) => {
    addMessage(id, sessionId, role, content);
  });

  // ─── Execute commands ──────────────────────────────────────────
  ipcMain.handle("execute-command", async (_event, command: string, cwd?: string) => {
    return new Promise((resolve, reject) => {
      exec(command, { cwd: cwd || process.cwd() }, (error, stdout, stderr) => {
        resolve({
          stdout,
          stderr,
          code: error?.code ?? 0,
          error: error?.message,
        });
      });
    });
  });

  ipcMain.handle("execute-command-streaming", async (event, command: string, cwd?: string) => {
    return new Promise((resolve, reject) => {
      const child = spawn("sh", ["-c", command], {
        cwd: cwd || process.cwd(),
        stdio: ["ignore", "pipe", "pipe"],
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data: Buffer) => {
        const line = data.toString();
        stdout += line;
        event.sender.send("terminal:stdout", line);
      });

      child.stderr?.on("data", (data: Buffer) => {
        const line = data.toString();
        stderr += line;
        event.sender.send("terminal:stderr", line);
      });

      child.on("close", (code) => {
        resolve({ stdout, stderr, code });
      });

      child.on("error", (error) => {
        reject(error.message);
      });
    });
  });
}

app.whenReady().then(() => {
  ensureDirs();
  initDatabase();
  registerIPC();
  createWindow();
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (db) {
    db.close();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
