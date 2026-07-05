import { Loader2, Save, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/uikit/Button";
import { Card } from "@/components/uikit/Card";
import { useChainMutations, useSavedChainsQuery } from "@/hooks/useChainsQuery";
import type { Block } from "@/types";
import { DIFFICULTY_PREFIX } from "@/utils/hash";

interface SavedChainsPanelProps {
  blocks: Block[];
  onLoad: (blocks: Block[]) => void;
}

export function SavedChainsPanel({ blocks, onLoad }: SavedChainsPanelProps) {
  const [name, setName] = useState("");
  const { data: chains = [], isLoading, error } = useSavedChainsQuery();
  const { save, remove, load } = useChainMutations();
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage("Enter a name for your chain.");
      return;
    }
    setMessage(null);
    try {
      await save.mutateAsync({ name: trimmed, blocks, difficulty: DIFFICULTY_PREFIX });
      setName("");
      setMessage("Chain saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    }
  };

  const handleLoad = async (id: string) => {
    setMessage(null);
    try {
      const chain = await load.mutateAsync(id);
      onLoad(chain.blocks);
      setMessage(`Loaded "${chain.name}".`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed.");
    }
  };

  const handleDelete = async (id: string) => {
    setMessage(null);
    try {
      await remove.mutateAsync(id);
      setMessage("Chain deleted.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed.");
    }
  };

  return (
    <Card className="mt-10 p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Saved Chains</h3>
      <p className="mt-1 text-sm text-mute">
        Persist your mined blockchain — proof that tampering breaks the chain.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Chain name…"
          aria-label="Saved chain name"
          className="min-w-[200px] flex-1 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={save.isPending}
          leading={save.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        >
          Save Chain
        </Button>
      </div>

      {message && <p className="mt-3 text-xs text-mute">{message}</p>}
      {error && (
        <p className="mt-3 text-xs text-warn">
          Could not reach the database — saved chains unavailable.
        </p>
      )}

      <ul className="mt-6 space-y-2">
        {isLoading ? (
          <li className="text-sm text-mute">Loading saved chains…</li>
        ) : chains.length === 0 ? (
          <li className="text-sm text-mute">No saved chains yet. Mine blocks, then save.</li>
        ) : (
          chains.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-hairline bg-surface px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-ink">{c.name}</p>
                <p className="text-xs text-dim font-mono">
                  {c.blockCount} blocks · {new Date(c.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleLoad(c.id)}
                  disabled={load.isPending}
                  leading={<Upload size={14} />}
                  aria-label={`Load chain ${c.name}`}
                >
                  Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(c.id)}
                  disabled={remove.isPending}
                  leading={<Trash2 size={14} />}
                  aria-label={`Delete chain ${c.name}`}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
