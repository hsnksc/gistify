# Midas Pipeline — Production Deploy & Sync Guide

> **Goal:** Run Midas pipeline on the production VPS and make Gistify serve `/api/midas/signals` from a canonical, atomically-updated `midas_signals.json` file without requiring a redeploy on every refresh.

---

## 1. Where the file should live

| Target | Host path | Container path | Env |
|--------|-----------|----------------|-----|
| **Docker** | `/srv/gistify/midas/midas_signals.json` | `/data/midas/midas_signals.json` | `MIDAS_PIPELINE_SOURCE_FILE=/data/midas/midas_signals.json` |
| **Bare metal** | `/var/gistify/data/midas/midas_signals.json` | — | `MIDAS_PIPELINE_SOURCE_FILE=/var/gistify/data/midas/midas_signals.json` |

> The server already supports this via `server/midasSignals.ts` fallback chain.

---

## 2. Docker: mount a host volume

### 2.1 Create the host directory

```bash
sudo mkdir -p /srv/gistify/midas
sudo chown $(id -u):$(id -g) /srv/gistify/midas
```

### 2.2 Docker run

```bash
docker run -d \
  --name gistify \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e MIDAS_PIPELINE_SOURCE_FILE=/data/midas/midas_signals.json \
  -v /srv/gistify/midas:/data/midas:ro \
  hsanksc/gistify:latest
```

> `:ro` = read-only. The container only reads; the pipeline writes on the host.

### 2.3 Docker Compose

```yaml
services:
  gistify:
    image: hsanksc/gistify:latest
    container_name: gistify
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      MIDAS_PIPELINE_SOURCE_FILE: /data/midas/midas_signals.json
    volumes:
      - /srv/gistify/midas:/data/midas:ro
    restart: unless-stopped
```

---

## 3. Bare metal (systemd)

### 3.1 Create directory & env

```bash
sudo mkdir -p /var/gistify/data/midas
sudo chown $(id -u):$(id -g) /var/gistify/data/midas
```

### 3.2 systemd service unit

```ini
# /etc/systemd/system/gistify.service
[Unit]
Description=Gistify Node.js app
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/gistify/app
ExecStart=/usr/bin/node dist/index.js
Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="MIDAS_PIPELINE_SOURCE_FILE=/var/gistify/data/midas/midas_signals.json"
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable gistify
sudo systemctl start gistify
```

---

## 4. Atomic write from the pipeline

The local cron job (or any writer) should update the file atomically so Gistify never reads a half-written JSON.

```python
# In midas_sync.py — the final write step
import json, os, tempfile, shutil

src = Path("C:/Users/hasan/OneDrive/Desktop/midas/midas_signals.json")
vps_path = Path("/srv/gistify/midas/midas_signals.json")  # or /var/gistify/...

# Step 1: write to temp file
tmp_fd, tmp_path = tempfile.mkstemp(dir=vps_path.parent, suffix=".tmp")
with os.fdopen(tmp_fd, "w") as f:
    json.dump(data, f)

# Step 2: atomic rename
os.replace(tmp_path, vps_path)

# Step 3: if needed, reload the app (Docker only)
# docker exec gistify kill -HUP 1  # or restart container if file-watch is absent
```

> **Note:** The Node server already re-reads the file on its own poll interval (default 5 min, min 30 s). No reload is required unless you want sub-5-minute freshness.

---

## 5. Verify checklist

After every pipeline run or deploy:

```bash
# 1. File exists and is valid JSON
cat /srv/gistify/midas/midas_signals.json | jq '.timestamp, .symbol_count'

# 2. Timestamp is recent
stat /srv/gistify/midas/midas_signals.json

# 3. API returns data
curl -s http://localhost:3000/api/midas/signals | jq '.timestamp, .signals | length'

# 4. Container logs show no read errors
docker logs --tail 20 gistify
```

---

## 6. If you need SSH-less push

Option A — `scp` from the Windows cron run (requires a VPS key):  
Option B — Let the VPS itself run `midas_pipeline.py` on a schedule (cron + Docker exec or systemd timer).  
Option C — Keep the Windows pipeline writing locally, and run a tiny sync script on the VPS that pulls from GitHub artifacts or a shared volume.

**Recommended:** Put the pipeline on the VPS itself (Option B). The VPS already runs Docker; add a second container or a systemd timer that hits the Midas dashboard via WebBridge (or use a headless browser in the VPS) and writes to the shared volume.

---

## 7. What to change right now

1. **On the VPS:** create `/srv/gistify/midas` and mount it into the container with `MIDAS_PIPELINE_SOURCE_FILE=/data/midas/midas_signals.json`.
2. **In the skill:** update `midas_sync.py` to write to the VPS path (or copy via `scp` / `rsync`).
3. **In the cron job:** if the pipeline stays on Windows, append an `scp` step to the prompt; if it moves to the VPS, replace the Windows cron with a VPS systemd timer.

---

> **Disclaimer:** This is a deploy guide, not a trading signal. The momentum scores are informational only.
