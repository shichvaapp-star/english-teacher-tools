
// Pure deterministic shuffle helper
export function deterministicShuffle<T extends { id: string }>(items: T[], seed: number): T[] {
  return [...items].sort((a, b) => {
    const scoreA = (a.id.charCodeAt(a.id.length - 1) * 7 + seed) % 13;
    const scoreB = (b.id.charCodeAt(b.id.length - 1) * 7 + seed) % 13;
    return scoreA - scoreB;
  });
}
