import { useEffect, useSyncExternalStore } from "react";
import { copy, type AppLanguage } from "@/lib/i18n";
import {
  parseReportHtml,
  type StoredReportRecord,
} from "../lib/parseReport";
import { compareStoredReports } from "../lib/reportGallery";

export interface UploadQueueItem {
  fileName: string;
  id: string;
  message: string;
  status: "error" | "parsing" | "saved";
  ticker: string;
}

interface ReportStoreState {
  error: string;
  hydrated: boolean;
  loading: boolean;
  reports: StoredReportRecord[];
  uploadQueue: UploadQueueItem[];
  uploading: boolean;
}

const DB_NAME = "gistify-flow-report-store";
const DB_VERSION = 1;
const STORE_NAME = "reports";

let state: ReportStoreState = {
  error: "",
  hydrated: false,
  loading: false,
  reports: [],
  uploadQueue: [],
  uploading: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(listener => listener());
}

function setState(partial: Partial<ReportStoreState>) {
  state = {
    ...state,
    ...partial,
  };
  emit();
}

function updateQueueItem(id: string, partial: Partial<UploadQueueItem>) {
  setState({
    uploadQueue: state.uploadQueue.map(item =>
      item.id === id ? { ...item, ...partial } : item
    ),
  });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function isIndexedDbAvailable() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!isIndexedDbAvailable()) {
      reject(new Error("IndexedDB unavailable"));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error || new Error("DB open failed"));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => Promise<T>
) {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const result = await executor(store);
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error || new Error("Transaction failed"));
      transaction.onabort = () =>
        reject(transaction.error || new Error("Transaction aborted"));
    });
    return result;
  } finally {
    database.close();
  }
}

function requestToPromise<T>(request: IDBRequest<T>) {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("IDB request failed"));
  });
}

async function readStoredReports() {
  return withStore("readonly", async store => {
    const records = await requestToPromise(store.getAll());
    return (Array.isArray(records) ? records : []) as StoredReportRecord[];
  });
}

async function persistStoredReport(record: StoredReportRecord) {
  await withStore("readwrite", async store => {
    await requestToPromise(store.put(record));
    return true;
  });
}

async function deleteStoredReport(id: string) {
  await withStore("readwrite", async store => {
    await requestToPromise(store.delete(id));
    return true;
  });
}

export async function hydrateReportStore(language: AppLanguage) {
  if (state.loading) {
    return;
  }

  setState({ error: "", loading: true });
  try {
    const reports = isIndexedDbAvailable() ? await readStoredReports() : [];
    setState({
      error: "",
      hydrated: true,
      loading: false,
      reports: [...reports].sort(compareStoredReports),
    });
  } catch (caughtError) {
    setState({
      error:
        caughtError instanceof Error
          ? caughtError.message
          : copy(
              language,
              "Yerel rapor arsivi yuklenemedi.",
              "Local report archive could not be loaded."
            ),
      hydrated: true,
      loading: false,
      reports: [],
    });
  }
}

export async function removeUploadedReport(
  id: string,
  language: AppLanguage
) {
  try {
    await deleteStoredReport(id);
    setState({
      reports: state.reports.filter(report => report.id !== id),
    });
  } catch (caughtError) {
    setState({
      error:
        caughtError instanceof Error
          ? caughtError.message
          : copy(
              language,
              "Rapor silinemedi.",
              "The report could not be deleted."
            ),
    });
  }
}

export async function uploadHtmlReports(
  files: File[],
  language: AppLanguage
) {
  const htmlFiles = files.filter(file => /\.html?$/i.test(file.name));
  const invalidFiles = files.filter(file => !/\.html?$/i.test(file.name));

  if (!htmlFiles.length && invalidFiles.length) {
    setState({
      error: copy(
        language,
        "Sadece .html dosyalari kabul edilir.",
        "Only .html files are accepted."
      ),
    });
    return;
  }

  if (!htmlFiles.length) {
    return;
  }

  const queueSeed = htmlFiles.map(file => ({
    fileName: file.name,
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: copy(language, "Parse ediliyor", "Parsing"),
    status: "parsing" as const,
    ticker: "",
  }));

  setState({
    error:
      invalidFiles.length > 0
        ? copy(
            language,
            `${invalidFiles.length} dosya atlandi. Sadece .html kabul edilir.`,
            `${invalidFiles.length} file(s) were skipped. Only .html is allowed.`
          )
        : "",
    uploadQueue: [...queueSeed, ...state.uploadQueue].slice(0, 18),
    uploading: true,
  });

  const fallbackDate = new Date().toISOString().slice(0, 10);

  for (let index = 0; index < htmlFiles.length; index += 1) {
    const file = htmlFiles[index];
    const queueItem = queueSeed[index];

    try {
      const html = await file.text();
      const parsed = parseReportHtml({
        fallbackDate,
        fileName: file.name,
        html,
      });
      const duplicate = state.reports.find(
        report =>
          report.sourceType === "upload" &&
          report.ticker === parsed.ticker &&
          report.reportDate === parsed.reportDate
      );

      let nextId = duplicate?.id || `upload:${parsed.ticker}:${parsed.reportDate}`;
      let duplicateOf: string | null = null;
      if (duplicate && typeof window !== "undefined") {
        const overwrite = window.confirm(
          copy(
            language,
            `${parsed.ticker} ${parsed.reportDate} icin kayit var. OK = uzerine yaz, Cancel = kopya tut.`,
            `A report already exists for ${parsed.ticker} ${parsed.reportDate}. OK = overwrite, Cancel = keep a duplicate.`
          )
        );

        if (!overwrite) {
          nextId = `upload:${parsed.ticker}:${parsed.reportDate}:${Date.now()}`;
          duplicateOf = duplicate.id;
        }
      }

      const record: StoredReportRecord = {
        ...parsed,
        duplicateOf,
        id: nextId,
        loadedAt: new Date().toISOString(),
        sourceLabel: file.name,
        sourceType: "upload",
        serverReportId: null,
      };

      await persistStoredReport(record);
      const nextReports = [
        ...state.reports.filter(report => report.id !== record.id),
        record,
      ].sort(compareStoredReports);
      setState({ reports: nextReports });

      updateQueueItem(queueItem.id, {
        message: copy(language, "Kaydedildi", "Saved"),
        status: "saved",
        ticker: record.ticker,
      });
    } catch (caughtError) {
      updateQueueItem(queueItem.id, {
        message:
          caughtError instanceof Error
            ? caughtError.message
            : copy(
                language,
                "Dosya parse edilemedi.",
                "The file could not be parsed."
              ),
        status: "error",
      });
    }
  }

  setState({ uploading: false });
}

export function clearUploadQueue() {
  setState({ uploadQueue: [] });
}

export function useReportStore(language: AppLanguage) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!state.hydrated && !state.loading) {
      void hydrateReportStore(language);
    }
  }, [language]);

  return {
    ...snapshot,
    clearUploadQueue,
    hydrate: () => hydrateReportStore(language),
    removeReport: (id: string) => removeUploadedReport(id, language),
    uploadFiles: (files: File[]) => uploadHtmlReports(files, language),
  };
}
