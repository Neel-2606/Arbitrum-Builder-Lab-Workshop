import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className }: Props) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-gradient">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-mute leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
