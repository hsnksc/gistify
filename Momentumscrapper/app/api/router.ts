import { createRouter, publicQuery } from "./middleware";
import { z } from "zod";
import { spawn } from "child_process";

function runPythonScript(scriptPath: string, args: string[]): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const proc = spawn("python3", [scriptPath, ...args]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    proc.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error(`Script: ${data.toString().trim()}`);
    });

    proc.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Script exited with code ${code}: ${stderr}`));
        return;
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse script output: ${stdout}`));
      }
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  scan: publicQuery
    .input(
      z.object({
        minScore: z.number().min(0).max(100).default(30),
        maxResults: z.number().min(1).max(50).default(20),
      }).optional()
    )
    .query(async ({ input }) => {
      const minScore = input?.minScore ?? 30;
      const maxResults = input?.maxResults ?? 20;
      const scriptPath = __dirname + "/scanner.py";
      
      return runPythonScript(scriptPath, ["--min-score", String(minScore), "--max-results", String(maxResults)]);
    }),

  backtest: publicQuery
    .input(
      z.object({
        startDate: z.string(),
        endDate: z.string(),
        tpPct: z.number().default(3.0),
        slPct: z.number().default(2.0),
      })
    )
    .query(async ({ input }) => {
      const scriptPath = __dirname + "/backtest.py";
      return runPythonScript(scriptPath, [
        "--start", input.startDate,
        "--end", input.endDate,
        "--tp", String(input.tpPct),
        "--sl", String(input.slPct),
      ]);
    }),
});

export type AppRouter = typeof appRouter;
