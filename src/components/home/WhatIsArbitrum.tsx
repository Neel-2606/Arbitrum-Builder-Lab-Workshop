import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Badge } from "@/components/uikit/Badge";

export function WhatIsArbitrum() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div>
          <Badge tone="violet" className="mb-4">What is Arbitrum?</Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
            An <span className="text-gradient">Optimistic Rollup</span> built on Ethereum.
          </h2>
          <p className="mt-6 text-base md:text-lg text-mute leading-relaxed">
            Arbitrum bundles — or <em className="text-ink not-italic font-medium">rolls up</em> — many
            transactions off-chain, then posts a single compressed proof back to Ethereum
            mainnet. The result: Ethereum-level security, dramatically lower fees, and
            confirmations in seconds instead of minutes.
          </p>
          <p className="mt-4 text-base text-mute leading-relaxed">
            Because it's fully EVM-compatible, any smart contract that runs on Ethereum
            runs on Arbitrum — no rewrites, no compromises.
          </p>
        </div>

        <RollupDiagram />
      </div>
    </section>
  );
}

function RollupDiagram() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-3xl bg-gradient-brand opacity-10 blur-3xl" aria-hidden />
      <div className="relative rounded-3xl border border-hairline bg-surface p-8">
        {/* User transactions */}
        <p className="text-xs uppercase tracking-widest text-dim">User Transactions</p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="h-6 rounded-md bg-elevated ring-1 ring-hairline"
            />
          ))}
        </div>

        <div className="my-6 flex justify-center text-brand">
          <ArrowDown size={20} />
        </div>

        {/* Arbitrum rollup */}
        <div className="rounded-xl border border-brand/40 bg-brand/5 p-4">
          <p className="text-xs uppercase tracking-widest text-brand">Arbitrum L2 · Rollup</p>
          <p className="mt-2 font-mono text-sm text-ink">
            batch: 0x7f...a4 <span className="text-dim">(12 txs)</span>
          </p>
          <p className="mt-1 text-xs text-mute">Executed off-chain · compressed into one proof</p>
        </div>

        <div className="my-6 flex justify-center text-violet">
          <ArrowDown size={20} />
        </div>

        {/* Ethereum settlement */}
        <div className="rounded-xl border border-violet/40 bg-violet/5 p-4">
          <p className="text-xs uppercase tracking-widest text-violet">Ethereum L1 · Settlement</p>
          <p className="mt-2 font-mono text-sm text-ink">block #21,047,832 ✓</p>
          <p className="mt-1 text-xs text-mute">Secured by Ethereum consensus</p>
        </div>
      </div>
    </div>
  );
}
