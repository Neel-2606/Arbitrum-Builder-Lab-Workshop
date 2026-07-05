import { motion } from "framer-motion";
import { Zap, Wallet, ShieldCheck, Code2 } from "lucide-react";
import { Card } from "@/components/uikit/Card";
import { SectionHeading } from "@/components/uikit/SectionHeading";

const features = [
  { icon: Zap, title: "Blazing Fast", body: "Near-instant transaction confirmations — no more waiting minutes for finality." },
  { icon: Wallet, title: "Ultra-Low Fees", body: "Pay a small fraction of Ethereum mainnet gas costs. Micro-transactions become viable." },
  { icon: ShieldCheck, title: "Ethereum-Grade Security", body: "Inherits mainnet's battle-tested security through fraud proofs." },
  { icon: Code2, title: "EVM Compatible", body: "Deploy existing Ethereum smart contracts as-is. Same Solidity, same tooling." },
];

export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow="The Payoff"
        title="Why Build on Arbitrum?"
        subtitle="Four reasons developers and users are moving to Layer 2."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Card glow="brand" interactive className="h-full">
              <div className="inline-flex rounded-xl bg-elevated p-3 text-cyan ring-1 ring-cyan/30">
                <f.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-mute leading-relaxed">{f.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
