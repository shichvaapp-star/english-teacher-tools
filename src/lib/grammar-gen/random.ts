// Small seeded random helper for the grammar question generators.
// Seeded so the validator (and tests) can reproduce a run; the app seeds it
// from Math.random so every practice round is different.

export class Rng {
  private s: number;

  constructor(seed: number = Math.floor(Math.random() * 2 ** 31)) {
    this.s = seed >>> 0 || 1;
  }

  /** Float in [0, 1) – mulberry32. */
  next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  int(max: number): number {
    return Math.floor(this.next() * max);
  }

  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(list: readonly T[]): T {
    return list[this.int(list.length)];
  }

  /** Random sample of `n` distinct elements. */
  sample<T>(list: readonly T[], n: number): T[] {
    return this.shuffle(list).slice(0, n);
  }

  shuffle<T>(list: readonly T[]): T[] {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
      const j = this.int(i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  /** Short id fragment for generated item ids. */
  tag(): string {
    return Math.floor(this.next() * 36 ** 6).toString(36).padStart(6, "0");
  }
}
