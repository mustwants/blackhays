// Cache utilities
export const cacheUtils = {
  cache: new Map<string, { data: any; timestamp: number }>(),
  
  // Get cached data
  get<T>(key: string, maxAge: number = 300000): T | null {
    const record = this.cache.get(key);
    if (!record) return null;
    
    if (Date.now() - record.timestamp > maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return record.data as T;
  },
  
  // Set cached data
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  },
  
  // Clear expired cache entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.cache.entries()) {
      if (now - record.timestamp > 3600000) { // 1 hour
        this.cache.delete(key);
      }
    }
  }
};

// Run cache cleanup every 5 minutes
setInterval(() => cacheUtils.cleanup(), 300000);