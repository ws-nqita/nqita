import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const sourceDir = path.resolve("out");
const deployDir = path.join(os.tmpdir(), "nqita-pages-deploy");

fs.rmSync(deployDir, { recursive: true, force: true });
fs.cpSync(sourceDir, deployDir, { recursive: true });

const result = spawnSync(
  "npx",
  [
    "wrangler",
    "pages",
    "deploy",
    deployDir,
    "--project-name",
    "nqita",
    "--branch",
    "main",
    "--commit-dirty=true"
  ],
  {
    stdio: "inherit",
    cwd: os.tmpdir()
  }
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
