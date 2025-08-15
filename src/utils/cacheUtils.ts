// Simple in-memory cache with expiration
export type CacheRecord<T> = {
  data: T;
  timestamp: number;
};
export const cacheUtils = {
  cache: new Map<string, CacheRecord<unknown>>(),

  // Retrieve a value if it has not expired
  get<T>(key: string, maxAge = 300_000): T | null {
    const record = this.cache.get(key) as CacheRecord<T> | undefined;
    if (!record) return null;
    
    if (Date.now() - record.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }
     
    return record.data;
  },
  

  // Store a value
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  

  // Remove a specific entry
  delete(key: string): void {
    this.cache.delete(key);
  },

  // Clear all entries
  clear(): void {
    this.cache.clear();
  },

  // Remove stale entries
  cleanup(maxAge = 3_600_000): void {
    const now = Date.now();
    for (const [key, record] of this.cache.entries()) {
      if (now - record.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }
  }
};

// Run cache cleanup every 5 minutes
setInterval(() => cacheUtils.cleanup(), 300_000);