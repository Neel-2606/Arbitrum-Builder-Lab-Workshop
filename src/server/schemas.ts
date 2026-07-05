import { z } from "zod";

export const coinSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change24h: z.number(),
  marketCap: z.number(),
  lastUpdated: z.number(),
  sparkline: z.array(z.number()),
  image: z.string().optional(),
});

export const coinsResponseSchema = z.array(coinSchema);

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  uptime: z.number(),
  version: z.string(),
});

export const blockSchema = z.object({
  index: z.number(),
  data: z.string(),
  nonce: z.number(),
  previousHash: z.string(),
  hash: z.string(),
  mining: z.boolean(),
});

export const saveChainBodySchema = z.object({
  name: z.string().min(1).max(100),
  blocks: z.array(blockSchema).min(1),
  difficulty: z.string().optional(),
});

export const chainSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  blockCount: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const savedChainSchema = chainSummarySchema.extend({
  blocks: z.array(blockSchema),
  difficulty: z.string().nullable(),
});

export const watchlistBodySchema = z.object({
  coinId: z.string().min(1),
});
