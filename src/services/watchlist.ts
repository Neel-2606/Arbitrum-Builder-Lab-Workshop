import { apiFetch, parseApiError } from "@/lib/api-client";
import { TRACKED_COIN_IDS } from "@/constants/coins";

export async function fetchWatchlist(): Promise<string[]> {
  const res = await apiFetch("/api/watchlist");
  if (res.status === 503 || res.status === 401) return [...TRACKED_COIN_IDS];
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to load watchlist."));
  const body = (await res.json()) as { coinIds: string[] };
  return body.coinIds.length > 0 ? body.coinIds : [...TRACKED_COIN_IDS];
}

export async function addWatchlistCoin(coinId: string): Promise<string[]> {
  const res = await apiFetch("/api/watchlist", {
    method: "POST",
    body: JSON.stringify({ coinId }),
  });
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to add coin."));
  const body = (await res.json()) as { coinIds: string[] };
  return body.coinIds;
}

export async function removeWatchlistCoin(coinId: string): Promise<string[]> {
  const res = await apiFetch(`/api/watchlist/${coinId}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to remove coin."));
  const body = (await res.json()) as { coinIds: string[] };
  return body.coinIds;
}
