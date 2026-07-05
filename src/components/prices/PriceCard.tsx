import { TrendingDown, TrendingUp, Star } from "lucide-react";
import { Card } from "@/components/uikit/Card";
import { formatCompactUSD, formatPercent, formatUSD } from "@/utils/format";
import type { Coin } from "@/types";
import { Sparkline } from "./Sparkline";
import { cn } from "@/lib/utils";

interface PriceCardProps {
  coin: Coin;
  watched?: boolean;
  onToggleWatch?: (coinId: string) => void;
  watchLoading?: boolean;
}

export function PriceCard({ coin, watched, onToggleWatch, watchLoading }: PriceCardProps) {
  const positive = coin.change24h >= 0;
  return (
    <Card glow={positive ? "ok" : "err"} interactive className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {coin.image ? (
          <img src={coin.image} alt={`${coin.name} logo`} className="h-9 w-9 rounded-full" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-elevated" aria-hidden />
        )}
        <div className="flex-1">
          <p className="font-display text-lg font-semibold text-ink leading-none">{coin.name}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-dim">{coin.symbol}</p>
        </div>
        {onToggleWatch && (
          <button
            type="button"
            onClick={() => onToggleWatch(coin.id)}
            disabled={watchLoading}
            aria-label={watched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              watched
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-hairline text-mute hover:border-brand hover:text-brand",
            )}
          >
            <Star size={16} className={watched ? "fill-current" : undefined} />
          </button>
        )}
      </div>

      <div className="flex items-end justify-between gap-4">
        <p className="font-display text-2xl md:text-3xl font-bold text-ink">
          {formatUSD(coin.price)}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
            positive ? "border-ok/40 bg-ok/10 text-ok" : "border-err/40 bg-err/10 text-err",
          )}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {formatPercent(coin.change24h)}
        </span>
      </div>

      <Sparkline data={coin.sparkline} positive={positive} />

      <div className="flex items-center justify-between border-t border-hairline pt-3 text-xs text-mute">
        <span>Market Cap</span>
        <span className="font-mono text-ink">{formatCompactUSD(coin.marketCap)}</span>
      </div>
    </Card>
  );
}
