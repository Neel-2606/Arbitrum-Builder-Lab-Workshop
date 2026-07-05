import { z } from "zod";

export const apiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
  }),
});

export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

export function apiError(message: string, code: string, status = 500): Response {
  const body: ApiErrorBody = { error: { message, code } };
  return Response.json(body, { status });
}
