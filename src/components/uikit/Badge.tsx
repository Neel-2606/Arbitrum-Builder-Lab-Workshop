import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "brand" | "cyan" | "violet" | "ok" | "err" | "muted" | "orange";

const toneMap: Record<Tone, string> = {
  brand: "border-brand/30 bg-brand/10 text-brand",
  cyan: "border-cyan/30 bg-cyan/10 text-cyan",
  violet: "border-violet/30 bg-violet/10 text-violet",
  ok: "border-ok/30 bg-ok/10 text-ok",
  err: "border-err/30 bg-err/10 text-err",
  muted: "border-hairline bg-elevated text-mute",
  orange: "border-warn/30 bg-warn/10 text-warn",
};

export function Badge({
  tone = "brand",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
        toneMap[tone],
        className,
      )}
      {...props}
    />
  );
}
