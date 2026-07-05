import { Link } from "@tanstack/react-router";
import { ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/uikit/Button";

export function RealWorldBenefit() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-24">
      <div className="relative rounded-3xl p-[1px] bg-gradient-brand">
        <div className="rounded-[calc(1.5rem-1px)] bg-base p-8 md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-[0_10px_30px_-10px_var(--brand)]"
                aria-hidden
              >
                <Rocket size={22} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gradient font-semibold">
                  Real-World Impact
                </p>
                <p className="mt-2 text-lg md:text-xl text-ink leading-relaxed max-w-3xl">
                  A transaction that might cost <span className="font-mono text-err">$15</span> and take
                  minutes on Ethereum mainnet can cost just{" "}
                  <span className="font-mono text-ok">a few cents</span> and confirm in seconds on
                  Arbitrum — making Web3 actually usable for everyday people.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/prices">
                <Button variant="secondary" size="sm" trailing={<ArrowRight size={14} aria-hidden />}>
                  See Live Prices
                </Button>
              </Link>
              <Link to="/concepts">
                <Button variant="ghost" size="sm">
                  Learn the Basics
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
