import { Card } from "@/components/uikit/Card";

export function SkeletonCard() {
  return (
    <Card className="animate-pulse space-y-4" aria-busy="true" aria-label="Loading price data">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-elevated" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-elevated" />
          <div className="h-2 w-12 rounded bg-elevated" />
        </div>
      </div>
      <div className="h-8 w-32 rounded bg-elevated" />
      <div className="h-14 w-full rounded bg-elevated" />
      <div className="h-3 w-full rounded bg-elevated" />
    </Card>
  );
}
