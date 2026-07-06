#!/usr/bin/env python3
"""
deploy_flow.py
──────────────
Flow dizinindeki yeni HTML dosyalarini git add → commit → push ile deploy eder.

Kullanim:
    python scripts/deploy_flow.py flow/daily-x-research-ornek-6-temmuz-2026.html

Ozellikler:
  • Otomatik main branch kontrolu ve switch
  • "nothing to commit" durumunda sessiz gecis
  • Conflict durumunda pull --rebase + retry
  • Git repo validasyonu
"""

import argparse
import os
import subprocess
import sys
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────────────
# 0. Konfigurasyon
# ──────────────────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).resolve().parent.parent  # gistify/
REMOTE = "origin"
BRANCH = "main"
FLOW_URL_BASE = "https://gistify.pro/flow/"

# ──────────────────────────────────────────────────────────────────────────────
# 1. Yardimcilar
# ──────────────────────────────────────────────────────────────────────────────


def run(
    cmd: list[str],
    cwd: Path = REPO_ROOT,
    check: bool = True,
    capture: bool = True,
) -> subprocess.CompletedProcess:
    """Subprocess calistirici; hata durumunda detayli mesaj basar."""
    result = subprocess.run(
        cmd,
        cwd=cwd,
        capture_output=capture,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if check and result.returncode != 0:
        raise subprocess.CalledProcessError(
            result.returncode, cmd, output=result.stdout, stderr=result.stderr
        )
    return result


def is_git_repo(path: Path) -> bool:
    try:
        run(["git", "rev-parse", "--git-dir"], cwd=path, check=True)
        return True
    except subprocess.CalledProcessError:
        return False


def current_branch() -> str:
    return run(["git", "branch", "--show-current"]).stdout.strip()


def has_changes(file_path: str) -> bool:
    """Dosyanin stage'lenecek bir degisikligi var mi?"""
    result = run(["git", "status", "--porcelain", file_path], check=False)
    return bool(result.stdout.strip())


def ensure_branch_main():
    """Aktif branch main degilse main'e gec."""
    branch = current_branch()
    if branch != BRANCH:
        print(f"[WARN]  Aktif branch '{branch}', '{BRANCH}'e geciliyor...")
        try:
            run(["git", "checkout", BRANCH])
        except subprocess.CalledProcessError:
            print(f"[ERR] '{BRANCH}' branch'ine gecilemedi. Lutfen manuel kontrol edin.")
            sys.exit(1)


def git_pull_rebase():
    """origin/main'den pull --rebase yap."""
    print("[SYNC] Conflict cozumu: git pull --rebase origin main")
    try:
        run(["git", "pull", REMOTE, BRANCH, "--rebase"])
        print("[OK] Rebase basarili.")
    except subprocess.CalledProcessError as e:
        print("[ERR] Rebase basarisiz. Manuel mudahale gerekebilir.")
        if e.stderr:
            print(e.stderr)
        sys.exit(1)


# ──────────────────────────────────────────────────────────────────────────────
# 2. Deploy Akisi
# ──────────────────────────────────────────────────────────────────────────────


def deploy(file_path: str):
    full_path = REPO_ROOT / file_path
    if not full_path.exists():
        print(f"[ERR] Dosya bulunamadi: {full_path}")
        sys.exit(1)

    # Git repo validasyonu
    if not is_git_repo(REPO_ROOT):
        print(f"[ERR] {REPO_ROOT} bir git repository degil.")
        sys.exit(1)

    # Branch kontrolu
    ensure_branch_main()

    # Stage
    print(f"[ADD] git add {file_path}")
    run(["git", "add", file_path])

    # Degisiklik var mi?
    if not has_changes(file_path):
        print("[INFO]  Staging alaninda degisiklik yok (nothing to commit).")
        print(f"[URL] URL: {FLOW_URL_BASE}{Path(file_path).name}")
        return

    # Commit
    file_name = Path(file_path).name
    commit_msg = f"flow: {file_name} [auto-deploy]"
    print(f"[INFO] git commit -m \"{commit_msg}\"")
    run(["git", "commit", "-m", commit_msg])

    # Push
    print(f"[DEPLOY] git push {REMOTE} {BRANCH}")
    try:
        run(["git", "push", REMOTE, BRANCH])
    except subprocess.CalledProcessError as e:
        stderr = e.stderr or ""
        if "rejected" in stderr.lower() or "non-fast-forward" in stderr.lower():
            print("[WARN]  Push rejected — muhtemelen upstream'de yeni commit var.")
            git_pull_rebase()
            # Retry push
            print("[DEPLOY] Tekrar push deneniyor...")
            run(["git", "push", REMOTE, BRANCH])
        else:
            print(f"[ERR] Push basarisiz: {stderr}")
            sys.exit(1)

    print("\n" + "=" * 50)
    print("[OK] Deploy basarili!")
    print(f"[URL] URL: {FLOW_URL_BASE}{file_name}")
    print("=" * 50)


# ──────────────────────────────────────────────────────────────────────────────
# 3. CLI
# ──────────────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(
        description="Flow HTML dosyalarini git ile deploy et"
    )
    parser.add_argument(
        "file",
        help="Deploy edilecek HTML dosyasinin repo-relative path'i "
             '(orn. "flow/daily-x-research-ornek-6-temmuz-2026.html")',
    )
    args = parser.parse_args()
    deploy(args.file)


if __name__ == "__main__":
    main()
