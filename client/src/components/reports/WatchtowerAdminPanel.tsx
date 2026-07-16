import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import type {
  WatchtowerLanguage,
  WatchtowerReportRecord,
  WatchtowerReportsResponse,
  WatchtowerSection,
} from "@shared/watchtower";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AppLanguage } from "@/lib/i18n";
import { toast } from "sonner";

async function readPayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as WatchtowerReportsResponse & {
    error?: string;
  };
  if (!response.ok) throw new Error(payload.error || "Watchtower işlemi başarısız oldu.");
  return payload;
}

function cloneReport(report: WatchtowerReportRecord | null) {
  return report ? structuredClone(report) : null;
}

export default function WatchtowerAdminPanel({
  adminSecret,
  language,
}: {
  adminSecret: string;
  language: AppLanguage;
}) {
  const [reports, setReports] = useState<WatchtowerReportRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState<WatchtowerReportRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isEnglish = language === "en";
  const headers = {
    "Content-Type": "application/json",
    ...(adminSecret.trim() ? { "x-gistify-admin-secret": adminSecret.trim() } : {}),
  };

  const sync = useCallback((next: WatchtowerReportRecord[], preferredId?: string) => {
    setReports(next);
    const target = next.find(item => item.id === preferredId) || next[0] || null;
    setSelectedId(target?.id || "");
    setDraft(cloneReport(target));
  }, []);

  const load = useCallback(async (preferredId?: string) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/watchtower", {
        credentials: "include",
        cache: "no-store",
        headers,
      });
      const payload = await readPayload(response);
      sync(payload.reports || [], preferredId);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Watchtower yüklenemedi.");
    } finally {
      setBusy(false);
    }
  }, [adminSecret, sync]);

  useEffect(() => {
    void load();
  }, [load]);

  const generate = async (reportLanguage: WatchtowerLanguage) => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/watchtower/generate", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({ language: reportLanguage }),
      });
      const payload = await readPayload(response);
      sync(payload.reports || [], payload.report?.id);
      toast.success(reportLanguage === "tr" ? "Türkçe taslak üretildi." : "English draft generated.");
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Taslak üretilemedi.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/watchtower/${encodeURIComponent(draft.id)}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({ report: draft }),
      });
      const payload = await readPayload(response);
      sync(payload.reports || [], payload.report?.id);
      toast.success(isEnglish ? "Draft saved." : "Taslak kaydedildi.");
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Taslak kaydedilemedi.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!draft || !window.confirm(isEnglish ? "Publish this editor-approved Watchtower?" : "Editör onaylı bu Watchtower yayınlansın mı?")) return;
    setBusy(true);
    try {
      const saveResponse = await fetch(`/api/admin/watchtower/${encodeURIComponent(draft.id)}`, {
        method: "PATCH",
        credentials: "include",
        headers,
        body: JSON.stringify({ report: draft }),
      });
      await readPayload(saveResponse);
      const response = await fetch(`/api/admin/watchtower/${encodeURIComponent(draft.id)}/publish`, {
        method: "POST",
        credentials: "include",
        headers,
      });
      const payload = await readPayload(response);
      sync(payload.reports || [], payload.report?.id);
      toast.success(isEnglish ? "Watchtower published." : "Watchtower yayınlandı.");
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Yayın başarısız.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const updateEntry = (section: WatchtowerSection, index: number, thesis: string) => {
    setDraft(current => {
      if (!current) return current;
      const items = current.content[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, thesis } : item
      );
      return { ...current, content: { ...current.content, [section]: items } };
    });
  };

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card/95 p-6 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">Watchtower editor gate</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Midas’tan taslak, editörden yayın</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">Sistem yalnız kaynak snapshot’taki ölçümleri kullanır. Otomatik içerik taslak kalır; public alana geçmesi için burada açık editör onayı gerekir.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void load(selectedId)} disabled={busy}><RefreshCw className="size-4" />Yenile</Button>
          <Button variant="outline" onClick={() => void generate("tr")} disabled={busy}><Sparkles className="size-4" />TR taslak</Button>
          <Button variant="outline" onClick={() => void generate("en")} disabled={busy}><Sparkles className="size-4" />EN draft</Button>
        </div>
      </div>

      {error ? <p className="rounded-lg border border-rose-500/25 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p> : null}
      {busy ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />İşleniyor…</div> : null}

      <select value={selectedId} onChange={event => { const report = reports.find(item => item.id === event.target.value) || null; setSelectedId(event.target.value); setDraft(cloneReport(report)); }} className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground">
        <option value="">Kayıt seçin</option>
        {reports.map(report => <option key={report.id} value={report.id}>{report.reportDate} · {report.language.toUpperCase()} · {report.status}</option>)}
      </select>

      {draft ? (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <Input value={draft.title} disabled={draft.status === "published"} onChange={event => setDraft(current => current ? { ...current, title: event.target.value } : current)} />
            <span className={`inline-flex h-10 items-center rounded-md border px-3 text-xs font-semibold uppercase ${draft.status === "published" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-200"}`}>{draft.status}</span>
          </div>
          <Textarea rows={5} value={draft.content.summary} disabled={draft.status === "published"} onChange={event => setDraft(current => current ? { ...current, content: { ...current.content, summary: event.target.value } } : current)} />
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Kaynak zamanı</p><p className="mt-1 text-sm text-foreground">{draft.content.sourceTimestamp}</p></div>
            <div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Evren</p><p className="mt-1 text-sm text-foreground">{draft.content.universeCount}</p></div>
            <div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Lider / Risk / İzle</p><p className="mt-1 text-sm text-foreground">{draft.content.leaders.length} / {draft.content.risks.length} / {draft.content.watch.length}</p></div>
            <div className="rounded-lg border border-border p-3"><p className="text-xs text-muted-foreground">Versiyon</p><p className="mt-1 text-sm text-foreground">{draft.content.sourceVersion || "-"}</p></div>
          </div>

          {(["leaders", "risks", "watch"] as WatchtowerSection[]).map(section => (
            <div key={section} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{section}</h3>
              {draft.content[section].map((entry, index) => (
                <div key={entry.symbol} className="grid gap-3 rounded-lg border border-border bg-background/50 p-3 md:grid-cols-[120px_1fr]">
                  <div><p className="font-semibold text-foreground">{entry.symbol}</p><p className="text-xs text-muted-foreground">{entry.signal} · {Math.round(entry.conviction)}/100</p></div>
                  <Textarea rows={3} value={entry.thesis} disabled={draft.status === "published"} onChange={event => updateEntry(section, index, event.target.value)} />
                </div>
              ))}
            </div>
          ))}

          <Textarea rows={3} value={draft.content.methodology} disabled={draft.status === "published"} onChange={event => setDraft(current => current ? { ...current, content: { ...current.content, methodology: event.target.value } } : current)} />
          {draft.status === "draft" ? <div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={() => void save()} disabled={busy}><Save className="size-4" />Taslağı kaydet</Button><Button onClick={() => void publish()} disabled={busy}><CheckCircle2 className="size-4" />Onayla ve yayınla</Button></div> : null}
        </div>
      ) : <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Henüz Watchtower kaydı yok. Güncel Midas snapshot’ından TR veya EN taslak üretin.</p>}
    </section>
  );
}
