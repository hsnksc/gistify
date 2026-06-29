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

  it("prefers committed local flow timestamps over file mtimes", () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "gistify-flow-ts-"));
    process.chdir(tempDir);

    const flowRoot = path.join(tempDir, "flow");
    fs.mkdirSync(flowRoot, { recursive: true });

    fs.writeFileSync(
      path.join(flowRoot, "alpha-note-29-haziran-2026.html"),
      `
<!doctype html>
<html>
  <body>
    <main>
      <h1>Alpha Note</h1>
      <div class="meta">29 Haziran 2026</div>
    </main>
  </body>
</html>
      `,
      "utf8"
    );
    fs.writeFileSync(
      path.join(flowRoot, "beta-note-29-haziran-2026.html"),
      `
<!doctype html>
<html>
  <body>
    <main>
      <h1>Beta Note</h1>
      <div class="meta">29 Haziran 2026</div>
    </main>
  </body>
</html>
      `,
      "utf8"
    );
    fs.writeFileSync(
      path.join(flowRoot, ".source-timestamps.json"),
      JSON.stringify(
        {
          version: 1,
          generatedAtBySource: {
            "alpha-note-29-haziran-2026.html": "2026-06-29T16:20:00.000Z",
            "beta-note-29-haziran-2026.html": "2026-06-29T18:45:00.000Z",
          },
        },
        null,
        2
      ),
      "utf8"
    );

    const flowSources = listDailyReportSourcePackages().filter(source =>
      (source.sourceLabel || "").toLowerCase().startsWith("flow/")
    );

    expect(flowSources.map(source => source.sourceLabel)).toEqual([
      "flow/beta-note-29-haziran-2026.html",
      "flow/alpha-note-29-haziran-2026.html",
    ]);
    expect(flowSources[0]?.updatedAt).toBe("2026-06-29T18:45:00.000Z");
    expect(flowSources[1]?.updatedAt).toBe("2026-06-29T16:20:00.000Z");
  });
});
