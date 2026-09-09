import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = join(__dirname, "..", "..", "web");
const desktopDir = join(__dirname, "..");

let nextProcess;
let electronProcess;

function killAll() {
  if (electronProcess) electronProcess.kill();
  if (nextProcess) nextProcess.kill();
  process.exit(0);
}

process.on("SIGINT", killAll);
process.on("SIGTERM", killAll);

console.log("[1/2] Starting Next.js dev server...");

nextProcess = spawn("npx", ["next", "dev"], {
  cwd: webDir,
  stdio: "inherit",
  shell: true,
});

nextProcess.on("error", (err) => {
  console.error("Next.js failed to start:", err);
  process.exit(1);
});

console.log("[2/2] Waiting for Next.js to compile (8s)...");

setTimeout(() => {
  console.log("[2/2] Starting Electron...");

  electronProcess = spawn("npx", ["electron", "."], {
    cwd: desktopDir,
    stdio: "inherit",
    shell: true,
  });

  electronProcess.on("close", () => {
    console.log("Electron closed. Stopping Next.js...");
    killAll();
  });
}, 8000);
