import { describe, expect, it } from "vitest";
import { mapMarketsToCoins } from "@/server/coingecko";

describe("mapMarketsToCoins", () => {
  it("maps CoinGecko rows and preserves coin order", () => {
    const result = mapMarketsToCoins(
      [
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          image: "https://example.com/eth.png",
          current_price: 3000,
          market_cap: 1e11,
          price_change_percentage_24h: 2.5,
          last_updated: "2026-01-01T00:00:00.000Z",
          sparkline_in_7d: { price: [1, 2, 3] },
        },
      ],
      ["ethereum", "bitcoin"],
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      price: 3000,
      change24h: 2.5,
      sparkline: [1, 2, 3],
    });
  });
});
