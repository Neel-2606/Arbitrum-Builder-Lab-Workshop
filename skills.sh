#!/usr/bin/env bash
# ChainLens Academy — developer workflow entry point
# Usage: ./skills.sh <command> [args...]
set -euo pipefail

# ── Colors (disabled when not a TTY) ────────────────────────────────────────
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  DIM='\033[2m'
  RESET='\033[0m'
else
  RED='' GREEN='' YELLOW='' BLUE='' CYAN='' BOLD='' DIM='' RESET=''
fi

info()  { printf '%b\n' "${BLUE}ℹ${RESET}  $*"; }
ok()    { printf '%b\n' "${GREEN}✔${RESET}  $*"; }
warn()  { printf '%b\n' "${YELLOW}⚠${RESET}  $*"; }
err()   { printf '%b\n' "${RED}✖${RESET}  $*" >&2; }
step()  { printf '%b\n' "${CYAN}→${RESET}  $*"; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

MIN_BUN_MAJOR=1

# ── Bun resolution ────────────────────────────────────────────────────────────
resolve_bun() {
  if command -v bun >/dev/null 2>&1; then
    echo "bun"
    return 0
  fi
  local candidates=(
    "${HOME}/.bun/bin/bun"
    "${USERPROFILE:-}/.bun/bin/bun.exe"
  )
  for c in "${candidates[@]}"; do
    if [[ -x "$c" ]]; then
      echo "$c"
      return 0
    fi
  done
  return 1
}

require_bun() {
  local bun_bin
  if ! bun_bin="$(resolve_bun)"; then
    err "Bun is not installed."
    info "Install: curl -fsSL https://bun.sh/install | bash"
    info "Windows:  powershell -c \"irm bun.sh/install.ps1 | iex\""
    exit 1
  fi
  echo "$bun_bin"
}

check_bun_version() {
  local bun_bin="$1"
  local version major
  version="$("$bun_bin" --version 2>/dev/null || true)"
  major="${version%%.*}"
  if [[ -z "$version" || "$major" -lt "$MIN_BUN_MAJOR" ]]; then
    err "Bun >= ${MIN_BUN_MAJOR}.0 required (found: ${version:-none})"
    exit 1
  fi
  ok "Bun ${version}"
}

# ── Commands ──────────────────────────────────────────────────────────────────
cmd_setup() {
  step "Setting up ChainLens Academy…"
  local bun_bin
  bun_bin="$(require_bun)"
  check_bun_version "$bun_bin"

  step "Installing dependencies…"
  "$bun_bin" install
  ok "Dependencies installed"

  if [[ -f .env.example && ! -f .env ]]; then
    cp .env.example .env
    ok "Created .env from .env.example"
  elif [[ ! -f .env.example ]]; then
    warn ".env.example not found yet (added in Phase 3). Skipping .env copy."
  else
    info ".env already exists — left unchanged"
  fi

  ok "Setup complete. Run: ./skills.sh dev"
}

cmd_dev() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin" run dev
}

cmd_build() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin" run build
}

cmd_preview() {
  local bun_bin
  bun_bin="$(require_bun)"
  step "Building for preview…"
  "$bun_bin" run build
  ok "Build complete"
  step "Starting preview server…"
  exec "$bun_bin" run preview
}

cmd_lint() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin" run lint
}

cmd_format() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin" run format
}

cmd_typecheck() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin"x tsc --noEmit
}

cmd_check() {
  step "Running CI gate: lint → typecheck → build"
  cmd_lint
  cmd_typecheck
  cmd_build
  ok "All checks passed"
}

cmd_clean() {
  step "Removing build artifacts…"
  local targets=(node_modules .nitro dist .output)
  for t in "${targets[@]}"; do
    if [[ -e "$t" ]]; then
      rm -rf "$t"
      ok "Removed $t"
    fi
  done
  ok "Clean complete"
}

cmd_reset() {
  cmd_clean
  cmd_setup
}

cmd_db_migrate() {
  local bun_bin
  bun_bin="$(require_bun)"
  if [[ ! -f drizzle.config.ts ]]; then
    err "drizzle.config.ts not found."
    exit 1
  fi

  if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi

  if [[ -n "${TURSO_DATABASE_URL:-}" && -n "${TURSO_AUTH_TOKEN:-}" ]]; then
    step "Pushing schema to Turso…"
    exec "$bun_bin"x drizzle-kit push
  fi

  mkdir -p data
  step "Running Drizzle migrations (local file DB)…"
  exec "$bun_bin"x drizzle-kit migrate
}

cmd_db_seed() {
  local bun_bin
  bun_bin="$(require_bun)"
  if [[ ! -f src/db/seed.ts ]]; then
    err "Seed script not found."
    exit 1
  fi
  mkdir -p data
  exec "$bun_bin" run src/db/seed.ts
}

cmd_db_studio() {
  local bun_bin
  bun_bin="$(require_bun)"
  if [[ ! -f drizzle.config.ts ]]; then
    err "Database not configured yet (Phase 3)."
    exit 1
  fi
  exec "$bun_bin"x drizzle-kit studio
}

cmd_test() {
  local bun_bin
  bun_bin="$(require_bun)"
  exec "$bun_bin" run test
}

cmd_help() {
  printf '%b\n' "${BOLD}ChainLens Academy — skills.sh${RESET}"
  printf '%b\n' "${DIM}Bun-aware developer workflow wrapper${RESET}\n"
  printf '  %bsetup%b       Check Bun, install deps, copy .env.example → .env\n' "$CYAN" "$RESET"
  printf '  %bdev%b         Start Vite dev server (bun run dev)\n' "$CYAN" "$RESET"
  printf '  %bbuild%b       Production build (client + SSR + Nitro)\n' "$CYAN" "$RESET"
  printf '  %bpreview%b     Build then start preview server\n' "$CYAN" "$RESET"
  printf '  %blint%b        Run ESLint\n' "$CYAN" "$RESET"
  printf '  %bformat%b      Run Prettier\n' "$CYAN" "$RESET"
  printf '  %btypecheck%b   TypeScript check (tsc --noEmit)\n' "$CYAN" "$RESET"
  printf '  %bcheck%b        lint + typecheck + build (CI gate)\n' "$CYAN" "$RESET"
  printf '  %bclean%b       Remove node_modules, .nitro, dist, .output\n' "$CYAN" "$RESET"
  printf '  %breset%b        clean + setup\n' "$CYAN" "$RESET"
  printf '  %bdb:migrate%b  Run Drizzle migrations (Phase 3)\n' "$CYAN" "$RESET"
  printf '  %bdb:seed%b      Seed database (Phase 3)\n' "$CYAN" "$RESET"
  printf '  %bdb:studio%b    Open Drizzle Studio (Phase 3)\n' "$CYAN" "$RESET"
  printf '  %btest%b         Run Vitest unit tests (Phase 5)\n' "$CYAN" "$RESET"
  printf '  %bhelp%b         Show this menu\n' "$CYAN" "$RESET"
  printf '\n%s\n' "Run from repo root: ./skills.sh <command>"
}

# ── Dispatch ──────────────────────────────────────────────────────────────────
COMMAND="${1:-help}"
shift || true

case "$COMMAND" in
  setup)       cmd_setup "$@" ;;
  dev)         cmd_dev "$@" ;;
  build)       cmd_build "$@" ;;
  preview)     cmd_preview "$@" ;;
  lint)        cmd_lint "$@" ;;
  format)      cmd_format "$@" ;;
  typecheck)   cmd_typecheck "$@" ;;
  check)       cmd_check "$@" ;;
  clean)       cmd_clean "$@" ;;
  reset)       cmd_reset "$@" ;;
  db:migrate)  cmd_db_migrate "$@" ;;
  db:seed)     cmd_db_seed "$@" ;;
  db:studio)   cmd_db_studio "$@" ;;
  test)        cmd_test "$@" ;;
  help|--help|-h) cmd_help ;;
  *)
    err "Unknown command: $COMMAND"
    echo ""
    cmd_help
    exit 1
    ;;
esac
