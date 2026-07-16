import fs from "node:fs";

export interface LocatedMidasSourceFile {
  filePath: string;
  modifiedAtIso: string;
  mtimeMs: number;
}

export function locateMidasSourceFile(
  candidates: string[],
  configuredSourceFile?: string | null
): LocatedMidasSourceFile | null {
  const locatedFiles: LocatedMidasSourceFile[] = [];

  for (const filePath of candidates) {
    try {
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) {
        continue;
      }

      const located = {
        filePath,
        modifiedAtIso: stats.mtime.toISOString(),
        mtimeMs: stats.mtimeMs,
      };

      if (configuredSourceFile && filePath === configuredSourceFile) {
        return located;
      }

      locatedFiles.push(located);
    } catch {
      continue;
    }
  }

  return (
    locatedFiles.sort((left, right) => right.mtimeMs - left.mtimeMs)[0] || null
  );
}
