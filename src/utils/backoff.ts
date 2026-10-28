// Exponential delay for the given zero-based retry attempt, capped at `maxMs`.
export function backoffDelay(
  attempt: number,
  { initialMs, maxMs, factor }: { initialMs: number; maxMs: number; factor: number },
): number {
  return Math.min(initialMs * factor ** Math.max(0, attempt), maxMs);
}
