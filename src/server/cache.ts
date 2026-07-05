/** Simple in-memory TTL cache for server routes (per-worker instance). */
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number): void {
  store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(key?: string): void {
  if (key) store.delete(key);
  else store.clear();
}

/** Exported for unit tests — remaining TTL in ms, or null if missing/expired. */
export function cacheRemainingTtl(key: string): number | null {
  const entry = store.get(key);
  if (!entry) return null;
  const remaining = entry.expiresAt - Date.now();
  return remaining > 0 ? remaining : null;
}
