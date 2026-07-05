import { getDb, ensureSchema } from "@/db";
import { watchlist } from "@/db/schema";
import { TRACKED_COIN_IDS } from "@/constants/coins";

const DEMO_SESSION = "00000000-0000-4000-8000-000000000001";

async function seed() {
  if (!(await ensureSchema())) {
    console.error("Database unavailable — set DATABASE_URL in .env");
    process.exit(1);
  }

  const db = getDb();
  if (!db) {
    console.error("Could not connect to database.");
    process.exit(1);
  }

  const now = Date.now();
  for (const coinId of TRACKED_COIN_IDS) {
    try {
      await db.insert(watchlist).values({
        id: crypto.randomUUID(),
        sessionId: DEMO_SESSION,
        coinId,
        addedAt: now,
      });
    } catch {
      // ignore duplicates on re-seed
    }
  }

  console.log("Seeded default watchlist for demo session.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
