import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { listDailyReportSourcePackages } from "../../server/dailyReportSources";

describe("flow source timestamps smoke", () => {
  const originalCwd = process.cwd();
  let tempDir: string | null = null;

  afterEach(() => {
    process.chdir(originalCwd);
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("prefers hero data-timestamp over file mtimes and preserves the source offset", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-ts-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    const alphaPath = path.join(flowRoot, "alpha-note.html");
    const betaPath = path.join(flowRoot, "beta-note.html");

    fs.writeFileSync(
      alphaPath,
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero" data-timestamp="2026-06-29T16:20:00+03:00">
      <span class="hero-date" data-timestamp="2026-06-29T19:45:00+03:00">📅 29 Haziran 2026</span>
      <h1>Alpha Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );
    fs.writeFileSync(
      betaPath,
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero" data-timestamp="2026-06-29T18:45:00+03:00">
      <span class="hero-date">📅 29 Haziran 2026</span>
      <h1>Beta Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );

    fs.utimesSync(alphaPath, new Date("2030-01-01T00:00:00Z"), new Date("2030-01-01T00:00:00Z"));
    fs.utimesSync(betaPath, new Date("2020-01-01T00:00:00Z"), new Date("2020-01-01T00:00:00Z"));

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources.map(source => source.sourceLabel)).toEqual([
      "flow/beta-note.html",
      "flow/alpha-note.html",
    ]);
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29T18:45:00+03:00");
    expect(flowSources[1]?.updatedAt).toBe("2026-06-29T16:20:00+03:00");
  });

  it("falls back to hero-date data-timestamp when hero timestamp is missing", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-hero-date-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    fs.writeFileSync(
      path.join(flowRoot, "gamma-note.html"),
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero">
      <span class="hero-date" data-timestamp="2026-06-29T14:30:00Z">📅 29 Haziran 2026</span>
      <h1>Gamma Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources).toHaveLength(1);
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29T14:30:00Z");
    expect(flowSources[0]?.reportDate).toBe("2026-06-29");
  });

  it("falls back to visible hero date text when no timestamp attribute exists", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-visible-date-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    fs.writeFileSync(
      path.join(flowRoot, "delta-note.html"),
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero">
      <span class="hero-date">📅 29 Haziran 2026</span>
      <h1>Delta Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources).toHaveLength(1);
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29");
    expect(flowSources[0]?.reportDate).toBe("2026-06-29");
  });

  it("keeps the local source day when the timestamp includes a positive offset", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-local-day-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    fs.writeFileSync(
      path.join(flowRoot, "epsilon-note.html"),
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero" data-timestamp="2026-06-29T00:30:00+03:00">
      <span class="hero-date">📅 29 Haziran 2026</span>
      <h1>Epsilon Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources).toHaveLength(1);
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29T00:30:00+03:00");
    expect(flowSources[0]?.reportDate).toBe("2026-06-29");
  });

  it("ignores derived translation files when listing flow sources", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-derived-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    fs.writeFileSync(
      path.join(flowRoot, "omega-note.html"),
      `
<!doctype html>
<html>
  <body>
    <div class="hero" id="hero" data-timestamp="2026-06-29T14:30:00+03:00">
      <span class="hero-date">📅 29 Haziran 2026</span>
      <h1>Omega Note</h1>
    </div>
  </body>
</html>
      `,
      "utf8"
    );
    fs.writeFileSync(
      path.join(flowRoot, "omega-note.en.html"),
      "<html><body><h1>Derived translation</h1></body></html>",
      "utf8"
    );
    fs.writeFileSync(
      path.join(flowRoot, "omega-note.en.md"),
      "# Derived translation",
      "utf8"
    );

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources).toHaveLength(1);
    expect(flowSources[0]?.sourceLabel).toBe("flow/omega-note.html");
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29T14:30:00+03:00");
  });
});
