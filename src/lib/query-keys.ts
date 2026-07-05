export const queryKeys = {
  prices: (coinIds: readonly string[]) => ["prices", ...coinIds] as const,
  watchlist: ["watchlist"] as const,
  chains: ["chains"] as const,
  chain: (id: string) => ["chains", id] as const,
  health: ["health"] as const,
};
