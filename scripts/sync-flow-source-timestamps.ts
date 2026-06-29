import fs from "node:fs";
import path from "node:path";

const FLOW_ROOT = path.resolve(process.cwd(), "flow");
const MANIFEST_PATH = path.join(FLOW_ROOT, ".source-timestamps.json");

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTimestamp(value: unknown) {
  const normalized = normalizeString(value);
  if (!normalized) {
    return "";
  }

  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString();
}

function isExcludedFlowSourceFile(filePath: string) {
  const normalizedPath = filePath.replace(/\\/g, "/").toLowerCase();
  const baseName = path.posix.basename(normalizedPath);
  return (
    normalizedPath.startsWith("flowskill/") ||
    normalizedPath.includes("/flowskill/") ||
    !/\.(md|html)$/i.test(filePath) ||
    normalizedPath === "index.html" ||
    /^readme\.(md|html)$/i.test(baseName) ||
    /^_template\.(md|html)$/i.test(baseName) ||
    /^example\.(md|html)$/i.test(baseName) ||
    /^plan(?:[_-]|$)/i.test(baseName)
  );
}

function listRelativeFilesRecursive(rootPath: string, currentPath = rootPath) {
  if (!fs.existsSync(currentPath)) {
    return [];
  }

  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  const relativeFiles: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      relativeFiles.push(...listRelativeFilesRecursive(rootPath, absolutePath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const relativePath = path.relative(rootPath, absolutePath).replace(/\\/g, "/");
    relativeFiles.push(relativePath);
  }

  return relativeFiles.sort((left, right) => left.localeCompare(right));
}

function readExistingManifest() {
  if (!fs.existsSync(MANIFEST_PATH) || !fs.statSync(MANIFEST_PATH).isFile()) {
    return new Map<string, string>();
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as {
      generatedAtBySource?: Record<string, unknown>;
    };
    return new Map(
      Object.entries(parsed.generatedAtBySource || {})
        .map(([key, value]) => [key.replace(/\\/g, "/"), normalizeTimestamp(value)] as const)
        .filter(([, value]) => Boolean(value))
    );
  } catch {
    return new Map<string, string>();
  }
}

function resolveLocalGeneratedAt(filePath: string) {
  const stats = fs.statSync(filePath);
  const birthtimeMs = Number.isFinite(stats.birthtimeMs) ? stats.birthtimeMs : 0;
  const mtimeMs = Number.isFinite(stats.mtimeMs) ? stats.mtimeMs : 0;
  const preferredMs =
    birthtimeMs > 0 ? birthtimeMs : mtimeMs > 0 ? mtimeMs : Date.now();
  return new Date(preferredMs).toISOString();
}

function main() {
  if (!fs.existsSync(FLOW_ROOT) || !fs.statSync(FLOW_ROOT).isDirectory()) {
    throw new Error(`Flow root not found: ${FLOW_ROOT}`);
  }

  const existing = readExistingManifest();
  const generatedAtBySource: Record<string, string> = {};
  const flowSourceFiles = listRelativeFilesRecursive(FLOW_ROOT).filter(
    filePath => !isExcludedFlowSourceFile(filePath)
  );

  for (const relativePath of flowSourceFiles) {
    const existingTimestamp = existing.get(relativePath);
    generatedAtBySource[relativePath] =
      existingTimestamp || resolveLocalGeneratedAt(path.join(FLOW_ROOT, relativePath));
  }

  const payload = {
    version: 1,
    generatedAtBySource,
  };
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  process.stdout.write(
    `Synced ${Object.keys(generatedAtBySource).length} Flow source timestamps to ${MANIFEST_PATH}\n`
  );
}

main();
