interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class RequestCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private ttlMs: number;

  constructor(ttlMs: number = 5 * 60 * 1000) {
    this.ttlMs = ttlMs;
  }

  public get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  public set(key: string, value: T): void {
    // Keep max size 50 to avoid unbounded memory usage
    if (this.store.size >= 50) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  public clear(): void {
    this.store.clear();
  }
}

export const planGenerationCache = new RequestCache<any>();
