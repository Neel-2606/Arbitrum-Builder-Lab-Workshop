import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";
import { Card } from "./Card";

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card glow="err" className="flex flex-col items-center text-center gap-4 py-10">
      <div className="rounded-full bg-err/10 p-3 text-err">
        <AlertTriangle size={24} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-mute max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" leading={<RefreshCw size={16} />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}
