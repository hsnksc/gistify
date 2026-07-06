#!/usr/bin/env python3
"""
Gistify X Research Pipeline — Master Orchestrator

Stage'ler (sirayla):
  1. x_scraper          -> X.com home feed'den raw post'lari ceker
  2. post_filter        -> Finans/ekonomi odakli post'lari filtreler & skorlar
  3. mistral_research   -> Mistral AI ile derin arastirma yapar
  4. article_synthesizer-> Arastirma sonuclarini makaleye donusturur
  5. flow_converter     -> Makaleyi Flow HTML formatina cevirir
  6. deploy_flow        -> Flow HTML'yi git ile deploy eder

Kullanim:
  python scripts/run_x_research_pipeline.py
  python scripts/run_x_research_pipeline.py --dry-run
  python scripts/run_x_research_pipeline.py --skip-scraper --skip-mistral
  python scripts/run_x_research_pipeline.py --date 5-temmuz-2026
"""

import argparse
import importlib
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

from config import ensure_dirs, get_date_slug


# ── Stage yapilandirmasi ──────────────────────────────────────────────────────
# (modul_adi, main_fonksiyonu, kritik_mi, aciklama)
STAGES = [
    ("x_scraper", "main", True, "X.com scraper — raw post'lari cek"),
    ("post_filter", "main", True, "Post filter — finans/ekonomi odakli filtreleme"),
    ("mistral_research", "main", False, "Mistral deep research — opsiyonel"),
    ("article_synthesizer", "main", False, "Article synthesizer — makale uretimi"),
    ("flow_converter", "main", True, "Flow converter — HTML formatina cevir"),
    ("deploy_flow", "run", True, "Deploy — git push (subprocess)"),
]


# ── Logger ────────────────────────────────────────────────────────────────────
def log(msg: str) -> None:
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)


# ── Stage calistirma ──────────────────────────────────────────────────────────
def run_stage_module(module_name: str, func_name: str, date_slug: str, dry_run: bool) -> bool:
    """
    Bir Python modulunu import edip belirtilen fonksiyonu cagirir.
    """
    try:
        # Modulu scripts/ dizininden import et
        spec = importlib.util.spec_from_file_location(
            module_name,
            Path(__file__).parent / f"{module_name}.py",
        )
        if spec is None or spec.loader is None:
            log(f"[FAIL] {module_name}.py bulunamadi")
            return False

        module = importlib.util.module_from_spec(spec)
        sys.modules[module_name] = module
        spec.loader.exec_module(module)

        func = getattr(module, func_name)

        # Fonksiyon imzasina gore argumanlari ilet
        import inspect
        sig = inspect.signature(func)
        kwargs = {}
        if "date_slug" in sig.parameters:
            kwargs["date_slug"] = date_slug
        if "dry_run" in sig.parameters:
            kwargs["dry_run"] = dry_run

        func(**kwargs)
        return True

    except Exception as e:
        log(f"[FAIL] Stage {module_name} hata: {e}")
        return False


def run_flow_converter_stage(date_slug: str, dry_run: bool) -> bool:
    """
    flow_converter.py'yi subprocess olarak calistirir.
    """
    script_path = Path(__file__).parent / "flow_converter.py"
    if not script_path.exists():
        log(f"[FAIL] flow_converter.py bulunamadi: {script_path}")
        return False

    meta_path = Path("data/x_research/articles") / f"makale_{date_slug}_meta.json"
    cmd = [sys.executable, str(script_path), "--meta", str(meta_path)]
    if dry_run:
        log("[DRY-RUN] flow_converter calistirilacak: " + " ".join(cmd))
        return True

    try:
        result = subprocess.run(
            cmd,
            cwd=str(Path(__file__).parent.parent),
            capture_output=True,
            text=True,
            timeout=300,
        )
        if result.returncode == 0:
            if result.stdout:
                for line in result.stdout.strip().splitlines():
                    log(f"  [converter] {line}")
            return True
        else:
            log(f"[FAIL] flow_converter.py exit code {result.returncode}")
            if result.stderr:
                for line in result.stderr.strip().splitlines():
                    log(f"  [converter-err] {line}")
            return False
    except subprocess.TimeoutExpired:
        log("[FAIL] flow_converter.py timeout (300s)")
        return False
    except Exception as e:
        log(f"[FAIL] flow_converter.py hata: {e}")
        return False


def run_deploy_stage(date_slug: str, dry_run: bool) -> bool:
    """
    deploy_flow.py'yi subprocess olarak calistirir.
    Son uretilen Flow HTML dosyasini otomatik olarak bulur ve deploy eder.
    """
    script_path = Path(__file__).parent / "deploy_flow.py"
    if not script_path.exists():
        log(f"[FAIL] deploy_flow.py bulunamadi: {script_path}")
        return False

    repo_root = Path(__file__).parent.parent
    flow_dir = repo_root / "flow"
    html_files = sorted(
        flow_dir.glob("daily-*.html"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not html_files:
        log("[FAIL] Deploy edilecek Flow HTML dosyasi bulunamadi")
        return False

    target_file = html_files[0]
    target_arg = str(target_file.relative_to(repo_root))
    log(f"[DEPLOY] Deploy hedefi: {target_arg}")

    cmd = [sys.executable, str(script_path), target_arg]
    if dry_run:
        cmd.append("--dry-run")

    env = dict(os.environ)
    env["X_RESEARCH_DATE_SLUG"] = date_slug

    try:
        result = subprocess.run(
            cmd,
            cwd=str(Path(__file__).parent.parent),
            capture_output=True,
            text=True,
            env=env,
            timeout=300,
        )
        if result.returncode == 0:
            if result.stdout:
                for line in result.stdout.strip().splitlines():
                    log(f"  [deploy] {line}")
            return True
        else:
            log(f"[FAIL] deploy_flow.py exit code {result.returncode}")
            if result.stderr:
                for line in result.stderr.strip().splitlines():
                    log(f"  [deploy-err] {line}")
            return False
    except subprocess.TimeoutExpired:
        log("[FAIL] deploy_flow.py timeout (300s)")
        return False
    except Exception as e:
        log(f"[FAIL] deploy_flow.py hata: {e}")
        return False


# ── Pipeline ──────────────────────────────────────────────────────────────────
def run_pipeline(skip_scraper: bool, skip_mistral: bool, date_slug: str, dry_run: bool) -> int:
    """
    Tum pipeline'i calistirir.

    Returns:
        int: 0 = basarili, 1 = hatali
    """
    import os  # noqa: F811 — run_deploy_stage icinde de lazim

    start_time = time.time()
    log("=" * 60)
    log(f"[START] X Research Pipeline BASLATILIYOR — date_slug: {date_slug}")
    log(f"   dry_run={dry_run}, skip_scraper={skip_scraper}, skip_mistral={skip_mistral}")
    log("=" * 60)

    # Dizinleri hazirla
    ensure_dirs()
    log("[OK] Dizinler hazir")

    pipeline_ok = True

    for stage_idx, (module_name, func_name, is_critical, desc) in enumerate(STAGES, 1):
        # Stage atlamalari
        if skip_scraper and module_name == "x_scraper":
            log(f"[SKIP] Stage {stage_idx}: {module_name} (--skip-scraper)")
            continue
        if skip_mistral and module_name == "mistral_research":
            log(f"[SKIP] Stage {stage_idx}: {module_name} (--skip-mistral)")
            continue

        log(f"-> Stage {stage_idx}/{len(STAGES)}: {module_name} — {desc}")
        stage_start = time.time()

        # deploy_flow ozel islem — subprocess
        if module_name == "deploy_flow":
            ok = run_deploy_stage(date_slug, dry_run)
        elif module_name == "flow_converter":
            ok = run_flow_converter_stage(date_slug, dry_run)
        else:
            ok = run_stage_module(module_name, func_name, date_slug, dry_run)

        stage_elapsed = time.time() - stage_start

        if ok:
            log(f"[OK] Stage {stage_idx} tamamlandi ({stage_elapsed:.1f}s)")
        else:
            log(f"[FAIL] Stage {stage_idx} BASARISIZ ({stage_elapsed:.1f}s)")
            if is_critical:
                log(f"[ABORT] Kritik stage basarisiz — pipeline durduruluyor.")
                pipeline_ok = False
                break
            else:
                log(f"[WARN] Opsiyonel stage basarisiz — devam ediliyor.")

    total_elapsed = time.time() - start_time
    log("=" * 60)
    if pipeline_ok:
        log(f"[OK] Pipeline TAMAMLANDI — Toplam sure: {total_elapsed:.1f}s")
        return 0
    else:
        log(f"[FAIL] Pipeline HATAYLA BITTI — Toplam sure: {total_elapsed:.1f}s")
        return 1


# ── CLI ───────────────────────────────────────────────────────────────────────
def main() -> int:
    parser = argparse.ArgumentParser(
        description="Gistify X Research Pipeline — Master Orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ornekler:
  %(prog)s
  %(prog)s --dry-run
  %(prog)s --skip-scraper --skip-mistral
  %(prog)s --date 5-temmuz-2026 --dry-run
        """,
    )
    parser.add_argument(
        "--skip-scraper",
        action="store_true",
        help="Scraper'i atla, mevcut raw_posts.json kullan",
    )
    parser.add_argument(
        "--skip-mistral",
        action="store_true",
        help="Mistral research'i atla, mevcut research sonuclarini kullan",
    )
    parser.add_argument(
        "--date",
        type=str,
        default=None,
        help="Belirli bir tarih slug'i kullan (orn: 5-temmuz-2026). Varsayilan: bugun",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Deploy etme, sadece HTML olustur",
    )

    args = parser.parse_args()

    date_slug = args.date if args.date else get_date_slug()

    return run_pipeline(
        skip_scraper=args.skip_scraper,
        skip_mistral=args.skip_mistral,
        date_slug=date_slug,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    sys.exit(main())
