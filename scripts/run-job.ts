/**
 * CLI wrapper to run a Gistify job through the central job coordinator.
 *
 * Usage:
 *   node dist/scripts/run-job.js <job-name>
 *
 * Example host cron entry:
 *   * /10 * * * * docker exec gistify node dist/scripts/run-job.js midas-signals >> /var/log/gistify-cron.log 2>&1
 */

import { spawn } from "node:child_process";
import { createGistifyDb } from "../server/db";
import {
  createJobCoordinator,
  JobSkippedError,
} from "../server/services/jobCoordinator";
import { CRON_JOB_DEFINITIONS } from "../server/jobs/definitions";

const name = process.argv[2]?.trim();

if (!name) {
  console.error("[run-job] Usage: node dist/scripts/run-job.js <job-name>");
  process.exit(1);
}

const isKnown = CRON_JOB_DEFINITIONS.some(job => job.name === name);
if (!isKnown) {
  console.error(`[run-job] Unknown job: ${name}`);
  console.error(
    `[run-job] Known jobs: ${CRON_JOB_DEFINITIONS.map(job => job.name).join(", ")}`
  );
  process.exit(1);
}

function runSubprocess(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {}
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...(options.env || {}) },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data: Buffer) => {
      const chunk = data.toString("utf8");
      stdout += chunk;
      process.stdout.write(chunk);
    });

    child.stderr.on("data", (data: Buffer) => {
      const chunk = data.toString("utf8");
      stderr += chunk;
      process.stderr.write(chunk);
    });

    child.on("error", reject);
    child.on("close", exitCode => {
      resolve({ exitCode: exitCode ?? 1, stdout, stderr });
    });
  });
}

function buildJobFn(jobName: string): () => Promise<unknown> {
  switch (jobName) {
    case "x-research-pipeline":
      return async () => {
        const result = await runSubprocess("python3", [
          "scripts/run_x_research_pipeline.py",
        ]);
        if (result.exitCode !== 0) {
          throw new Error(
            `X Research Pipeline failed with exit code ${result.exitCode}`
          );
        }
        return { exitCode: result.exitCode };
      };

    case "midas-signals":
      return async () => {
        const outputPath =
          process.env.MIDAS_PIPELINE_SOURCE_FILE ||
          "client/public/midas_signals.json";
        const result = await runSubprocess("python3", [
          "scripts/midas_marketdata_pipeline.py",
          "--output",
          outputPath,
        ]);

        // Trigger the server-side refresh so the snapshot is normalized
        // and persisted to gistify.sqlite by the application process.
        const adminSecret = process.env.REPORT_ADMIN_SECRET?.trim();
        if (adminSecret) {
          const refreshResponse = await fetch(
            "http://localhost:3000/api/admin/midas/signals/refresh",
            {
              method: "POST",
              headers: {
                "x-gistify-admin-secret": adminSecret,
              },
            }
          );
          if (!refreshResponse.ok) {
            throw new Error(
              `Server refresh failed: ${refreshResponse.status} ${refreshResponse.statusText}`
            );
          }
        }

        return { exitCode: result.exitCode, refreshed: Boolean(adminSecret) };
      };

    case "marketflash-momentum":
      return async () => {
        const outputPath =
          process.env.MARKETFLASH_OUTPUT_FILE ||
          "client/public/marketflash/marketflash_report.json";
        const verbose = process.env.MARKETFLASH_VERBOSE === "1";
        const args = [
          "scripts/marketflash_marketdata_pipeline.py",
          "--output",
          outputPath,
        ];
        if (verbose) args.push("--verbose");
        const result = await runSubprocess("python3", args);
        if (result.exitCode !== 0) {
          throw new Error(
            `MarketFlash pipeline failed with exit code ${result.exitCode}`
          );
        }
        return { exitCode: result.exitCode };
      };

    case "sync-flow-source-timestamps":
      return async () => {
        const result = await runSubprocess("node", [
          "dist/scripts/sync-flow-source-timestamps.js",
        ]);
        if (result.exitCode !== 0) {
          throw new Error(
            `Flow source timestamp sync failed with exit code ${result.exitCode}`
          );
        }
        return { exitCode: result.exitCode };
      };

    case "maintenance":
      return async () => {
        const { db } = createGistifyDb();
        db.exec("PRAGMA optimize;");
        db.exec("PRAGMA wal_checkpoint(TRUNCATE);");

        // Prune old cron_runs: keep the latest 500 records per job.
        db.exec(`
          DELETE FROM cron_runs
          WHERE id NOT IN (
            SELECT id FROM (
              SELECT id,
                     ROW_NUMBER() OVER (PARTITION BY job_name ORDER BY started_at DESC) AS rn
              FROM cron_runs
            )
            WHERE rn <= 500
          )
        `);

        // Prune old artifacts: keep the latest 200 per kind.
        db.exec(`
          DELETE FROM artifacts
          WHERE id NOT IN (
            SELECT id FROM (
              SELECT id,
                     ROW_NUMBER() OVER (PARTITION BY kind ORDER BY created_at DESC) AS rn
              FROM artifacts
            )
            WHERE rn <= 200
          )
        `);

        return { pruned: true };
      };

    default:
      throw new Error(`No runner implemented for job: ${jobName}`);
  }
}

async function main() {
  createGistifyDb();
  const coordinator = createJobCoordinator();
  coordinator.ensureCronJobs(CRON_JOB_DEFINITIONS);

  try {
    await coordinator.runJob(
      name,
      buildJobFn(name),
      { inputSummary: { source: "cli", argv: process.argv.slice(2) } }
    );
  } catch (error) {
    if (error instanceof JobSkippedError) {
      console.log(`[run-job] ${error.message}`);
      process.exit(0);
    }
    console.error(`[run-job] Job ${name} failed:`, error);
    process.exit(1);
  }
}

main();
