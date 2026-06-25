import json
import sys
import os
from datetime import datetime, timezone, timedelta
from croniter import croniter
import pytz

# ── Configuration ───────────────────────────────────────────────────────────
STATE_FILE = r"C:\Users\hasan\OneDrive\Desktop\gistify\missed_task_recovery_state.json"
MAX_AGE_HOURS = 24
EXECUTION_TOLERANCE_SECONDS = 120
NOW_TOLERANCE_SECONDS = 300

# ── Helpers ─────────────────────────────────────────────────────────────────

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"recovered": {}, "lastCheck": None}


def save_state(state):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)


def parse_iso(dt_str):
    if not dt_str:
        return None
    dt_str = dt_str.replace("Z", "+00:00")
    return datetime.fromisoformat(dt_str)


def get_job_timezone(job):
    tz_name = job.get("timeZone", "UTC")
    try:
        return pytz.timezone(tz_name)
    except Exception:
        return pytz.UTC


def was_run_executed(job, expected_run, tz):
    """
    Bir expected run'un çalıştırılıp çalıştırılmadığını kontrol et.
    lastFiredAt expected_run'dan sonraki 120 saniye içindeyse → çalıştırılmış.
    recentRuns'ta scheduledAt expected_run'a 120 saniye içindeyse → çalıştırılmış.
    """
    expected_utc = expected_run.astimezone(timezone.utc)
    
    # 1) lastFiredAt kontrolü
    last_fired = parse_iso(job.get("lastFiredAt"))
    if last_fired:
        last_fired_utc = last_fired.astimezone(timezone.utc)
        if abs((last_fired_utc - expected_utc).total_seconds()) <= EXECUTION_TOLERANCE_SECONDS:
            return True
        if last_fired_utc > expected_utc + timedelta(seconds=EXECUTION_TOLERANCE_SECONDS):
            return True
    
    # 2) recentRuns kontrolü
    for run in job.get("recentRuns", []):
        scheduled = parse_iso(run.get("scheduledAt"))
        if scheduled:
            scheduled_utc = scheduled.astimezone(timezone.utc)
            if abs((scheduled_utc - expected_utc).total_seconds()) <= EXECUTION_TOLERANCE_SECONDS:
                return True
    
    return False


# ── Core Logic ──────────────────────────────────────────────────────────────

def find_missed_jobs(jobs_data, now=None):
    if now is None:
        now = datetime.now(timezone.utc)
    
    state = load_state()
    recovered = state.get("recovered", {})
    missed = []
    
    for job in jobs_data:
        job_id = job.get("id")
        if not job_id:
            continue
        if not job.get("enabled", False):
            continue
        
        trigger = job.get("trigger", {})
        if trigger.get("kind") != "cron":
            continue
        
        expr = trigger.get("expr")
        if not expr:
            continue
        
        tz = get_job_timezone(job)
        now_local = now.astimezone(tz)
        
        # Son çalışma zamanı
        last_fired = parse_iso(job.get("lastFiredAt"))
        if last_fired:
            start_local = last_fired.astimezone(tz)
        else:
            start_local = now_local - timedelta(hours=MAX_AGE_HOURS)
        
        # Expected run'ları hesapla (lastFiredAt'tan şimdiye kadar)
        itr = croniter(expr, start_time=start_local)
        expected_runs = []
        safety = 0
        while True:
            nxt = itr.get_next(datetime)
            if nxt > now_local:
                break
            expected_runs.append(nxt)
            safety += 1
            if safety > 1000:
                break
        
        if not expected_runs:
            continue
        
        # En sondan başlayarak ilk kaçırılmış run'u bul
        missed_run = None
        for expected_run in reversed(expected_runs):
            # Henüz çalıştırılmamış olabilir (cron scheduler henüz çalıştırmadı)
            if (now_local - expected_run).total_seconds() < NOW_TOLERANCE_SECONDS:
                continue
            
            run_key = f"{job_id}:{expected_run.astimezone(timezone.utc).isoformat()}"
            
            # Zaten recovery edilmiş mi?
            if run_key in recovered:
                break
            
            # Çok eski mi?
            if (now_local - expected_run).total_seconds() > MAX_AGE_HOURS * 3600:
                recovered[run_key] = now.isoformat()
                continue
            
            # Çalıştırılmış mı?
            if was_run_executed(job, expected_run, tz):
                recovered[run_key] = now.isoformat()
                break
            
            # Kaçırılmış!
            missed_run = expected_run
            recovered[run_key] = now.isoformat()
            break
        
        if missed_run:
            missed.append({
                "jobId": job_id,
                "jobName": job.get("name", "Unknown"),
                "expectedRunUtc": missed_run.astimezone(timezone.utc).isoformat(),
                "expectedRunLocal": missed_run.isoformat(),
                "lastFiredAt": job.get("lastFiredAt"),
                "reason": "Scheduled run was not executed (computer likely off)"
            })
    
    state["recovered"] = recovered
    state["lastCheck"] = now.isoformat()
    save_state(state)
    
    return missed


# ── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: py missed_task_recovery.py <jobs_json_file>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    jobs = data.get("jobs", [])
    missed = find_missed_jobs(jobs)
    
    output = {
        "checkedAt": datetime.now(timezone.utc).isoformat(),
        "missedCount": len(missed),
        "missedJobs": missed
    }
    
    print(json.dumps(output, indent=2, ensure_ascii=False))
