import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leading?: ReactNode;
  trailing?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-brand text-white shadow-[0_8px_30px_-8px_var(--brand)] hover:shadow-[0_12px_40px_-8px_var(--violet)] hover:brightness-110",
  secondary:
    "border border-hairline bg-surface/60 text-ink hover:border-brand hover:text-brand hover:bg-elevated",
  ghost: "text-mute hover:text-ink hover:bg-elevated",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", leading, trailing, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </button>
  ),
);
Button.displayName = "Button";
