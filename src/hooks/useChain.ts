import { useCallback, useEffect, useRef, useState } from "react";
import type { Block } from "@/types";
import {
  buildHashInput,
  isValidHash,
  MAX_MINING_ITERATIONS,
  sha256,
} from "@/utils/hash";

const GENESIS_PREV_HASH = "0000000000000000";

/** Stable key from inputs that should trigger hash recomputation. */
function buildInputKey(blocks: Block[]): string {
  return blocks.map((b) => `${b.index}:${b.data}:${b.nonce}`).join("|");
}

function hashesMatch(current: Block[], next: Block[]): boolean {
  if (current.length !== next.length) return false;
  return next.every(
    (b, i) =>
      b.hash === current[i].hash && b.previousHash === current[i].previousHash,
  );
}

export function useChain(initialData: string[]) {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initialData.map((data, i) => ({
      index: i,
      data,
      nonce: 0,
      previousHash: i === 0 ? GENESIS_PREV_HASH : "",
      hash: "",
      mining: false,
    })),
  );
  const [miningError, setMiningError] = useState<string | null>(null);

  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;

  const recomputeToken = useRef(0);
  const inputKey = buildInputKey(blocks);

  useEffect(() => {
    // Mining owns nonce/hash updates until it finishes — avoid fighting the loop.
    if (blocksRef.current.some((b) => b.mining)) return;

    const snapshot = blocksRef.current;
    const token = ++recomputeToken.current;

    (async () => {
      try {
        const next: Block[] = [];
        let prevHash = GENESIS_PREV_HASH;

        for (const b of snapshot) {
          const previousHash = b.index === 0 ? GENESIS_PREV_HASH : prevHash;
          const hash = await sha256(
            buildHashInput(b.index, b.data, previousHash, b.nonce),
          );
          next.push({ ...b, previousHash, hash });
          prevHash = hash;
        }

        if (token !== recomputeToken.current) return;
        if (hashesMatch(snapshot, next)) return;

        setBlocks(next);
      } catch (e) {
        if (token !== recomputeToken.current) return;
        console.error("[useChain] hash recompute failed:", e);
        setMiningError(
          e instanceof Error
            ? e.message
            : "Hash computation failed. Try reloading the page.",
        );
      }
    })();
  }, [inputKey]);

  const stopMining = useCallback((index: number) => {
    setBlocks((prev) =>
      prev.map((b) => (b.index === index ? { ...b, mining: false } : b)),
    );
  }, []);

  const updateData = useCallback((index: number, data: string) => {
    setMiningError(null);
    setBlocks((prev) =>
      prev.map((b) => (b.index === index ? { ...b, data } : b)),
    );
  }, []);

  const mineBlock = useCallback(
    async (index: number): Promise<boolean> => {
      setMiningError(null);

      const startBlock = blocksRef.current.find((b) => b.index === index);
      if (!startBlock) {
        setMiningError("Block not found.");
        return false;
      }

      setBlocks((prev) =>
        prev.map((b) => (b.index === index ? { ...b, mining: true } : b)),
      );

      let nonce = startBlock.nonce;
      let hash = startBlock.hash;
      let found = false;

      try {
        while (nonce <= MAX_MINING_ITERATIONS) {
          const live = blocksRef.current.find((b) => b.index === index);
          if (!live) break;

          hash = await sha256(
            buildHashInput(live.index, live.data, live.previousHash, nonce),
          );
          if (isValidHash(hash)) {
            found = true;
            break;
          }
          nonce++;
          if (nonce % 500 === 0) {
            await new Promise((r) => setTimeout(r, 0));
            setBlocks((prev) =>
              prev.map((b) =>
                b.index === index ? { ...b, nonce, hash, mining: true } : b,
              ),
            );
          }
        }

        if (!found) {
          setMiningError(
            `No valid hash found within ${MAX_MINING_ITERATIONS.toLocaleString()} attempts. Try "Re-mine All" or refresh.`,
          );
          setBlocks((prev) =>
            prev.map((b) =>
              b.index === index ? { ...b, nonce, hash, mining: false } : b,
            ),
          );
          return false;
        }

        setBlocks((prev) =>
          prev.map((b) =>
            b.index === index ? { ...b, nonce, hash, mining: false } : b,
          ),
        );
        return true;
      } catch (e) {
        console.error("[useChain] mining failed:", e);
        setMiningError(
          e instanceof Error
            ? e.message
            : "Mining failed unexpectedly. Check the browser console.",
        );
        stopMining(index);
        return false;
      }
    },
    [stopMining],
  );

  const mineAll = useCallback(async () => {
    setMiningError(null);
    for (const b of blocksRef.current) {
      if (!isValidHash(b.hash)) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await mineBlock(b.index);
        if (!ok) break;
      }
    }
  }, [mineBlock]);

  const replaceBlocks = useCallback((nextBlocks: Block[]) => {
    setMiningError(null);
    setBlocks(
      nextBlocks.map((b) => ({
        ...b,
        mining: false,
      })),
    );
  }, []);

  const clearMiningError = useCallback(() => setMiningError(null), []);

  return {
    blocks,
    miningError,
    clearMiningError,
    updateData,
    mineBlock,
    mineAll,
    replaceBlocks,
  };
}
