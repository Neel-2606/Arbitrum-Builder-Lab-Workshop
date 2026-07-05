import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const savedChains = sqliteTable("saved_chains", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  name: text("name").notNull(),
  blocksJson: text("blocks_json").notNull(),
  difficulty: text("difficulty"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const watchlist = sqliteTable("watchlist", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  coinId: text("coin_id").notNull(),
  addedAt: integer("added_at").notNull(),
});

export type SavedChainRow = typeof savedChains.$inferSelect;
export type WatchlistRow = typeof watchlist.$inferSelect;

/** Initial migration SQL — applied by drizzle-kit or seed script. */
export const INIT_SQL = sql`
  CREATE TABLE IF NOT EXISTS saved_chains (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    name TEXT NOT NULL,
    blocks_json TEXT NOT NULL,
    difficulty TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS watchlist (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    coin_id TEXT NOT NULL,
    added_at INTEGER NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS watchlist_session_coin_idx
    ON watchlist (session_id, coin_id);
`;
