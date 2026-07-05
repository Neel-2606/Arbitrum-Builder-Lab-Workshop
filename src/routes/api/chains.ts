import { createFileRoute } from "@tanstack/react-router";
import { apiError } from "@/server/api-error";
import { DbUnavailableError } from "@/db";
import { listChains, saveChain } from "@/server/repositories";
import { saveChainBodySchema } from "@/server/schemas";
import { requireSessionId, SessionRequiredError } from "@/server/session";

export const Route = createFileRoute("/api/chains")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const sessionId = requireSessionId(request);
          const chains = await listChains(sessionId);
          return Response.json(chains);
        } catch (e) {
          if (e instanceof SessionRequiredError) {
            return apiError(e.message, e.code, 401);
          }
          if (e instanceof DbUnavailableError) {
            return apiError(e.message, e.code, 503);
          }
          console.error("[GET /api/chains]", e);
          return apiError("Failed to list chains.", "INTERNAL_ERROR", 500);
        }
      },
      POST: async ({ request }) => {
        try {
          const sessionId = requireSessionId(request);
          const body = saveChainBodySchema.parse(await request.json());
          const summary = await saveChain(sessionId, body.name, body.blocks, body.difficulty);
          return Response.json(summary, { status: 201 });
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
          console.error("[POST /api/chains]", e);
          return apiError("Failed to save chain.", "INTERNAL_ERROR", 500);
        }
      },
    },
  },
});
