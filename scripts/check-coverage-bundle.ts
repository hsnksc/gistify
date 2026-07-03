/**
 * Coverage sayfası chunk'ının gzip boyutunu kontrol eder.
 * Hedef: client JS artışı <= 60KB gzip (coverage chunk başına).
 */

import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const DIST_DIR = path.resolve(import.meta.dirname, "..", "dist", "public", "assets");
const BUDGET_KB = 60;

function findCoverageChunk(): string | null {
  if (!fs.existsSync(DIST_DIR)) {
    return null;
  }
  const files = fs.readdirSync(DIST_DIR);
  return files.find(name => /^Coverage-.*\.js$/.test(name)) ?? null;
}

function main() {
  const chunk = findCoverageChunk();
  if (!chunk) {
    console.error("Coverage chunk not found. Run `pnpm build` first.");
    process.exit(1);
  }

  const filePath = path.join(DIST_DIR, chunk);
  const raw = fs.readFileSync(filePath);
  const gzip = gzipSync(raw);
  const gzipKb = gzip.length / 1024;

  console.log(`Coverage chunk: ${chunk}`);
  console.log(`  Raw:  ${(raw.length / 1024).toFixed(2)} kB`);
  console.log(`  Gzip: ${gzipKb.toFixed(2)} kB`);
  console.log(`  Budget: ${BUDGET_KB} kB`);

  if (gzipKb > BUDGET_KB) {
    console.error(`FAIL: Coverage chunk exceeds ${BUDGET_KB} kB gzip budget.`);
    process.exit(1);
  }

  console.log("PASS: Coverage chunk is within budget.");
}

main();
