/**
 * Shared utilities: pure functions, formatting, constants, shared types.
 * No React/React Native dependencies unless documented.
 */

export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toISOString().slice(0, 10);
}

export function formatCurrency(
  value: number,
  currency: string = "EUR"
): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}
