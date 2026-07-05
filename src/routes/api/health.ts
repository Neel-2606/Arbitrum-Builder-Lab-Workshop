import { createFileRoute } from "@tanstack/react-router";
import { healthResponseSchema } from "@/server/schemas";

const startedAt = Date.now();
const VERSION = process.env.APP_VERSION ?? "1.0.0";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const body = healthResponseSchema.parse({
          status: "ok" as const,
          uptime: Math.floor((Date.now() - startedAt) / 1000),
          version: VERSION,
        });
        return Response.json(body, {
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
