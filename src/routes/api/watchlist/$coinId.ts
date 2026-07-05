import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { apiError } from "@/server/api-error";
import { DbUnavailableError } from "@/db";
import { removeFromWatchlist } from "@/server/repositories";
import { requireSessionId, SessionRequiredError } from "@/server/session";

const watchlistResponseSchema = z.object({ coinIds: z.array(z.string()) });

export const Route = createFileRoute("/api/watchlist/$coinId")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        try {
          const sessionId = requireSessionId(request);
          const coinIds = await removeFromWatchlist(sessionId, params.coinId);
          return Response.json(watchlistResponseSchema.parse({ coinIds }));
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          console.error("[DELETE /api/watchlist/$coinId]", e);
          return apiError("Failed to update watchlist.", "INTERNAL_ERROR", 500);
        }
      },
    },
  },
});
