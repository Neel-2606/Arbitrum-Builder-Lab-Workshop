const SESSION_HEADER = "x-session-id";

/** Read anonymous session id from request (client sends via header). */
export function getSessionId(request: Request): string | null {
  const id = request.headers.get(SESSION_HEADER)?.trim();
  return id && id.length >= 8 && id.length <= 64 ? id : null;
}

export function requireSessionId(request: Request): string {
  const id = getSessionId(request);
  if (!id) {
    throw new SessionRequiredError();
  }
  return id;
}

export class SessionRequiredError extends Error {
  code = "SESSION_REQUIRED" as const;
  constructor() {
    super("X-Session-Id header is required.");
    this.name = "SessionRequiredError";
  }
}

export const SESSION_HEADER_NAME = SESSION_HEADER;
