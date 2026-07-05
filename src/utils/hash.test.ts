import { describe, expect, it, vi, afterEach } from "vitest";
import { buildHashInput, hasWebCryptoSubtle, isValidHash, sha256 } from "./hash";

describe("hash", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sha256 produces a 64-char hex digest", async () => {
    const hash = await sha256("test");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("falls back to js-sha256 when crypto.subtle is unavailable", async () => {
    vi.stubGlobal("crypto", { subtle: undefined });
    const hash = await sha256("test");
    expect(hasWebCryptoSubtle()).toBe(false);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).toBe(
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    );
  });

  it("isValidHash accepts hashes starting with 00", () => {
    expect(isValidHash("00abc")).toBe(true);
    expect(isValidHash("01abc")).toBe(false);
  });

  it("buildHashInput concatenates block fields", () => {
    expect(buildHashInput(1, "data", "prev", 42)).toBe("1dataprev42");
  });
});
