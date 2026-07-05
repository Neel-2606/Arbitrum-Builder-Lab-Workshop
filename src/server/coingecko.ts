import type { Coin } from "@/types";
import { TRACKED_COIN_IDS } from "@/constants/coins";

const DEFAULT_BASE_URL = "https://api.coingecko.com/api/v3";

interface MarketsResponse {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

/** Map raw CoinGecko `/coins/markets` rows into our `Coin` shape. */
export function mapMarketsToCoins(
  data: MarketsResponse[],
  coinIds: readonly string[],
): Coin[] {
  const byId = new Map(data.map((c) => [c.id, c]));
  return coinIds
    .map((id) => byId.get(id))
    .filter((c): c is MarketsResponse => Boolean(c))
    .filter((c) => c.current_price != null && c.market_cap != null)
    .map((c) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      marketCap: c.market_cap,
      lastUpdated: new Date(c.last_updated).getTime(),
      sparkline: c.sparkline_in_7d?.price ?? [],
    }));
}

/**
 * Fetch prices + 7d sparkline from CoinGecko (server-side).
 * The `/coins/markets` endpoint returns everything in one call.
 */
export async function fetchCryptoPricesFromCoinGecko(
  coinIds: readonly string[] = TRACKED_COIN_IDS,
): Promise<Coin[]> {
  const baseUrl = process.env.COINGECKO_API_URL ?? DEFAULT_BASE_URL;
  const url = new URL(`${baseUrl}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("ids", coinIds.join(","));
  url.searchParams.set("sparkline", "true");
  url.searchParams.set("price_change_percentage", "24h");
  url.searchParams.set("order", "market_cap_desc");

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });

  if (res.status === 429) {
    throw new CoinGeckoRateLimitError();
  }
  if (!res.ok) {
    throw new CoinGeckoFetchError(res.status);
  }

  const data = (await res.json()) as MarketsResponse[];
  return mapMarketsToCoins(data, coinIds);
}

export class CoinGeckoRateLimitError extends Error {
  code = "RATE_LIMITED" as const;
  constructor() {
    super("CoinGecko is rate-limiting us right now. Please try again in a minute.");
    this.name = "CoinGeckoRateLimitError";
  }
}

export class CoinGeckoFetchError extends Error {
  code = "UPSTREAM_ERROR" as const;
  constructor(public status: number) {
    super(`Failed to load prices (HTTP ${status})`);
    this.name = "CoinGeckoFetchError";
  }
}
