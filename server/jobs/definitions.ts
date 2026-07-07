import type { CronJobDefinition } from "../services/jobCoordinator";

export const CRON_JOB_DEFINITIONS: CronJobDefinition[] = [
  {
    name: "x-research-pipeline",
    schedule: "0 9,21 * * *",
    enabled: false,
    description:
      "End-to-end X research pipeline: scrape → filter → research → synthesize → flow HTML → deploy. (Disabled — managed externally.)",
  },
  {
    name: "midas-signals",
    schedule: "*/10 * * * *",
    enabled: true,
    description: "Refresh Midas momentum signals from Alpaca market data.",
  },
  {
    name: "sync-flow-source-timestamps",
    schedule: "0 * * * *",
    enabled: true,
    description:
      "Synchronize flow source timestamp manifest after content updates.",
  },
  {
    name: "maintenance",
    schedule: "0 4 * * 0",
    enabled: true,
    description:
      "Prune old cron run records, run PRAGMA optimize and wal_checkpoint.",
  },
];
