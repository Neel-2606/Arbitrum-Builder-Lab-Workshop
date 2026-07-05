import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Pickaxe, Loader2 } from "lucide-react";
import { Button } from "@/components/uikit/Button";
import { Card } from "@/components/uikit/Card";
import { cn } from "@/lib/utils";
import type { Block as BlockType } from "@/types";
import { isValidHash } from "@/utils/hash";

interface Props {
  block: BlockType;
  onDataChange: (data: string) => void;
  onMine: () => void;
  chainBroken?: boolean; // upstream link broken (for block 2+)
}

export function Block({ block, onDataChange, onMine, chainBroken }: Props) {
  const selfValid = isValidHash(block.hash);
  const valid = selfValid && !chainBroken;

  return (
    <Card
      glow={valid ? "ok" : "err"}
      className={cn("flex flex-col gap-4 transition-colors")}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-brand text-white font-mono text-sm">
            #{block.index + 1}
          </span>
          <h3 className="font-display text-lg font-bold text-ink">Block #{block.index + 1}</h3>
        </div>
        <motion.span
          key={valid ? "ok" : "err"}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            valid
              ? "border-ok/40 bg-ok/10 text-ok"
              : "border-err/40 bg-err/10 text-err",
          )}
        >
          {valid ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          {valid ? "Valid Block" : "Invalid Block"}
        </motion.span>
      </div>

      <Field label="Index">
        <input
          readOnly
          value={block.index}
          className="w-full rounded-lg border border-hairline bg-elevated/60 px-3 py-2 font-mono text-sm text-mute"
        />
      </Field>

      <Field label="Data" htmlFor={`block-${block.index}-data`}>
        <textarea
          id={`block-${block.index}-data`}
          value={block.data}
          onChange={(e) => onDataChange(e.target.value)}
          rows={2}
          aria-describedby={block.mining ? `block-${block.index}-mining` : undefined}
          disabled={block.mining}
          className="w-full rounded-lg border border-hairline bg-elevated px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 resize-none disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Transaction data..."
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Nonce">
          <input
            readOnly
            value={block.nonce}
            className="w-full rounded-lg border border-hairline bg-elevated/60 px-3 py-2 font-mono text-sm text-ink"
          />
        </Field>
        <Field label="Difficulty">
          <input
            readOnly
            value="starts with 00"
            className="w-full rounded-lg border border-hairline bg-elevated/60 px-3 py-2 font-mono text-sm text-mute"
          />
        </Field>
      </div>

      <Field label="Previous Hash">
        <div
          className={cn(
            "rounded-lg border px-3 py-2 font-mono text-xs break-all",
            chainBroken
              ? "border-err/50 bg-err/5 text-err"
              : "border-hairline bg-elevated/60 text-mute",
          )}
        >
          {block.previousHash || "…"}
        </div>
      </Field>

      <Field label="Current Hash">
        <div
          className={cn(
            "rounded-lg border px-3 py-2 font-mono text-xs break-all",
            selfValid
              ? "border-ok/40 bg-ok/5 text-ok"
              : "border-err/40 bg-err/5 text-err",
          )}
        >
          {block.hash || "computing…"}
        </div>
      </Field>

      <Button
        onClick={onMine}
        disabled={block.mining}
        variant="primary"
        aria-busy={block.mining}
        aria-describedby={block.mining ? `block-${block.index}-mining` : undefined}
        leading={block.mining ? <Loader2 className="animate-spin" size={16} aria-hidden /> : <Pickaxe size={16} aria-hidden />}
      >
        {block.mining ? "Mining…" : "Mine Block"}
      </Button>
      {block.mining && (
        <p id={`block-${block.index}-mining`} className="sr-only">
          Mining block {block.index + 1}, searching for a valid hash.
        </p>
      )}
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-dim">
        {label}
      </span>
      {children}
    </label>
  );
}
