import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { translateContentDocument } from "../server/openaiTranslation.ts";

type CliOptions = {
  force: boolean;
  source: string;
  target: string;
};

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function parseArgs(argv: string[]) {
  const options: CliOptions = {
    force: false,
    source: "tr",
    target: "en",
  };
  const inputs: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--force") {
      options.force = true;
      continue;
    }

    if (arg === "--source") {
      options.source = normalizeString(argv[index + 1] || "") || options.source;
      index += 1;
      continue;
    }

    if (arg === "--target") {
      options.target = normalizeString(argv[index + 1] || "") || options.target;
      index += 1;
      continue;
    }

    if (arg) {
      inputs.push(arg);
    }
  }

  return { inputs, options };
}

function walk(directory: string, predicate: (filePath: string) => boolean, files: string[] = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }

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

function isTranslatableFile(filePath: string) {
  const normalized = filePath.replace(/\\/g, "/").toLowerCase();
  const baseName = path.posix.basename(normalized);

  if (!/\.(md|html)$/i.test(baseName)) {
    return false;
  }

  if (
    normalized.includes("/flowskill/") ||
    normalized.includes("/research/") ||
    /^plan(?:[_-]|$)/i.test(baseName) ||
    /\.outline\.md$/i.test(baseName) ||
    /_sec\d+\.md$/i.test(baseName) ||
    /\.en\.(md|html)$/i.test(baseName) ||
    /\.premium\.en\.md$/i.test(baseName) ||
    /^_template\.(md|html)$/i.test(baseName) ||
    /^index\.html$/i.test(baseName)
  ) {
    return false;
  }

  return true;
}

function discoverDefaultInputs() {
  const roots = [
    path.resolve("flow"),
    path.resolve("reports", "coverage"),
    path.resolve("content", "tr"),
  ];

  return roots.flatMap(root => walk(root, isTranslatableFile)).sort();
}

function buildTargetPath(sourcePath: string, targetLang: string) {
  const normalized = sourcePath.replace(/\\/g, "/");

  if (/\/content\/tr\//i.test(normalized)) {
    return sourcePath.replace(
      `${path.sep}content${path.sep}tr${path.sep}`,
      `${path.sep}content${path.sep}${targetLang}${path.sep}`
    );
  }

  if (/\.premium\.tr\.md$/i.test(sourcePath)) {
    return sourcePath.replace(/\.premium\.tr\.md$/i, `.premium.${targetLang}.md`);
  }

  const extension = path.extname(sourcePath);
  return sourcePath.slice(0, -extension.length) + `.${targetLang}${extension}`;
}

async function translateFile(
  sourcePath: string,
  targetPath: string,
  options: CliOptions
) {
  const input = fs.readFileSync(sourcePath, "utf8");
  const output = await translateContentDocument(
    input,
    options.source,
    options.target,
    path.relative(process.cwd(), sourcePath)
  );

  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, output, "utf8");
}

async function main() {
  const { inputs, options } = parseArgs(process.argv.slice(2));
  const candidates = (inputs.length ? inputs : discoverDefaultInputs())
    .map(candidate => path.resolve(candidate))
    .filter(filePath => fs.existsSync(filePath) && fs.statSync(filePath).isFile());

  if (!candidates.length) {
    console.log("[translate-content] No matching source files found.");
    return;
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const sourcePath of candidates) {
    const targetPath = buildTargetPath(sourcePath, options.target);
    if (sourcePath === targetPath) {
      skipped += 1;
      continue;
    }

    if (fs.existsSync(targetPath) && !options.force) {
      skipped += 1;
      continue;
    }

    try {
      await translateFile(sourcePath, targetPath, options);
      created += 1;
      console.log(
        `[translate-content] translated ${path.relative(process.cwd(), sourcePath)} -> ${path.relative(process.cwd(), targetPath)}`
      );
    } catch (error) {
      failed += 1;
      console.error(
        `[translate-content] failed ${path.relative(process.cwd(), sourcePath)}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  console.log(
    `[translate-content] done | created=${created} skipped=${skipped} failed=${failed}`
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

void main();
