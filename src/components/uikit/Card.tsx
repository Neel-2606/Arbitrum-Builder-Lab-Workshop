import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "brand" | "ok" | "err" | "none";
  interactive?: boolean;
}

const glowMap: Record<NonNullable<CardProps["glow"]>, string> = {
  none: "",
  brand: "hover:border-brand hover:shadow-[0_20px_60px_-20px_color-mix(in_oklab,var(--brand)_55%,transparent)]",
  ok: "border-ok/40 shadow-[0_0_0_1px_color-mix(in_oklab,var(--ok)_35%,transparent),0_20px_60px_-20px_color-mix(in_oklab,var(--ok)_55%,transparent)]",
  err: "border-err/40 shadow-[0_0_0_1px_color-mix(in_oklab,var(--err)_35%,transparent),0_20px_60px_-20px_color-mix(in_oklab,var(--err)_55%,transparent)]",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = "none", interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl border border-hairline bg-surface p-6 transition-all",
        interactive && "hover:-translate-y-1",
        glowMap[glow],
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
