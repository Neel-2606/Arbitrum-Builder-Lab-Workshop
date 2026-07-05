import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Card } from "@/components/uikit/Card";
import { cn } from "@/lib/utils";
import type { Concept, ConceptSide } from "@/types";

const tones: Record<ConceptSide["tone"], { header: string; icon: string; ring: string; label: string }> = {
  muted:  { header: "from-dim/20 to-hairline",       icon: "text-mute",  ring: "ring-hairline",       label: "text-mute" },
  brand:  { header: "from-brand/30 to-violet/20",    icon: "text-brand", ring: "ring-brand/40",       label: "text-brand" },
  cyan:   { header: "from-cyan/30 to-brand/10",      icon: "text-cyan",  ring: "ring-cyan/40",        label: "text-cyan" },
  danger: { header: "from-err/30 to-err/5",          icon: "text-err",   ring: "ring-err/40",         label: "text-err" },
  orange: { header: "from-warn/30 to-warn/5",        icon: "text-warn",  ring: "ring-warn/40",        label: "text-warn" },
};

function Side({ side }: { side: ConceptSide }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[side.icon] ?? Icons.Circle;
  const t = tones[side.tone];
  return (
    <div className={cn("flex-1 rounded-2xl border border-hairline bg-surface ring-1", t.ring)}>
      <div className={cn("rounded-t-2xl bg-gradient-to-br p-5 flex items-center gap-3", t.header)}>
        <span className={cn("grid h-10 w-10 place-items-center rounded-lg bg-base/60", t.icon)}>
          <Icon size={20} />
        </span>
        <h3 className={cn("font-display text-xl font-bold", t.label)}>{side.title}</h3>
      </div>
      <ul className="p-5 space-y-3">
        {side.bullets.map((b, i) => (
          <li key={i} className="flex gap-3 text-sm text-mute leading-relaxed">
            <span className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", t.label.replace("text-", "bg-"))} />
            <span className="text-ink/90">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ComparisonCard({ concept, index }: { concept: Concept; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <Card interactive glow="brand" className="p-4 md:p-6">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gradient">
          {concept.eyebrow}
        </p>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-stretch">
          <Side side={concept.left} />
          <div className="flex items-center justify-center md:absolute md:left-1/2 md:top-1/2 md:z-10 md:-translate-x-1/2 md:-translate-y-1/2">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-base ring-2 ring-hairline font-display font-bold text-mute">
              VS
            </span>
          </div>
          <Side side={concept.right} />
        </div>
        <p className="sr-only">Comparison {index + 1}</p>
      </Card>
    </motion.div>
  );
}
