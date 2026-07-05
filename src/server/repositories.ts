import { and, desc, eq } from "drizzle-orm";
import { ensureSchema, requireDb } from "@/db";
import { savedChains, watchlist } from "@/db/schema";
import type { Block } from "@/types";

export async function initDb(): Promise<boolean> {
  return ensureSchema();
}

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

function newId(): string {
  return crypto.randomUUID();
}

export async function listChains(sessionId: string): Promise<ChainSummary[]> {
  await initDb();
  const db = requireDb();
  const rows = await db
    .select()
    .from(savedChains)
    .where(eq(savedChains.sessionId, sessionId))
    .orderBy(desc(savedChains.updatedAt));

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    blockCount: (JSON.parse(r.blocksJson) as Block[]).length,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function getChain(sessionId: string, id: string): Promise<SavedChain | null> {
  await initDb();
  const db = requireDb();
  const [row] = await db
    .select()
    .from(savedChains)
    .where(and(eq(savedChains.id, id), eq(savedChains.sessionId, sessionId)))
    .limit(1);

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    blockCount: (JSON.parse(row.blocksJson) as Block[]).length,
    blocks: JSON.parse(row.blocksJson) as Block[],
    difficulty: row.difficulty,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function saveChain(
  sessionId: string,
  name: string,
  blocks: Block[],
  difficulty?: string,
): Promise<ChainSummary> {
  await initDb();
  const db = requireDb();
  const now = Date.now();
  const id = newId();
  const blocksJson = JSON.stringify(blocks);

  await db.insert(savedChains).values({
    id,
    sessionId,
    name,
    blocksJson,
    difficulty: difficulty ?? null,
    createdAt: now,
    updatedAt: now,
  });

  return { id, name, blockCount: blocks.length, createdAt: now, updatedAt: now };
}

export async function deleteChain(sessionId: string, id: string): Promise<boolean> {
  await initDb();
  const db = requireDb();
  const result = await db
    .delete(savedChains)
    .where(and(eq(savedChains.id, id), eq(savedChains.sessionId, sessionId)));
  return (result.rowsAffected ?? 0) > 0;
}

export async function getWatchlist(sessionId: string): Promise<string[]> {
  await initDb();
  const db = requireDb();
  const rows = await db
    .select()
    .from(watchlist)
    .where(eq(watchlist.sessionId, sessionId))
    .orderBy(desc(watchlist.addedAt));
  return rows.map((r) => r.coinId);
}

export async function addToWatchlist(sessionId: string, coinId: string): Promise<string[]> {
  await initDb();
  const db = requireDb();
  const existing = await getWatchlist(sessionId);
  if (existing.includes(coinId)) return existing;

  const now = Date.now();
  await db.insert(watchlist).values({ id: newId(), sessionId, coinId, addedAt: now });
  return getWatchlist(sessionId);
}

export async function removeFromWatchlist(sessionId: string, coinId: string): Promise<string[]> {
  await initDb();
  const db = requireDb();
  await db
    .delete(watchlist)
    .where(and(eq(watchlist.sessionId, sessionId), eq(watchlist.coinId, coinId)));
  return getWatchlist(sessionId);
}
