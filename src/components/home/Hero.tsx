import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Blocks as BlocksIcon, LineChart } from "lucide-react";
import { Badge } from "@/components/uikit/Badge";
import { Button } from "@/components/uikit/Button";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const motionProps = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7 } };

  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 pointer-events-none" aria-hidden />
      <div className="relative mx-auto flex min-h-[90vh] max-w-[1200px] flex-col items-center justify-center px-4 py-24 text-center md:px-8">
        <Badge tone="brand" className="mb-6">
          <Sparkles size={12} aria-hidden /> Layer 2 Scaling, Explained
        </Badge>

        <motion.h1
          {...motionProps}
          className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Understand Blockchain,{" "}
          <span className="text-gradient">Beyond the Hype.</span>
        </motion.h1>

        <motion.p
          {...(reduceMotion
            ? motionProps
            : { ...motionProps, transition: { duration: 0.7, delay: 0.15 } })}
          className="mt-6 max-w-2xl text-base text-mute md:text-lg leading-relaxed"
        >
          ChainLens is your interactive guide to Web3 fundamentals and Arbitrum — the
          Layer 2 that makes Ethereum fast, cheap, and scalable.
        </motion.p>

        <motion.div
          {...(reduceMotion
            ? motionProps
            : { ...motionProps, transition: { duration: 0.7, delay: 0.3 } })}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/concepts">
            <Button variant="primary" size="lg" trailing={<ArrowRight size={18} aria-hidden />}>
              Explore Concepts
            </Button>
          </Link>
          <Link to="/simulator">
            <Button variant="secondary" size="lg" leading={<BlocksIcon size={18} aria-hidden />}>
              Try Block Simulator
            </Button>
          </Link>
          <Link to="/prices">
            <Button variant="ghost" size="lg" leading={<LineChart size={18} aria-hidden />}>
              Live Prices
            </Button>
          </Link>
        </motion.div>

        <FloatingBlocks reduceMotion={!!reduceMotion} />
      </div>
    </section>
  );
}

function FloatingBlocks({ reduceMotion }: { reduceMotion: boolean }) {
  const blocks = [0, 1, 2, 3];
  return (
    <div className="mt-20 flex items-center justify-center gap-3 md:gap-6" aria-hidden>
      {blocks.map((i) => (
        <div key={i} className="flex items-center gap-3 md:gap-6">
          <motion.div
            initial={false}
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={
              reduceMotion ? undefined : { duration: 3, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }
            }
            className="relative grid h-14 w-14 place-items-center rounded-xl border border-hairline bg-surface md:h-20 md:w-20"
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-brand opacity-10" />
            <span className="font-mono text-[10px] text-brand md:text-xs">#{i + 1}</span>
            <span className="absolute -inset-px rounded-xl ring-1 ring-brand/20 shadow-[0_0_30px_-8px_var(--brand)]" />
          </motion.div>
          {i < blocks.length - 1 && (
            <div className="h-px w-8 bg-gradient-to-r from-brand to-violet md:w-14" />
          )}
        </div>
      ))}
    </div>
  );
}
