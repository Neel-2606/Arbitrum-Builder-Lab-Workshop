import { createFileRoute } from "@tanstack/react-router";
import { apiError } from "@/server/api-error";
import { DbUnavailableError } from "@/db";
import { deleteChain, getChain } from "@/server/repositories";
import { savedChainSchema } from "@/server/schemas";
import { requireSessionId, SessionRequiredError } from "@/server/session";

export const Route = createFileRoute("/api/chains/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const sessionId = requireSessionId(request);
          const chain = await getChain(sessionId, params.id);
          if (!chain) {
            return apiError("Chain not found.", "NOT_FOUND", 404);
          }
          const validated = savedChainSchema.parse(chain);
          return Response.json(validated);
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          console.error("[GET /api/chains/$id]", e);
          return apiError("Failed to load chain.", "INTERNAL_ERROR", 500);
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          const sessionId = requireSessionId(request);
          const deleted = await deleteChain(sessionId, params.id);
          if (!deleted) {
            return apiError("Chain not found.", "NOT_FOUND", 404);
          }
          return new Response(null, { status: 204 });
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          console.error("[DELETE /api/chains/$id]", e);
          return apiError("Failed to delete chain.", "INTERNAL_ERROR", 500);
        }
      },
    },
  },
});
