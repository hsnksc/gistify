import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

type AppLanguage = "tr" | "en";

type DictionaryCandidate = {
  enValue: string;
  placeholders: Array<{ expressionText: string; name: string }>;
  trValue: string;
};

type OccurrenceResolution =
  | {
      kind: "dictionary";
      candidate: DictionaryCandidate;
      key?: string;
      namespace?: string;
    }
  | {
      kind: "expression";
    }
  | {
      kind: "ternary";
      reason: string;
    };

type CopyOccurrence = {
  filePath: string;
  node: ts.CallExpression;
  relativePath: string;
  resolution: OccurrenceResolution;
  sourceFile: ts.SourceFile;
};

type PairUsage = {
  files: Set<string>;
  occurrences: CopyOccurrence[];
};

const PROJECT_ROOT = process.cwd();
const CLIENT_ROOT = path.join(PROJECT_ROOT, "client", "src");
const LOCALES_ROOT = path.join(CLIENT_ROOT, "locales");
const MANUAL_REPORT_PATH = path.join(PROJECT_ROOT, "reports", "i18n-manual.md");
const GENERATED_TYPES_PATH = path.join(CLIENT_ROOT, "i18n.generated.ts");

function toPosixPath(value: string) {
  return value.replace(/\\/g, "/");
}

function listSourceFiles(root: string): string[] {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name === "locales" || entry.name === "types") {
      continue;
    }

    const absolutePath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...listSourceFiles(absolutePath));
      continue;
    }

    if (!/\.(ts|tsx)$/.test(entry.name)) {
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function isCopyCall(node: ts.Node): node is ts.CallExpression {
  return (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "copy" &&
    node.arguments.length === 3
  );
}

function hasCopyCallAncestor(node: ts.Node) {
  let current = node.parent;
  while (current) {
    if (isCopyCall(current)) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function namespaceForFile(relativePath: string) {
  const normalized = toPosixPath(relativePath);

  if (
    normalized.includes("/components/ui/") ||
    normalized.endsWith("/App.tsx") ||
    normalized.endsWith("/ErrorBoundary.tsx") ||
    normalized.includes("/lib/api.ts") ||
    normalized.includes("/components/LanguageSelector.tsx")
  ) {
    return "common";
  }

  if (
    normalized.includes("/features/flow/") ||
    normalized.includes("/components/reports/") ||
    normalized.includes("/pages/DailyReport.tsx") ||
    normalized.includes("/pages/ReportsAdmin.tsx")
  ) {
    return "flow";
  }

  if (
    normalized.includes("/features/coverage/") ||
    normalized.endsWith("/pages/Coverage.tsx")
  ) {
    return "coverage";
  }

  if (
    normalized.includes("/components/earnings/") ||
    normalized.includes("/pages/earnings/") ||
    normalized.includes("/pages/Earnings")
  ) {
    return "earnings";
  }

  if (
    normalized.includes("/scanner/") ||
    normalized.endsWith("/pages/Scanner.tsx")
  ) {
    return "scanner";
  }

  if (normalized.endsWith("/pages/Calendar.tsx") || normalized.includes("/pages/calendar/")) {
    return "calendar";
  }

  if (normalized.endsWith("/pages/CpiPpiForecast.tsx")) {
    return "macro";
  }

  if (normalized.endsWith("/pages/MarketFlash.tsx")) {
    return "marketFlash";
  }

  if (
    normalized.endsWith("/pages/Landing.tsx") ||
    normalized.endsWith("/pages/Pricing.tsx") ||
    normalized.endsWith("/components/PublicShell.tsx")
  ) {
    return "marketing";
  }

  if (
    normalized.endsWith("/pages/Terms.tsx") ||
    normalized.endsWith("/pages/Privacy.tsx") ||
    normalized.endsWith("/pages/Refund.tsx")
  ) {
    return "legal";
  }

  return "common";
}

function getNodeText(node: ts.Node, sourceFile: ts.SourceFile) {
  return sourceFile.text.slice(node.getStart(sourceFile), node.getEnd());
}

function getSimpleText(expression: ts.Expression, sourceFile: ts.SourceFile) {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text;
  }

  if (
    ts.isParenthesizedExpression(expression) &&
    (ts.isStringLiteral(expression.expression) ||
      ts.isNoSubstitutionTemplateLiteral(expression.expression))
  ) {
    return expression.expression.text;
  }

  return null;
}

function sanitizePlaceholderName(value: string) {
  const cleaned = value
    .replace(/[^A-Za-z0-9_$]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!cleaned.length) {
    return "value";
  }

  return cleaned
    .map((part, index) => {
      const lower = part.replace(/^[_$]+/, "").toLowerCase();
      if (!lower) {
        return "";
      }

      if (index === 0) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

function placeholderNameForExpression(expression: ts.Expression, sourceFile: ts.SourceFile) {
  if (ts.isIdentifier(expression)) {
    return sanitizePlaceholderName(expression.text);
  }

  if (ts.isPropertyAccessExpression(expression)) {
    return sanitizePlaceholderName(expression.name.text);
  }

  if (
    ts.isElementAccessExpression(expression) &&
    ts.isStringLiteral(expression.argumentExpression)
  ) {
    return sanitizePlaceholderName(expression.argumentExpression.text);
  }

  const fallback = getNodeText(expression, sourceFile)
    .split(".")
    .pop();
  return sanitizePlaceholderName(fallback || "value");
}

type ParsedTemplate = {
  head: string;
  spans: Array<{ expression: ts.Expression; literal: string }>;
};

function parseTemplate(
  expression: ts.Expression,
  sourceFile: ts.SourceFile
): ParsedTemplate | null {
  const simple = getSimpleText(expression, sourceFile);
  if (simple !== null) {
    return {
      head: simple,
      spans: [],
    };
  }

  if (!ts.isTemplateExpression(expression)) {
    return null;
  }

  return {
    head: expression.head.text,
    spans: expression.templateSpans.map(span => ({
      expression: span.expression,
      literal: span.literal.text,
    })),
  };
}

function buildDictionaryCandidate(
  trExpression: ts.Expression,
  enExpression: ts.Expression,
  sourceFile: ts.SourceFile
): DictionaryCandidate | null {
  const trSimple = getSimpleText(trExpression, sourceFile);
  const enSimple = getSimpleText(enExpression, sourceFile);
  if (trSimple !== null && enSimple !== null) {
    return {
      enValue: enSimple,
      placeholders: [],
      trValue: trSimple,
    };
  }

  const trTemplate = parseTemplate(trExpression, sourceFile);
  const enTemplate = parseTemplate(enExpression, sourceFile);

  if (!trTemplate || !enTemplate) {
    return null;
  }

  if (trTemplate.spans.length !== enTemplate.spans.length) {
    return null;
  }

  const seen = new Map<string, number>();
  const placeholders: Array<{ expressionText: string; name: string }> = [];

  const trValueParts = [trTemplate.head];
  const enValueParts = [enTemplate.head];

  for (let index = 0; index < trTemplate.spans.length; index += 1) {
    const trSpan = trTemplate.spans[index];
    const enSpan = enTemplate.spans[index];
    const trExpressionText = getNodeText(trSpan.expression, sourceFile);
    const enExpressionText = getNodeText(enSpan.expression, sourceFile);

    if (trExpressionText !== enExpressionText) {
      return null;
    }

    const baseName =
      placeholderNameForExpression(trSpan.expression, sourceFile) || `value${index + 1}`;
    const seenCount = seen.get(baseName) || 0;
    seen.set(baseName, seenCount + 1);
    const uniqueName = seenCount === 0 ? baseName : `${baseName}${seenCount + 1}`;

    placeholders.push({
      expressionText: trExpressionText,
      name: uniqueName,
    });
    trValueParts.push(`{{${uniqueName}}}`, trSpan.literal);
    enValueParts.push(`{{${uniqueName}}}`, enSpan.literal);
  }

  return {
    enValue: enValueParts.join(""),
    placeholders,
    trValue: trValueParts.join(""),
  };
}

function slugifyKey(enValue: string) {
  const cleaned = enValue
    .replace(/\{\{[^}]+\}\}/g, " ")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  if (!cleaned.length) {
    return "text";
  }

  return cleaned
    .map((part, index) => {
      const lower = part.toLowerCase();
      if (index === 0) {
        return lower;
      }

      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

function hashSuffix(value: string) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 4);
}

function readLocaleFile(language: AppLanguage, namespace: string) {
  const absolutePath = path.join(LOCALES_ROOT, language, `${namespace}.json`);
  if (!fs.existsSync(absolutePath)) {
    return {} as Record<string, string>;
  }

  return JSON.parse(fs.readFileSync(absolutePath, "utf8")) as Record<string, string>;
}

function writeLocaleFile(
  language: AppLanguage,
  namespace: string,
  entries: Record<string, string>
) {
  const absoluteDir = path.join(LOCALES_ROOT, language);
  const absolutePath = path.join(absoluteDir, `${namespace}.json`);
  fs.mkdirSync(absoluteDir, { recursive: true });

  const sorted = Object.fromEntries(
    Object.entries(entries).sort(([left], [right]) => left.localeCompare(right))
  );
  fs.writeFileSync(absolutePath, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

function buildReplacementImport(
  sourceFile: ts.SourceFile,
  originalText: string,
  functionName: string
) {
  const importDeclaration = sourceFile.statements.find(statement => {
    if (!ts.isImportDeclaration(statement)) {
      return false;
    }

    return statement.moduleSpecifier.getText(sourceFile) === '"@/lib/i18n"';
  });

  if (!importDeclaration || !importDeclaration.importClause) {
    const lastImport = [...sourceFile.statements]
      .reverse()
      .find(statement => ts.isImportDeclaration(statement));
    const insertionIndex = lastImport ? lastImport.end : 0;
    const importLine =
      functionName === "t"
        ? `import { t } from "@/lib/i18n";\n`
        : `import { t as ${functionName} } from "@/lib/i18n";\n`;
    return {
      end: insertionIndex,
      start: insertionIndex,
      text: importLine,
    };
  }

  const namedBindings = importDeclaration.importClause.namedBindings;
  if (!namedBindings || !ts.isNamedImports(namedBindings)) {
    return null;
  }

  const specifiers = namedBindings.elements.map(element =>
    getNodeText(element, sourceFile)
  );
  const hasTarget = specifiers.some(specifier =>
    functionName === "t"
      ? specifier === "t" || specifier.startsWith("t as ")
      : specifier.endsWith(`as ${functionName}`)
  );
  if (hasTarget) {
    return null;
  }

  specifiers.push(functionName === "t" ? "t" : `t as ${functionName}`);
  const nextImport = `import { ${specifiers.join(", ")} } from "@/lib/i18n";`;
  return {
    end: importDeclaration.getEnd(),
    start: importDeclaration.getStart(sourceFile),
    text: nextImport,
  };
}

function lineNumberFor(node: ts.Node, sourceFile: ts.SourceFile) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

function createOccurrenceResolution(
  node: ts.CallExpression,
  sourceFile: ts.SourceFile
): OccurrenceResolution {
  const [, trExpression, enExpression] = node.arguments;

  if (getNodeText(trExpression, sourceFile) === getNodeText(enExpression, sourceFile)) {
    return { kind: "expression" };
  }

  const candidate = buildDictionaryCandidate(trExpression, enExpression, sourceFile);
  if (candidate) {
    return {
      kind: "dictionary",
      candidate,
    };
  }

  return {
    kind: "ternary",
    reason: "Dynamic or mismatched translation pair; preserved behaviour with ternary fallback.",
  };
}

function renderTextWithNestedReplacements(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  occurrenceMap: Map<number, CopyOccurrence>,
  functionName: string,
  dictionaryLookup: Map<number, { key?: string; namespace?: string }>
) {
  const replacements: Array<{ start: number; end: number; text: string }> = [];

  function visit(current: ts.Node) {
    if (current === node) {
      ts.forEachChild(current, visit);
      return;
    }

    if (isCopyCall(current)) {
      const occurrence = occurrenceMap.get(current.getStart(sourceFile));
      if (!occurrence) {
        return;
      }

      replacements.push({
        end: current.getEnd(),
        start: current.getStart(sourceFile),
        text: buildReplacement(
          occurrence,
          functionName,
          occurrenceMap,
          dictionaryLookup
        ),
      });
      return;
    }

    ts.forEachChild(current, visit);
  }

  ts.forEachChild(node, visit);

  let output = getNodeText(node, sourceFile);
  replacements
    .sort((left, right) => right.start - left.start)
    .forEach(replacement => {
      const relativeStart = replacement.start - node.getStart(sourceFile);
      const relativeEnd = replacement.end - node.getStart(sourceFile);
      output =
        output.slice(0, relativeStart) + replacement.text + output.slice(relativeEnd);
    });

  return output;
}

function buildReplacement(
  occurrence: CopyOccurrence,
  functionName: string,
  occurrenceMap: Map<number, CopyOccurrence>,
  dictionaryLookup: Map<number, { key?: string; namespace?: string }>
) {
  const { node, resolution, sourceFile } = occurrence;
  const [languageExpression, trExpression, enExpression] = node.arguments;

  if (resolution.kind === "expression") {
    return renderTextWithNestedReplacements(
      trExpression,
      sourceFile,
      occurrenceMap,
      functionName,
      dictionaryLookup
    );
  }

  if (resolution.kind === "dictionary") {
    const lookup = dictionaryLookup.get(node.getStart(sourceFile));
    const placeholderObject =
      resolution.candidate.placeholders.length === 0
        ? ""
        : `, { ${resolution.candidate.placeholders
            .map(placeholder => {
              const isSimpleIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(
                placeholder.expressionText
              );
              if (isSimpleIdentifier && placeholder.expressionText === placeholder.name) {
                return placeholder.name;
              }

              return `${placeholder.name}: ${placeholder.expressionText}`;
            })
            .join(", ")} }`;
    return `${functionName}("${lookup?.namespace}:${lookup?.key}"${placeholderObject})`;
  }

  return `(${renderTextWithNestedReplacements(
    languageExpression,
    sourceFile,
    occurrenceMap,
    functionName,
    dictionaryLookup
  )} === "en" ? ${renderTextWithNestedReplacements(
    enExpression,
    sourceFile,
    occurrenceMap,
    functionName,
    dictionaryLookup
  )} : ${renderTextWithNestedReplacements(
    trExpression,
    sourceFile,
    occurrenceMap,
    functionName,
    dictionaryLookup
  )})`;
}

function generateTypes(resources: Record<string, Record<string, string>>) {
  const namespaces = Object.keys(resources).sort();
  const shapeLines = namespaces.map(namespace => {
    const keys = Object.keys(resources[namespace]).sort();
    const entries =
      keys.length === 0
        ? "    never: string;"
        : keys.map(key => `    "${key}": string;`).join("\n");
    return `  ${namespace}: {\n${entries}\n  };`;
  });

  return `export interface I18nResourceShape {\n${shapeLines.join("\n")}\n}\n\nexport type TranslationKey = {\n  [Namespace in keyof I18nResourceShape]: \`${"${Namespace}:${Extract<keyof I18nResourceShape[Namespace], string>}"}\`;\n}[keyof I18nResourceShape];\n`;
}

function main() {
  const files = listSourceFiles(CLIENT_ROOT);
  const occurrences: CopyOccurrence[] = [];
  const pairUsage = new Map<string, PairUsage>();

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(PROJECT_ROOT, filePath));
    const sourceText = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );

    function visit(node: ts.Node) {
      if (isCopyCall(node)) {
        const occurrence: CopyOccurrence = {
          filePath,
          node,
          relativePath,
          resolution: createOccurrenceResolution(node, sourceFile),
          sourceFile,
        };
        occurrences.push(occurrence);

        if (occurrence.resolution.kind === "dictionary") {
          const pairKey = `${occurrence.resolution.candidate.trValue}\u0000${occurrence.resolution.candidate.enValue}`;
          const usage = pairUsage.get(pairKey) || {
            files: new Set<string>(),
            occurrences: [],
          };
          usage.files.add(relativePath);
          usage.occurrences.push(occurrence);
          pairUsage.set(pairKey, usage);
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  const dictionaryLookup = new Map<number, { key: string; namespace: string }>();
  const localeBuffers = new Map<string, Record<string, string>>();
  const usedKeys = new Map<string, string>();

  for (const usage of pairUsage.values()) {
    for (const occurrence of usage.occurrences) {
      if (occurrence.resolution.kind !== "dictionary") {
        continue;
      }

      const namespace =
        usage.files.size >= 3
          ? "common"
          : namespaceForFile(occurrence.relativePath);
      let key = slugifyKey(occurrence.resolution.candidate.enValue);
      const pairKey = `${occurrence.resolution.candidate.trValue}\u0000${occurrence.resolution.candidate.enValue}`;
      const namespaceKey = `${namespace}:${key}`;
      const existingPair = usedKeys.get(namespaceKey);
      if (existingPair && existingPair !== pairKey) {
        key = `${key}${hashSuffix(pairKey)}`;
      }
      usedKeys.set(`${namespace}:${key}`, pairKey);

      dictionaryLookup.set(occurrence.node.getStart(occurrence.sourceFile), {
        key,
        namespace,
      });

      const trBufferKey = `tr:${namespace}`;
      const enBufferKey = `en:${namespace}`;
      const trBuffer =
        localeBuffers.get(trBufferKey) || readLocaleFile("tr", namespace);
      const enBuffer =
        localeBuffers.get(enBufferKey) || readLocaleFile("en", namespace);
      trBuffer[key] = occurrence.resolution.candidate.trValue;
      enBuffer[key] = occurrence.resolution.candidate.enValue;
      localeBuffers.set(trBufferKey, trBuffer);
      localeBuffers.set(enBufferKey, enBuffer);
    }
  }

  const manualLines = [
    "# i18n Manual Follow-up",
    "",
    "| File | Reason |",
    "| --- | --- |",
  ];

  const occurrenceMap = new Map<number, CopyOccurrence>();
  occurrences.forEach(occurrence => {
    occurrenceMap.set(occurrence.node.getStart(occurrence.sourceFile), occurrence);
  });

  for (const filePath of files) {
    const relativePath = toPosixPath(path.relative(PROJECT_ROOT, filePath));
    const sourceText = fs.readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );

    const fileOccurrences = occurrences
      .filter(
        occurrence =>
          occurrence.filePath === filePath && !hasCopyCallAncestor(occurrence.node)
      )
      .sort(
        (left, right) =>
          right.node.getStart(right.sourceFile) - left.node.getStart(left.sourceFile)
      );

    if (fileOccurrences.length === 0) {
      continue;
    }

    const functionName = /\b(?:const|let|var|function)\s+t\b/.test(sourceText)
      ? "i18nT"
      : "t";

    let nextText = sourceText;
    let usesDictionary = false;

    for (const occurrence of fileOccurrences) {
      const replacement = buildReplacement(
        occurrence,
        functionName,
        occurrenceMap,
        dictionaryLookup
      );
      const start = occurrence.node.getStart(occurrence.sourceFile);
      const end = occurrence.node.getEnd();
      nextText = nextText.slice(0, start) + replacement + nextText.slice(end);

      if (occurrence.resolution.kind === "dictionary") {
        usesDictionary = true;
      } else if (occurrence.resolution.kind === "ternary") {
        manualLines.push(
          `| ${relativePath}:${lineNumberFor(occurrence.node, occurrence.sourceFile)} | ${occurrence.resolution.reason} |`
        );
      }
    }

    if (usesDictionary) {
      const importEdit = buildReplacementImport(sourceFile, sourceText, functionName);
      if (importEdit) {
        nextText =
          nextText.slice(0, importEdit.start) +
          importEdit.text +
          nextText.slice(importEdit.end);
      }
    }

    if (nextText !== sourceText) {
      fs.writeFileSync(filePath, nextText, "utf8");
    }
  }

  for (const [bufferKey, entries] of localeBuffers.entries()) {
    const [language, namespace] = bufferKey.split(":") as [AppLanguage, string];
    writeLocaleFile(language, namespace, entries);
  }

  const resourcesByNamespace: Record<string, Record<string, string>> = {};
  for (const [bufferKey, entries] of localeBuffers.entries()) {
    const [language, namespace] = bufferKey.split(":");
    if (language !== "tr") {
      continue;
    }

    resourcesByNamespace[namespace] = entries;
  }

  fs.mkdirSync(path.dirname(MANUAL_REPORT_PATH), { recursive: true });
  fs.writeFileSync(MANUAL_REPORT_PATH, `${manualLines.join("\n")}\n`, "utf8");
  fs.writeFileSync(
    GENERATED_TYPES_PATH,
    `${generateTypes(resourcesByNamespace)}\n`,
    "utf8"
  );

  const transformedCount = occurrences.filter(
    occurrence => occurrence.resolution.kind === "dictionary"
  ).length;
  const ternaryCount = occurrences.filter(
    occurrence => occurrence.resolution.kind === "ternary"
  ).length;
  const expressionCount = occurrences.filter(
    occurrence => occurrence.resolution.kind === "expression"
  ).length;

  console.log(
    `[i18n-migrate] transformed=${transformedCount} ternary=${ternaryCount} passthrough=${expressionCount}`
  );
}

main();
