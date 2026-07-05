import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChainConnector({ broken }: { broken: boolean }) {
  return (
    <div className="flex items-center justify-center py-2 md:py-0 md:px-2">
      <div className={cn("relative flex items-center gap-2", broken ? "text-err" : "text-brand")}>
        {/* horizontal line for md+, vertical for mobile */}
        <div className={cn(
          "h-8 w-px md:h-px md:w-20 rounded-full",
          broken ? "bg-err/60" : "bg-gradient-to-r from-brand to-violet",
        )} />
        <div className={cn(
          "grid h-9 w-9 place-items-center rounded-full border",
          broken
            ? "border-err/50 bg-err/10 shadow-[0_0_20px_-4px_var(--err)]"
            : "border-brand/50 bg-brand/10 shadow-[0_0_20px_-4px_var(--brand)]",
        )}>
          <Link2 size={16} />
        </div>
        <div className={cn(
          "h-8 w-px md:h-px md:w-20 rounded-full",
          broken ? "bg-err/60" : "bg-gradient-to-r from-brand to-violet",
        )} />
      </div>
    </div>
  );
}
