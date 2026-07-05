import { createFileRoute } from "@tanstack/react-router";
import { Info, Pickaxe } from "lucide-react";
import { Badge } from "@/components/uikit/Badge";
import { Button } from "@/components/uikit/Button";
import { SectionHeading } from "@/components/uikit/SectionHeading";
import { Block } from "@/components/simulator/Block";
import { ChainConnector } from "@/components/simulator/ChainConnector";
import { HowItWorks } from "@/components/simulator/HowItWorks";
import { SavedChainsPanel } from "@/components/simulator/SavedChainsPanel";
import { useChain } from "@/hooks/useChain";
import { isValidHash } from "@/utils/hash";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Block Simulator — ChainLens" },
      { name: "description", content: "Interactive proof-of-work simulator. Mine blocks, tamper with data, watch the chain break." },
      { property: "og:title", content: "Block Simulator — ChainLens" },
      { property: "og:description", content: "SHA-256, nonces, and immutability — hands-on in your browser." },
    ],
  }),
  component: Simulator,
});

function Simulator() {
  const {
    blocks,
    miningError,
    clearMiningError,
    updateData,
    mineBlock,
    mineAll,
    replaceBlocks,
  } = useChain([
    "Genesis Block",
    "Alice sends Bob 10 ARB",
    "Bob sends Carol 3 ARB",
  ]);

  // A block's chain-link is "broken" when its stored previousHash no longer
  // equals the previous block's actual hash. Because our hook keeps them in
  // sync automatically, we detect breakage by the previous block being invalid.
  const isChainBroken = (i: number) => i > 0 && !isValidHash(blocks[i - 1].hash);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow="Proof of Work · SHA-256"
        title="Block Simulator"
        subtitle="Mine blocks, then tamper with old data and watch the whole chain break. This is immutability in action."
      />

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Badge tone="brand">
          <Info size={12} /> Difficulty: hash must start with "00"
        </Badge>
        <Button variant="secondary" size="sm" leading={<Pickaxe size={14} />} onClick={mineAll}>
          Re-mine All
        </Button>
      </div>

      {miningError && (
        <div
          role="alert"
          className="mx-auto mt-6 max-w-3xl rounded-2xl border border-err/40 bg-err/10 px-5 py-4 text-sm text-err"
        >
          <p>{miningError}</p>
          <button
            type="button"
            onClick={clearMiningError}
            className="mt-2 text-xs font-medium underline underline-offset-2 hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-brand/30 bg-brand/5 p-5 text-sm text-ink">
        🔗 <strong>Try this:</strong> mine every block, then edit Block #1's data.
        Watch Block #1 turn red — and Block #2 follow, because its{" "}
        <span className="font-mono text-brand">previousHash</span> no longer matches.
        Altering past data invalidates every block after it.
      </div>

      <div className="mt-12 flex flex-col items-stretch gap-6 lg:flex-row lg:items-stretch">
        {blocks.map((b, i) => (
          <div key={b.index} className="flex flex-1 flex-col lg:flex-row lg:items-stretch">
            <div className="flex-1">
              <Block
                block={b}
                onDataChange={(d) => updateData(b.index, d)}
                onMine={() => mineBlock(b.index)}
                chainBroken={isChainBroken(i)}
              />
            </div>
            {i < blocks.length - 1 && (
              <ChainConnector broken={!isValidHash(b.hash)} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <HowItWorks />
      </div>

      <SavedChainsPanel blocks={blocks} onLoad={replaceBlocks} />
    </section>
  );
}
