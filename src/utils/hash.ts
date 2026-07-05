import { sha256 as jsSha256 } from "js-sha256";

let loggedCryptoAvailability = false;

function logCryptoAvailability(): void {
  if (loggedCryptoAvailability) return;
  loggedCryptoAvailability = true;
  console.debug("[hash] typeof crypto?.subtle:", typeof globalThis.crypto?.subtle);
}

/** True when Web Crypto subtle is available (https:// or localhost only). */
export function hasWebCryptoSubtle(): boolean {
  return typeof globalThis.crypto?.subtle?.digest === "function";
}

/**
 * SHA-256 hex digest for block hashing.
 * Uses Web Crypto when available; falls back to js-sha256 on non-secure origins
 * (e.g. http://192.168.x.x) where crypto.subtle is undefined.
 */
export async function sha256(input: string): Promise<string> {
  logCryptoAvailability();

  if (hasWebCryptoSubtle()) {
    const bytes = new TextEncoder().encode(input);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  return jsSha256(input);
}

// Difficulty target for the demo: hash must start with "00".
export const DIFFICULTY_PREFIX = "00";

export const MAX_MINING_ITERATIONS = 5_000_000;

export function isValidHash(hash: string): boolean {
  return hash.startsWith(DIFFICULTY_PREFIX);
}

export function buildHashInput(
  index: number,
  data: string,
  previousHash: string,
  nonce: number,
): string {
  return `${index}${data}${previousHash}${nonce}`;
}
