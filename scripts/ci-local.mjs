import { spawnSync } from "node:child_process";
import { rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = new Set(process.argv.slice(2));
const withBuild = args.has("--build");
const withAudit = !args.has("--no-audit");
const withOutdated = !args.has("--no-outdated");

const passed = [];
const failed = [];
const informational = [];

function run(_step, command, argv, opts = {}) {
  const result = spawnSync(command, argv, { cwd: root, stdio: "inherit", ...opts });
  return result.status === 0;
}

function report(step, ok) {
  (ok ? passed : failed).push(step);
  console.log(ok ? `\n✓ ${step}` : `\n✗ ${step}`);
}

function info(step, ok) {
  informational.push(step);
  console.log(ok ? `\nℹ ${step}` : `\n⚠ ${step}`);
}

console.log("=== CI local (substitui GitHub Actions: vulnerabilidades, código morto, lint, tipos) ===");

report("Biome (lint + formatação)", run("biome", "npm", ["run", "check"]));

rmSync(join(root, "apps/web/.next/types"), { recursive: true, force: true });
report("TypeScript (tsc --noEmit)", run("tsc", "npx", ["tsc", "--noEmit"]));

report("Código morto (knip)", run("knip", "npx", ["knip"]));

report(
  "Presets do tema (drift)",
  run("presets", "npm", ["run", "generate:presets"]) &&
    run("presets-diff", "git", ["diff", "--exit-code", "--", "apps/web/src/lib/preferences/theme.ts"]),
);

if (withAudit) {
  report(
    "Vulnerabilidades (npm audit — equivalente local do CodeQL/Dependabot alerts)",
    run("audit", "npm", ["audit", "--audit-level=high"]),
  );
} else {
  info("npm audit", true);
}

if (withOutdated) {
  report(
    "Atualizações de dependências (npm outdated — equivalente local do Dependabot)",
    run("outdated", "npm", ["outdated"]),
  );
} else {
  info("npm outdated", true);
}

if (withBuild) {
  report("Build (next build)", run("build", "npm", ["run", "build"]));
} else {
  info("Build (opcional — rode com --build)", true);
}

console.log("\n=== Resumo ===");
console.log(`Passaram: ${passed.length} | Falharam: ${failed.length} | Informativos: ${informational.length}`);

if (failed.length > 0) {
  console.log("Falharam:");
  for (const step of failed) console.log(`  ✗ ${step}`);
  process.exit(1);
}

console.log("Tudo passou localmente.");
