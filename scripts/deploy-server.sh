#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# scripts/deploy-server.sh
# ──────────────────────────────────────────────────────────────────────────────
# Production deploy helper for the Gistify Docker container.
#
# Guarantees:
#   • Host directories for persistent SQLite + Midas signals exist.
#   • SQLite files are backed up before the container is replaced.
#   • Data from a previously running container is migrated to the host volume.
#   • The container is started with docker compose so volume mounts are explicit.
#   • Git metadata is forwarded to the container for deploy_history records.
#
# Run on the production VPS (or any Linux host with Docker):
#     chmod +x scripts/deploy-server.sh
#     ./scripts/deploy-server.sh
# ──────────────────────────────────────────────────────────────────────────────

set -euo pipefail

HOST_DATA_DIR="/srv/gistify/data"
HOST_MIDAS_DIR="/srv/gistify/midas"
HOST_BACKUP_DIR="/srv/gistify/backups"
CONTAINER_NAME="gistify"
BACKUP_RETENTION_COUNT=10

# 1. Make sure persistent host directories exist.
mkdir -p "${HOST_DATA_DIR}"
mkdir -p "${HOST_MIDAS_DIR}"
mkdir -p "${HOST_BACKUP_DIR}"

# 2. Fail fast if the data directory is not a real host directory.
if [ ! -d "${HOST_DATA_DIR}" ]; then
  echo "[ERR] Host data directory does not exist: ${HOST_DATA_DIR}"
  echo "[ERR] Create it and ensure it is mounted into the container as /app/data."
  exit 1
fi

# 3. Backup existing DB files before stopping the container.
timestamp=$(date +%Y%m%d_%H%M%S)
backup_prefix="${HOST_BACKUP_DIR}/gistify-${timestamp}"

backup_file() {
  local src="$1"
  local dst="$2"
  if [ -f "${src}" ]; then
    cp "${src}" "${dst}"
  fi
}

if [ -f "${HOST_DATA_DIR}/gistify.sqlite" ] || [ -f "${HOST_DATA_DIR}/billing.sqlite" ]; then
  backup_file "${HOST_DATA_DIR}/gistify.sqlite" "${backup_prefix}.sqlite"
  backup_file "${HOST_DATA_DIR}/gistify.sqlite-wal" "${backup_prefix}.sqlite-wal"
  backup_file "${HOST_DATA_DIR}/gistify.sqlite-shm" "${backup_prefix}.sqlite-shm"
  backup_file "${HOST_DATA_DIR}/billing.sqlite" "${backup_prefix}-billing.sqlite"
  backup_file "${HOST_DATA_DIR}/billing.sqlite-wal" "${backup_prefix}-billing.sqlite-wal"
  backup_file "${HOST_DATA_DIR}/billing.sqlite-shm" "${backup_prefix}-billing.sqlite-shm"
  echo "[BACKUP] SQLite backups created with prefix: ${backup_prefix}"
fi

# 4. Trim old backups (keep the most recent N).
find "${HOST_BACKUP_DIR}" -maxdepth 1 -type f -name "gistify-*.sqlite" -print0 \
  | xargs -0 ls -t \
  | tail -n +$((BACKUP_RETENTION_COUNT + 1)) \
  | xargs -r rm -f

# 5. If an old container exists that was NOT started with compose, migrate its data.
if docker ps -a --format '{{.Names}}' | grep -qx "${CONTAINER_NAME}"; then
  echo "[MIGRATE] Existing '${CONTAINER_NAME}' container found; copying SQLite files to host volume..."
  docker stop "${CONTAINER_NAME}" >/dev/null 2>&1 || true

  docker cp "${CONTAINER_NAME}:/app/data/billing.sqlite" "${HOST_DATA_DIR}/billing.sqlite" 2>/dev/null || true
  docker cp "${CONTAINER_NAME}:/app/data/billing.sqlite-shm" "${HOST_DATA_DIR}/billing.sqlite-shm" 2>/dev/null || true
  docker cp "${CONTAINER_NAME}:/app/data/billing.sqlite-wal" "${HOST_DATA_DIR}/billing.sqlite-wal" 2>/dev/null || true
  docker cp "${CONTAINER_NAME}:/app/data/gistify.sqlite" "${HOST_DATA_DIR}/gistify.sqlite" 2>/dev/null || true
  docker cp "${CONTAINER_NAME}:/app/data/gistify.sqlite-shm" "${HOST_DATA_DIR}/gistify.sqlite-shm" 2>/dev/null || true
  docker cp "${CONTAINER_NAME}:/app/data/gistify.sqlite-wal" "${HOST_DATA_DIR}/gistify.sqlite-wal" 2>/dev/null || true

  echo "[MIGRATE] Removing old '${CONTAINER_NAME}' container..."
  docker rm "${CONTAINER_NAME}" >/dev/null 2>&1 || true
fi

# 6. Resolve git metadata for deploy_history.
export GIT_SHA="$(git rev-parse HEAD 2>/dev/null || echo "")"
export GIT_BRANCH="$(git branch --show-current 2>/dev/null || echo "")"

# 7. Pull the latest image and recreate the container with compose.
echo "[DEPLOY] Pulling latest image..."
docker compose pull gistify

echo "[DEPLOY] Starting container with docker compose..."
docker compose up -d --force-recreate --remove-orphans

# 8. Post-deploy health check.
echo "[DEPLOY] Waiting for container to become healthy..."
sleep 5

health_url="http://localhost:3000/api/health"
if curl -fsS "${health_url}" >/dev/null 2>&1; then
  echo "[DEPLOY] Health check passed: ${health_url}"
else
  echo "[ERR] Post-deploy health check failed: ${health_url}"
  echo "[ERR] Inspect logs with: docker compose logs --tail 50 gistify"
  exit 1
fi

echo "[DEPLOY] Container status:"
docker compose ps

echo "[DEPLOY] Recent logs:"
docker compose logs --tail 15 gistify

echo "[OK] Deploy completed successfully."
