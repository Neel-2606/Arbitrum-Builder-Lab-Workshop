import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type AppDatabase = LibSQLDatabase<typeof schema>;

let dbInstance: AppDatabase | null = null;
let clientInstance: Client | null = null;

export type DbMode = "turso" | "local-file";

export function getDbMode(): DbMode | null {
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    return "turso";
  }
  if (process.env.DATABASE_URL?.startsWith("file:") || !process.env.DATABASE_URL) {
    return "local-file";
  }
  return process.env.DATABASE_URL ? "turso" : null;
}

function createLibsqlClient(): Client | null {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    return createClient({ url: tursoUrl, authToken: tursoToken });
  }

  const localUrl = process.env.DATABASE_URL ?? "file:./data/chainlens.db";
  return createClient({ url: localUrl });
}

/** Returns a Drizzle instance, or null when DB is unavailable. */
export function getDb(): AppDatabase | null {
  if (dbInstance) return dbInstance;

  try {
    clientInstance = createLibsqlClient();
    if (!clientInstance) return null;
    dbInstance = drizzle(clientInstance, { schema });
    return dbInstance;
  } catch (e) {
    console.error("[db] Failed to connect:", e);
    return null;
  }
}

export async function ensureSchema(): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  const client = clientInstance;
  if (!client) return false;

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS saved_chains (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        name TEXT NOT NULL,
        blocks_json TEXT NOT NULL,
        difficulty TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `);
    await client.execute(`
      CREATE TABLE IF NOT EXISTS watchlist (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        coin_id TEXT NOT NULL,
        added_at INTEGER NOT NULL
      )
    `);
    await client.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS watchlist_session_coin_idx
        ON watchlist (session_id, coin_id)
    `);
    return true;
  } catch (e) {
    console.error("[db] Schema init failed:", e);
    return false;
  }
}

export function requireDb(): AppDatabase {
  const db = getDb();
  if (!db) {
    throw new DbUnavailableError();
  }
  return db;
}

export class DbUnavailableError extends Error {
  code = "DB_UNAVAILABLE" as const;
  constructor() {
    super("Database is unavailable.");
    this.name = "DbUnavailableError";
  }
}
