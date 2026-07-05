// Number / currency formatters used across the price dashboard.

export function formatUSD(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  const digits = value >= 1 ? 2 : value >= 0.01 ? 4 : 6;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompactUSD(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatTime(ts: number | undefined | null): string {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function truncate(str: string, keep = 10): string {
  if (str.length <= keep * 2 + 3) return str;
  return `${str.slice(0, keep)}…${str.slice(-keep)}`;
}
