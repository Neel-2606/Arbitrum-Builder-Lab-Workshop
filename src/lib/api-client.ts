import { getOrCreateSessionId } from "@/lib/session";

interface ApiErrorBody {
  error?: { message?: string; code?: string };
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const sessionId = getOrCreateSessionId();
  const headers = new Headers(init?.headers);
  headers.set("X-Session-Id", sessionId);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(path, { ...init, headers });
}

export async function parseApiError(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as ApiErrorBody;
    return body.error?.message ?? fallback;
  } catch {
    return fallback;
  }
}
