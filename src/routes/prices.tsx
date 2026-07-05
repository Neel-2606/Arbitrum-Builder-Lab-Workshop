import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw, Search } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/uikit/Button";
import { ErrorState } from "@/components/uikit/ErrorState";
import { SectionHeading } from "@/components/uikit/SectionHeading";
import { PriceCard } from "@/components/prices/PriceCard";
import { SkeletonCard } from "@/components/prices/SkeletonCard";
import {
  useCryptoPricesQuery,
  useWatchlistMutations,
  useWatchlistQuery,
} from "@/hooks/usePricesQuery";
import { queryKeys } from "@/lib/query-keys";
import { TRACKED_COIN_IDS } from "@/constants/coins";
import { getCryptoPrices } from "@/services/api";
import { fetchWatchlist } from "@/services/watchlist";
import { formatTime } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Live Prices — ChainLens" },
      {
        name: "description",
        content: "Real-time crypto prices for Bitcoin, Ethereum, Solana, Arbitrum and Polygon.",
      },
      { property: "og:title", content: "Live Crypto Prices — ChainLens" },
      {
        property: "og:description",
        content: "Powered by CoinGecko. 24h change, sparklines, market cap.",
      },
    ],
  }),
  loader: async ({ context }) => {
    const coinIds = [...TRACKED_COIN_IDS];
    await context.queryClient.prefetchQuery({
      queryKey: queryKeys.prices(coinIds),
      queryFn: () => getCryptoPrices(coinIds),
      staleTime: 30_000,
    });
    await context.queryClient.prefetchQuery({
      queryKey: queryKeys.watchlist,
      queryFn: fetchWatchlist,
      staleTime: 60_000,
    });
  },
  errorComponent: PricesError,
  component: Prices,
});

function PricesError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8">
      <ErrorState
        message={error.message || "Could not load market data."}
        onRetry={reset}
      />
    </section>
  );
}

function Prices() {
  const { data: watchlist = [...TRACKED_COIN_IDS] } = useWatchlistQuery();
  const { add, remove } = useWatchlistMutations();
  const {
    data: coins = [],
    isLoading,
    isFetching,
    error,
    refetch,
    dataUpdatedAt,
  } = useCryptoPricesQuery(watchlist);

  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => refetch(), 30_000);
    return () => clearInterval(id);
  }, [autoRefresh, refetch]);

  const filtered = useMemo(
    () =>
      coins.filter((c) =>
        (c.name + c.symbol).toLowerCase().includes(deferredQuery.trim().toLowerCase()),
      ),
    [coins, deferredQuery],
  );

  const watchSet = useMemo(() => new Set(watchlist), [watchlist]);

  const toggleWatch = (coinId: string) => {
    if (watchSet.has(coinId)) {
      remove.mutate(coinId);
    } else {
      add.mutate(coinId);
    }
  };

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          align="left"
          eyebrow="Market Data"
          title="Live Crypto Prices"
          subtitle="Real-time market data via our cached server proxy."
        />
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-mute">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-hairline accent-[color:var(--brand)]"
            />
            Auto-refresh (30s)
          </label>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching || isLoading}
            leading={<RefreshCw size={14} className={cn(isFetching && "animate-spin")} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-dim font-mono">
          Last updated: {formatTime(dataUpdatedAt || null)}
          {query !== deferredQuery && (
            <span className="ml-2 text-brand" aria-live="polite">
              Searching…
            </span>
          )}
        </p>
        <div className="relative w-full max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-dim"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coin…"
            aria-label="Search coins"
            className="w-full rounded-lg border border-hairline bg-surface pl-9 pr-3 py-2 text-sm text-ink outline-none placeholder:text-dim focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="mt-10">
        {error ? (
          <ErrorState
            message={error instanceof Error ? error.message : "Something went wrong."}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-mute py-10">No coins matched &quot;{deferredQuery}&quot;.</p>
        ) : (
          <div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
            aria-label={`${filtered.length} cryptocurrencies`}
          >
            {filtered.map((c) => (
              <PriceCard
                key={c.id}
                coin={c}
                watched={watchSet.has(c.id)}
                onToggleWatch={toggleWatch}
                watchLoading={add.isPending || remove.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
