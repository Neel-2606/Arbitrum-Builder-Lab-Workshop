import { createFileRoute } from "@tanstack/react-router";
import { TRACKED_COIN_IDS } from "@/constants/coins";
import { apiError } from "@/server/api-error";
import { getCached, setCache } from "@/server/cache";
import {
  CoinGeckoFetchError,
  CoinGeckoRateLimitError,
  fetchCryptoPricesFromCoinGecko,
} from "@/server/coingecko";
import { coinsResponseSchema } from "@/server/schemas";

const CACHE_KEY = "prices:default";
const CACHE_TTL_MS = 30_000;

export const Route = createFileRoute("/api/prices")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const idsParam = url.searchParams.get("ids");
        const coinIds = idsParam
          ? idsParam.split(",").map((id) => id.trim()).filter(Boolean)
          : [...TRACKED_COIN_IDS];

        const cacheKey = idsParam ? `prices:${coinIds.join(",")}` : CACHE_KEY;
        const cached = getCached<unknown>(cacheKey);
        if (cached) {
          const parsed = coinsResponseSchema.safeParse(cached);
          if (parsed.success) {
            return Response.json(parsed.data, {
              headers: {
                "Cache-Control": "public, max-age=30",
                "X-Cache": "HIT",
              },
            });
          }
        }

        try {
          const coins = await fetchCryptoPricesFromCoinGecko(coinIds);
          const validated = coinsResponseSchema.parse(coins);
          setCache(cacheKey, validated, CACHE_TTL_MS);
          return Response.json(validated, {
            headers: {
              "Cache-Control": "public, max-age=30",
              "X-Cache": "MISS",
            },
          });
        } catch (e) {
          if (e instanceof CoinGeckoRateLimitError) {
            return apiError(e.message, e.code, 429);
          }
          if (e instanceof CoinGeckoFetchError) {
            return apiError(e.message, e.code, 502);
          }
          console.error("[/api/prices]", e);
          return apiError("Failed to load prices.", "INTERNAL_ERROR", 500);
        }
      },
    },
  },
});
