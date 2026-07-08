---
name: verify
description: Build, launch and drive the gistify app locally to verify a change end-to-end (server API + rendered UI in headless Chrome).
---

# Verifying gistify changes locally

## Build + launch

1. Client bundle (server serves `dist/public`): `npx vite build` (~20s).
2. Server (API + static) without Docker:
   ```powershell
   $env:PORT='3210'; $env:APP_ACCESS_MODE='public'; npx tsx server/index.ts
   ```
   - `APP_ACCESS_MODE=public` bypasses the Google OAuth gate that otherwise blocks every PRO page (TÜFE/ÜFE, Momentum, …) with a login card.
   - Run in background; ready when `http://localhost:3210/api/cpi-ppi/forecast` returns 200 (~10s). Watch the log for pipeline/seed lines.
   - Local quirk: repo-root `cpi_forecast.json` / `ppi_forecast.json` are often stale vs `client/public/*.json`; the sync service resolves repo root first, so "live" data locally may be an older month than production.

## Drive the UI

- Static screenshot: headless Chrome works directly (no Playwright/puppeteer in repo):
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --no-sandbox `
    --screenshot="$env:TEMP\shot.png" --window-size=1500,1600 --virtual-time-budget=20000 --hide-scrollbars `
    "http://localhost:3210/<route>"
  ```
  Note: writing the screenshot into the session scratchpad path silently fails; write to `$env:TEMP` instead.
- Interactions (clicks, waits): install `puppeteer-core` into the scratchpad (NOT the repo) and point `executablePath` at the Chrome above. Drive `page.goto` → `waitForFunction` → `evaluate(click)` → `screenshot`.

## Gotchas

- App routes come from `client/src/App.tsx` (e.g. `/cpi-ppi`); TR is the default language, no prefix needed.
- API smoke checks: `Invoke-RestMethod "http://localhost:3210/api/..."`.
- A cookie-consent banner (Secure Privacy) overlays the bottom of every page; hide it via DOM before clean screenshots.
- Stop the background server task when done; it holds the SQLite DB in `data/gistify.sqlite`.
