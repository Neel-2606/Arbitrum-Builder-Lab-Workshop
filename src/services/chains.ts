import { apiFetch, parseApiError } from "@/lib/api-client";
import type { Block } from "@/types";

export interface ChainSummary {
  id: string;
  name: string;
  blockCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface SavedChain extends ChainSummary {
  blocks: Block[];
  difficulty: string | null;
}

export async function fetchChains(): Promise<ChainSummary[]> {
  const res = await apiFetch("/api/chains");
  if (res.status === 503) return [];
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to load saved chains."));
  return (await res.json()) as ChainSummary[];
}

export async function saveChainApi(
  name: string,
  blocks: Block[],
  difficulty?: string,
): Promise<ChainSummary> {
  const res = await apiFetch("/api/chains", {
    method: "POST",
    body: JSON.stringify({ name, blocks, difficulty }),
  });
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to save chain."));
  return (await res.json()) as ChainSummary;
}

export async function loadChainApi(id: string): Promise<SavedChain> {
  const res = await apiFetch(`/api/chains/${id}`);
  if (!res.ok) throw new Error(await parseApiError(res, "Failed to load chain."));
  return (await res.json()) as SavedChain;
}

export async function deleteChainApi(id: string): Promise<void> {
  const res = await apiFetch(`/api/chains/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    throw new Error(await parseApiError(res, "Failed to delete chain."));
  }
}
