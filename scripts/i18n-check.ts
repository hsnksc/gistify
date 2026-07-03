import fs from "node:fs";
import path from "node:path";

const LOCALES_ROOT = path.resolve("client/src/locales");
const CLIENT_ROOT = path.resolve("client/src");
const LANGUAGES = ["tr", "en"] as const;

type LocaleLanguage = (typeof LANGUAGES)[number];

function walk(directory: string, predicate: (filePath: string) => boolean, files: string[] = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
      continue;
    }

    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function flattenObject(
  value: Record<string, unknown>,
  prefix = "",
  output: Record<string, string> = {}
) {
  for (const [key, nestedValue] of Object.entries(value)) {
    const nextKey = prefix ? `${prefix}.${key}` : key;
    if (
      nestedValue &&
      typeof nestedValue === "object" &&
      !Array.isArray(nestedValue)
    ) {
      flattenObject(nestedValue as Record<string, unknown>, nextKey, output);
      continue;
    }

    output[nextKey] = typeof nestedValue === "string" ? nestedValue : String(nestedValue ?? "");
  }

  return output;
}

function collectLocaleMaps(language: LocaleLanguage) {
  const languageRoot = path.join(LOCALES_ROOT, language);
  const jsonFiles = walk(languageRoot, filePath => filePath.endsWith(".json"));
  const localeMap = new Map<string, string>();

  for (const filePath of jsonFiles) {
    const namespace = path.basename(filePath, ".json");
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Record<string, unknown>;
    const flattened = flattenObject(raw);
    for (const [key, value] of Object.entries(flattened)) {
      localeMap.set(`${namespace}:${key}`, value);
    }
  }

  return localeMap;
}

function extractPlaceholders(value: string) {
  const placeholders = new Set<string>();
  const matcher = /{{\s*([\w.]+)\s*}}/g;
  let match: RegExpExecArray | null = null;

  while ((match = matcher.exec(value)) !== null) {
    placeholders.add(match[1]);
  }

  return Array.from(placeholders).sort();
}

function collectUsedKeys() {
  const files = walk(
    CLIENT_ROOT,
    filePath =>
      /\.(ts|tsx)$/.test(filePath) &&
      !filePath.includes(`${path.sep}locales${path.sep}`) &&
      !filePath.includes(`${path.sep}types${path.sep}`)
  );
  const usedKeys = new Set<string>();
  const keyMatcher = /\b(?:t|i18n\.t)\(\s*["']([^"']+)["']/g;

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    let match: RegExpExecArray | null = null;
    while ((match = keyMatcher.exec(source)) !== null) {
      usedKeys.add(match[1]);
    }
  }

  return usedKeys;
}

function locateLineNumber(source: string, index: number) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function collectCopyUsages() {
  const files = walk(
    CLIENT_ROOT,
    filePath =>
      /\.(ts|tsx)$/.test(filePath) &&
      !filePath.includes(`${path.sep}locales${path.sep}`)
  );
  const matches: string[] = [];

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    const matcher = /\bcopy\s*\(/g;
    let match: RegExpExecArray | null = null;

    while ((match = matcher.exec(source)) !== null) {
      matches.push(
        `${path.relative(process.cwd(), filePath)}:${locateLineNumber(source, match.index)}`
      );
    }
  }

  return matches;
}

function collectHardcodedTurkishJsxWarnings() {
  const files = walk(CLIENT_ROOT, filePath => /\.tsx$/.test(filePath));
  const matches: string[] = [];

  for (const filePath of files) {
    const source = fs.readFileSync(filePath, "utf8");
    const matcher = />\s*([^<{]*[ığüşöçİĞÜŞÖÇ][^<{]*)\s*</g;
    let match: RegExpExecArray | null = null;

    while ((match = matcher.exec(source)) !== null) {
      const excerpt = match[1].replace(/\s+/g, " ").trim();
      if (!excerpt) {
        continue;
      }

      matches.push(
        `${path.relative(process.cwd(), filePath)}:${locateLineNumber(source, match.index)} | ${excerpt.slice(0, 80)}`
      );
    }
  }

  return matches;
}

const trMap = collectLocaleMaps("tr");
const enMap = collectLocaleMaps("en");
const usedKeys = collectUsedKeys();
const copyUsages = collectCopyUsages();
const hardcodedTurkishJsxWarnings = collectHardcodedTurkishJsxWarnings();

const errors: string[] = [];
const warnings: string[] = [];

for (const key of trMap.keys()) {
  if (!enMap.has(key)) {
    errors.push(`Missing EN key: ${key}`);
  }
}

for (const key of enMap.keys()) {
  if (!trMap.has(key)) {
    errors.push(`Missing TR key: ${key}`);
  }
}

for (const [key, trValue] of trMap.entries()) {
  const enValue = enMap.get(key);
  if (enValue === undefined) {
    continue;
  }

  if (!trValue.trim()) {
    errors.push(`Empty TR value: ${key}`);
  }

  if (!enValue.trim()) {
    errors.push(`Empty EN value: ${key}`);
  }

  const trPlaceholders = extractPlaceholders(trValue);
  const enPlaceholders = extractPlaceholders(enValue);
  if (trPlaceholders.join("|") !== enPlaceholders.join("|")) {
    errors.push(
      `Placeholder mismatch: ${key} | tr=[${trPlaceholders.join(", ")}] en=[${enPlaceholders.join(", ")}]`
    );
  }
}

for (const key of trMap.keys()) {
  if (!usedKeys.has(key)) {
    warnings.push(`Unused key: ${key}`);
  }
}

for (const usage of copyUsages) {
  errors.push(`Legacy copy() usage: ${usage}`);
}

for (const warning of hardcodedTurkishJsxWarnings) {
  warnings.push(`Hardcoded JSX Turkish text: ${warning}`);
}

if (warnings.length) {
  console.warn(`[i18n-check] ${warnings.length} warning(s)`);
  for (const warning of warnings.slice(0, 50)) {
    console.warn(`- ${warning}`);
  }
  if (warnings.length > 50) {
    console.warn(`- ... ${warnings.length - 50} more unused keys`);
  }
}

if (errors.length) {
  console.error(`[i18n-check] ${errors.length} error(s)`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `[i18n-check] OK | keys=${trMap.size} used=${usedKeys.size} warnings=${warnings.length}`
);
