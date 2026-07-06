#!/usr/bin/env node
/**
 * CLI wrapper to run a Gistify job through the central job coordinator.
 *
 * Usage:
 *   npx tsx scripts/run-job.mts <job-name>
 *
 * Example host cron entry:
 *   */10 * * * * cd /srv/gistify && docker exec gistify npx tsx scripts/run-job.mts midas-signals >> /var/log/gistify-cron.log 2>&1
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
  console.error("[run-job] Usage: npx tsx scripts/run-job.mts <job-name>");
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
        const result = await runSubprocess("python", [
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
        const result = await runSubprocess("python", [
          "scripts/midas_alpaca_pipeline.py",
        ]);
        // midas_alpaca_pipeline.py may exit 0 even when it falls back; we
        // still record the run. The server fallback remains available.
        return { exitCode: result.exitCode };
      };

    case "sync-flow-source-timestamps":
      return async () => {
        const result = await runSubprocess("npx", [
          "tsx",
          "scripts/sync-flow-source-timestamps.ts",
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
