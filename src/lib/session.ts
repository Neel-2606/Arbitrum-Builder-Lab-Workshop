const STORAGE_KEY = "chainlens_session_id";

/** Anonymous session id persisted in localStorage for API auth. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "ssr-placeholder";

  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
