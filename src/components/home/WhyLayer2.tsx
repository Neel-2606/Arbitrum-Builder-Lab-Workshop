import { motion } from "framer-motion";
import { Gauge, Flame, ShieldCheck } from "lucide-react";
import { Card } from "@/components/uikit/Card";
import { SectionHeading } from "@/components/uikit/SectionHeading";

const items = [
  {
    icon: Gauge,
    title: "The Congestion Problem",
    body: "Ethereum mainnet can only process ~15 transactions per second. During peak demand, confirmations slow to a crawl and everyone competes for block space.",
  },
  {
    icon: Flame,
    title: "Sky-High Gas Fees",
    body: "Popular apps have pushed fees past $50 per transaction. That's fine for whales, brutal for a $20 swap — and it prices everyday users out of Web3.",
  },
  {
    icon: ShieldCheck,
    title: "Scaling Without Compromise",
    body: "Layer 2s process transactions off-chain and settle proofs back to Ethereum. You keep mainnet's security, but gain speed and dramatically lower cost.",
  },
];

export function WhyLayer2() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <SectionHeading
        eyebrow="The Problem"
        title="Why Ethereum Needed Layer 2"
        subtitle="Ethereum is secure and decentralized — but at scale it hit real limits. Here's what Layer 2 was invented to solve."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card glow="brand" interactive className="h-full">
              <div className="inline-flex rounded-xl bg-gradient-brand/10 p-3 text-brand ring-1 ring-brand/30">
                <it.icon size={22} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{it.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
