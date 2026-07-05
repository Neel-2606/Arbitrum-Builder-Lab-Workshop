import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TRACKED_COIN_IDS } from "@/constants/coins";
import { getCryptoPrices } from "@/services/api";
import {
  addWatchlistCoin,
  fetchWatchlist,
  removeWatchlistCoin,
} from "@/services/watchlist";
import { queryKeys } from "@/lib/query-keys";

const STALE_TIME = 30_000;

export function useCryptoPricesQuery(coinIds: readonly string[] = TRACKED_COIN_IDS) {
  return useQuery({
    queryKey: queryKeys.prices(coinIds),
    queryFn: () => getCryptoPrices(coinIds),
    staleTime: STALE_TIME,
    refetchInterval: false,
  });
}

export function useWatchlistQuery() {
  return useQuery({
    queryKey: queryKeys.watchlist,
    queryFn: fetchWatchlist,
    staleTime: 60_000,
    placeholderData: [...TRACKED_COIN_IDS],
  });
}

export function useWatchlistMutations() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addWatchlistCoin,
    onMutate: async (coinId) => {
      await qc.cancelQueries({ queryKey: queryKeys.watchlist });
      const prev = qc.getQueryData<string[]>(queryKeys.watchlist) ?? [...TRACKED_COIN_IDS];
      if (!prev.includes(coinId)) {
        qc.setQueryData(queryKeys.watchlist, [...prev, coinId]);
      }
      return { prev };
    },
    onError: (_e, _coinId, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.watchlist, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.watchlist }),
  });

  const remove = useMutation({
    mutationFn: removeWatchlistCoin,
    onMutate: async (coinId) => {
      await qc.cancelQueries({ queryKey: queryKeys.watchlist });
      const prev = qc.getQueryData<string[]>(queryKeys.watchlist) ?? [...TRACKED_COIN_IDS];
      qc.setQueryData(
        queryKeys.watchlist,
        prev.filter((id) => id !== coinId),
      );
      return { prev };
    },
    onError: (_e, _coinId, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKeys.watchlist, ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.watchlist }),
  });

  return { add, remove };
}
