import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteChainApi,
  fetchChains,
  loadChainApi,
  saveChainApi,
} from "@/services/chains";
import { queryKeys } from "@/lib/query-keys";
import type { Block } from "@/types";

export function useSavedChainsQuery() {
  return useQuery({
    queryKey: queryKeys.chains,
    queryFn: fetchChains,
    staleTime: 10_000,
  });
}

export function useChainMutations() {
  const qc = useQueryClient();

  const save = useMutation({
    mutationFn: ({ name, blocks, difficulty }: { name: string; blocks: Block[]; difficulty?: string }) =>
      saveChainApi(name, blocks, difficulty),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.chains }),
  });

  const remove = useMutation({
    mutationFn: deleteChainApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.chains }),
  });

  const load = useMutation({
    mutationFn: loadChainApi,
  });

  return { save, remove, load };
}
