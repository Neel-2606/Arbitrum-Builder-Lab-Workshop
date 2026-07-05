import { BookOpen } from "lucide-react";
import { Card } from "@/components/uikit/Card";

export function HowItWorks() {
  return (
    <Card className="bg-surface/60">
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand ring-1 ring-brand/30">
          <BookOpen size={18} />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">How it works</h3>
          <ul className="mt-3 space-y-2 text-sm text-mute leading-relaxed">
            <li>
              <span className="text-ink font-medium">Hash: </span>
              Each block is fingerprinted by <span className="font-mono text-brand">sha256(index + data + previousHash + nonce)</span>.
              Any tiny change flips the hash completely.
            </li>
            <li>
              <span className="text-ink font-medium">Nonce: </span>
              A number miners increment until they find a hash that meets the difficulty target
              (here: starts with <span className="font-mono text-brand">00</span>).
            </li>
            <li>
              <span className="text-ink font-medium">Proof of Work: </span>
              Real Bitcoin PoW requires ~19 leading zeros — trillions of tries. We use 2 zeros
              so mining is instant in your browser.
            </li>
            <li>
              <span className="text-ink font-medium">Immutability: </span>
              Each block stores the previous block's hash. Edit an old block and every block
              after it becomes invalid.
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
