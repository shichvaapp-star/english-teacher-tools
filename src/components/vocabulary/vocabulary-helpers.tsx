
/** 32-bit FNV-1a hash of `text`, mixed with `seed`. */
function hashWithSeed(text: string, seed: number): number {
  let h = (2166136261 ^ seed) >>> 0;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // Final avalanche so close seeds give unrelated orders.
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return h >>> 0;
}

/**
 * Seeded shuffle: the same seed always gives the same order, a different seed
 * a different, unrelated order. Each word keeps its place when other words are
 * added or removed, so the order doesn't jump while the student practises.
 */
export function deterministicShuffle<T extends { id: string }>(items: T[], seed: number): T[] {
  return items
    .map((item) => ({ item, key: hashWithSeed(item.id, seed) }))
    .sort((a, b) => a.key - b.key || a.item.id.localeCompare(b.item.id))
    .map(({ item }) => item);
}

/** A fresh random seed for a new practice session. */
export function randomShuffleSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}
