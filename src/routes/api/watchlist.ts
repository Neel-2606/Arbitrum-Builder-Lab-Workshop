import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { apiError } from "@/server/api-error";
import { DbUnavailableError } from "@/db";
import { addToWatchlist, getWatchlist } from "@/server/repositories";
import { watchlistBodySchema } from "@/server/schemas";
import { requireSessionId, SessionRequiredError } from "@/server/session";

const watchlistResponseSchema = z.object({ coinIds: z.array(z.string()) });

export const Route = createFileRoute("/api/watchlist")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const sessionId = requireSessionId(request);
          const coinIds = await getWatchlist(sessionId);
          return Response.json(watchlistResponseSchema.parse({ coinIds }));
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          console.error("[GET /api/watchlist]", e);
          return apiError("Failed to load watchlist.", "INTERNAL_ERROR", 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const sessionId = requireSessionId(request);
          const body = watchlistBodySchema.parse(await request.json());
          const coinIds = await addToWatchlist(sessionId, body.coinId);
          return Response.json(watchlistResponseSchema.parse({ coinIds }), { status: 201 });
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          if (e instanceof Error && e.name === "ZodError") {
            return apiError("Invalid request body.", "VALIDATION_ERROR", 400);
          }
          console.error("[POST /api/watchlist]", e);
          return apiError("Failed to update watchlist.", "INTERNAL_ERROR", 500);
        }
      },
    },
  },
});
