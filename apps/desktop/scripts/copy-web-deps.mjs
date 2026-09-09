import { cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopDir = join(__dirname, "..");
const webDir = join(desktopDir, "..", "web");

const targets = [
  {
    src: join(webDir, ".next", "standalone"),
    dest: join(desktopDir, ".next-standalone"),
  },
  {
    src: join(webDir, ".next", "static"),
    dest: join(desktopDir, ".next-standalone", ".next", "static"),
  },
];

for (const { src, dest } of targets) {
  if (!existsSync(src)) {
    console.error(`Source not found: ${src}`);
    process.exit(1);
  }
  if (existsSync(dest)) {
    rmSync(dest, { recursive: true, force: true });
  }
  console.log(`Copying ${src} -> ${dest}`);
  cpSync(src, dest, { recursive: true });
}

console.log("Standalone build copied successfully.");
