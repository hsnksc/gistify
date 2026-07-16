import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { locateMidasSourceFile } from "../server/midasSourceSelection";

const temporaryDirectories: string[] = [];

function createTemporaryDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-midas-source-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { force: true, recursive: true });
  }
});

describe("Midas source selection", () => {
  it("uses the newest available default source", () => {
    const directory = createTemporaryDirectory();
    const older = path.join(directory, "older.json");
    const newer = path.join(directory, "newer.json");
    fs.writeFileSync(older, "{}", "utf8");
    fs.writeFileSync(newer, "{}", "utf8");
    fs.utimesSync(older, new Date("2026-06-29T00:00:00Z"), new Date("2026-06-29T00:00:00Z"));
    fs.utimesSync(newer, new Date("2026-07-06T00:00:00Z"), new Date("2026-07-06T00:00:00Z"));

    expect(locateMidasSourceFile([older, newer])?.filePath).toBe(newer);
  });

  it("keeps an explicitly configured source authoritative", () => {
    const directory = createTemporaryDirectory();
    const configured = path.join(directory, "configured.json");
    const newer = path.join(directory, "newer.json");
    fs.writeFileSync(configured, "{}", "utf8");
    fs.writeFileSync(newer, "{}", "utf8");
    fs.utimesSync(configured, new Date("2026-06-29T00:00:00Z"), new Date("2026-06-29T00:00:00Z"));
    fs.utimesSync(newer, new Date("2026-07-06T00:00:00Z"), new Date("2026-07-06T00:00:00Z"));

    expect(
      locateMidasSourceFile([configured, newer], configured)?.filePath
    ).toBe(configured);
  });
});
