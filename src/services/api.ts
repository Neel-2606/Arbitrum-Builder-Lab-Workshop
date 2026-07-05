import type { Coin } from "@/types";
import { TRACKED_COIN_IDS } from "@/constants/coins";

export { TRACKED_COIN_IDS };

interface ApiErrorBody {
  error?: { message?: string; code?: string };
}

/**
 * Fetch normalized crypto prices via our server proxy (`GET /api/prices`).
 * CoinGecko is called server-side with a 30s TTL cache.
 */
export async function getCryptoPrices(
  coinIds: readonly string[] = TRACKED_COIN_IDS,
): Promise<Coin[]> {
  let path = "/api/prices";
  const isDefault =
    coinIds.length === TRACKED_COIN_IDS.length &&
    coinIds.every((id, i) => id === TRACKED_COIN_IDS[i]);
  if (!isDefault && coinIds.length > 0) {
    path += `?ids=${encodeURIComponent(coinIds.join(","))}`;
  }

  const res = await fetch(path, {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    let message = `Failed to load prices (HTTP ${res.status})`;
    try {
      const body = (await res.json()) as ApiErrorBody;
      if (body.error?.message) message = body.error.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  return (await res.json()) as Coin[];
}
