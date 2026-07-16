# Gistify — Production Deployment & Persistence Guide

This document describes the production deployment model for Gistify after the central SQLite persistence migration. For the original Midas-specific deploy guide, see `deploy-server.md`.

---

## TL;DR

```bash
cd /srv/gistify
./scripts/deploy-server.sh
```

**Mandatory:** `/srv/gistify/data` must be a persistent host directory mounted into the container as `/app/data`. Without this, likes/shares/reads, macro archive, cron history and deploy history reset on every redeploy.

---

## Required persistent volumes

| Host path | Container path | Contents |
|-----------|----------------|----------|
| `/srv/gistify/data` | `/app/data` | `billing.sqlite`, `gistify.sqlite`, WAL/SHM files |
| `/srv/gistify/midas` | `/data/midas` | `midas_signals.json` (read-only from container) |

The central SQLite database lives at `GISTIFY_DB_PATH=/app/data/gistify.sqlite` (default). Billing data remains in `BILLING_DB_PATH=/app/data/billing.sqlite`.

---

## Standard deploy command

`scripts/deploy-server.sh` performs the following:

1. Ensures `/srv/gistify/data`, `/srv/gistify/midas` and `/srv/gistify/backups` exist.
2. Backs up existing SQLite files to `/srv/gistify/backups/`.
3. Migrates SQLite files from an old container if one exists.
4. Resolves `GIT_SHA` and `GIT_BRANCH` for `deploy_history` records.
5. Pulls the latest image and recreates the container with `docker compose`.
6. Runs a post-deploy health check against `http://localhost:3000/api/health`.

Run it after every image rebuild or flow content push:

```bash
ssh user@82.29.173.6
cd /srv/gistify
./scripts/deploy-server.sh
```

---

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | `production` | Runtime mode |
| `PORT` | `3000` | HTTP port |
| `BILLING_DB_PATH` | `/app/data/billing.sqlite` | Legacy billing/auth DB |
| `GISTIFY_DB_PATH` | `/app/data/gistify.sqlite` | Central persistence DB |
| `MIDAS_PIPELINE_SOURCE_FILE` | `/data/midas/midas_signals.json` | Market signal feed |
| `GIT_SHA` | — | Commit SHA recorded in `deploy_history` |
| `GIT_BRANCH` | — | Branch recorded in `deploy_history` |
| `REPORT_ADMIN_SECRET` | — | Shared secret for `x-gistify-admin-secret` header (required for job-triggered server refresh) |
| `REPORT_ADMIN_EMAIL` | `hsnksc@gmail.com` | Admin session email |
| `WATCHLIST_ALERT_WEBHOOK_URL` | — | Email automation endpoint for queued account watchlist alerts; queue remains pending when omitted |
| `WATCHLIST_ALERT_WEBHOOK_SECRET` | — | Optional `X-Gistify-Signature` header sent to the watchlist delivery endpoint |

---

## Backup and restore

### Automatic backups

`deploy-server.sh` copies the current SQLite files to `/srv/gistify/backups/` before replacing the container. The most recent 10 backups are kept.

```bash
ls -lt /srv/gistify/backups/
```

### Manual backup

```bash
docker stop gistify
cp /srv/gistify/data/gistify.sqlite /srv/gistify/backups/gistify-manual-$(date +%Y%m%d_%H%M%S).sqlite
cp /srv/gistify/data/billing.sqlite /srv/gistify/backups/billing-manual-$(date +%Y%m%d_%H%M%S).sqlite
docker start gistify
```

### Restore from backup

```bash
docker stop gistify
cp /srv/gistify/backups/gistify-YYYYMMDD_HHMMSS.sqlite /srv/gistify/data/gistify.sqlite
cp /srv/gistify/backups/billing-YYYYMMDD_HHMMSS.sqlite /srv/gistify/data/billing.sqlite
# Remove stale WAL files if the backup was taken while the DB was closed cleanly
rm -f /srv/gistify/data/gistify.sqlite-wal /srv/gistify/data/gistify.sqlite-shm
docker start gistify
```

---

## Corruption recovery

If the SQLite database becomes corrupt:

1. Stop the container.
2. Copy the latest backup.
3. Verify integrity inside the container or with a local SQLite tool:
   ```bash
   sqlite3 /srv/gistify/data/gistify.sqlite "PRAGMA integrity_check;"
   sqlite3 /srv/gistify/data/billing.sqlite "PRAGMA integrity_check;"
   ```
4. If integrity check fails and you have no good backup, dump and reload:
   ```bash
   sqlite3 /srv/gistify/data/gistify.sqlite ".dump" > /tmp/gistify-dump.sql
   sqlite3 /srv/gistify/data/gistify.sqlite.restored < /tmp/gistify-dump.sql
   ```
5. Restart the container.

---

## Host cron / systemd timer setup

Use `scripts/run-job.mts` for all scheduled work so locking and run history are recorded centrally.

### Cron example

```bash
# /etc/cron.d/gistify
*/10 * * * * root cd /srv/gistify && docker exec gistify npx tsx scripts/run-job.mts midas-signals >> /var/log/gistify-cron.log 2>&1
0 9,21 * * * root cd /srv/gistify && docker exec gistify npx tsx scripts/run-job.mts x-research-pipeline >> /var/log/gistify-cron.log 2>&1
0 * * * * root cd /srv/gistify && docker exec gistify npx tsx scripts/run-job.mts sync-flow-source-timestamps >> /var/log/gistify-cron.log 2>&1
0 4 * * 0 root cd /srv/gistify && docker exec gistify npx tsx scripts/run-job.mts maintenance >> /var/log/gistify-cron.log 2>&1
```

### systemd timer example

```ini
# /etc/systemd/system/gistify-midas.service
[Unit]
Description=Gistify Midas signals refresh

[Service]
Type=oneshot
ExecStart=/usr/bin/docker exec gistify npx tsx scripts/run-job.mts midas-signals
```

```ini
# /etc/systemd/system/gistify-midas.timer
[Unit]
Description=Run Gistify Midas refresh every 10 minutes

[Timer]
OnCalendar=*:0/10
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
systemctl daemon-reload
systemctl enable gistify-midas.timer
systemctl start gistify-midas.timer
```

---

## Admin diagnostics

Authenticated admins can inspect the persistence layer via:

- `GET /api/admin/diagnostics` — DB path, size, journal mode, applied migrations, fresh-DB flag, uptime
- `GET /api/admin/cron/runs?job=&status=&limit=` — job run history
- `GET /api/admin/deploys?limit=` — deploy history
- `GET /api/admin/macro/archive?workspace=cpi|ppi&limit=` — macro archive records
- `GET /api/admin/signals/snapshots?kind=midas&limit=` — signal snapshots (midas, calendar, earnings)
- `GET /api/admin/artifacts?kind=&limit=` — artifact records

Auth: valid admin session (email matches `REPORT_ADMIN_EMAIL`) or `x-gistify-admin-secret` header matching `REPORT_ADMIN_SECRET`.

---

## What the "new empty database" warning means

On startup the server logs:

```
[gistify-db] WARNING: A new empty SQLite database was created. If this is a production deploy, confirm that /app/data is mounted from a persistent host volume...
```

This means the container created a fresh `gistify.sqlite` because it could not find an existing one. In production this almost always indicates that the `/app/data` volume is not mounted from the host. Fix:

1. Stop the container.
2. Ensure `/srv/gistify/data` exists on the host and contains the previous DB files.
3. Recreate the container with `docker-compose.yml` or `deploy-server.sh`.

**Never** run `docker compose down -v` or `docker volume rm` on the Gistify data volume unless you intend to destroy all persisted data.

---

## Migration scripts

One-time helper scripts are provided to import existing data:

```bash
npx tsx scripts/migrate-flow-engagement.ts
npx tsx scripts/migrate-macro-json.ts
npx tsx scripts/migrate-signals-json.ts
```

All three are idempotent and safe to re-run.

---

## Verification

Run the persistence verification suite against a temporary database:

```bash
GISTIFY_DB_PATH=/tmp/gistify-verify.sqlite npx tsx scripts/verify-persistence.mts
```

This tests migrations, flow counters, macro archive and job locking.
