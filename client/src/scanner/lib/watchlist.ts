/**
 * İzleme Listesi (Favoriler) - localStorage
 */

const STORAGE_KEY = "nmscanner_watchlist";

export function getWatchlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchlist(ticker: string) {
  const list = getWatchlist();
  if (!list.includes(ticker)) {
    list.push(ticker);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function removeFromWatchlist(ticker: string) {
  const list = getWatchlist().filter((t) => t !== ticker);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function isInWatchlist(ticker: string): boolean {
  return getWatchlist().includes(ticker);
}
