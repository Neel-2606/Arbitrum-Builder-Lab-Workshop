import { describe, expect, it, beforeEach } from "vitest";
import { cacheRemainingTtl, clearCache, getCached, setCache } from "./cache";

describe("cache", () => {
  beforeEach(() => clearCache());

  it("returns null for missing keys", () => {
    expect(getCached("missing")).toBeNull();
  });

  it("stores and retrieves values within TTL", () => {
    setCache("prices", [{ id: "btc" }], 30_000);
    expect(getCached("prices")).toEqual([{ id: "btc" }]);
    expect(cacheRemainingTtl("prices")).toBeGreaterThan(0);
  });

  it("expires entries after TTL", async () => {
    setCache("short", "value", 10);
    await new Promise((r) => setTimeout(r, 20));
    expect(getCached("short")).toBeNull();
  });
});
