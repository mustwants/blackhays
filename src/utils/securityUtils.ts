// Security utilities
export const securityUtils = {
  // Rate limiting
  rateLimiter: new Map<string, { count: number; timestamp: number }>(),
  
  // Check rate limit
  checkRateLimit(key: string, limit: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.rateLimiter.get(key);
    
    if (!record) {
      this.rateLimiter.set(key, { count: 1, timestamp: now });
      return true;
    }
    
    if (now - record.timestamp > windowMs) {
      record.count = 1;
      record.timestamp = now;
      return true;
    }
    
    if (record.count >= limit) {
      return false;
    }
    
    record.count++;
    return true;
  },

  // Sanitize SQL input
  sanitizeSqlInput(input: string): string {
    return input.replace(/['";\\]/g, '');
  },

  // Validate JWT token
  validateToken(token: string): boolean {
    try {
      // Basic structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Check expiration
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  // Generate secure random string
  generateSecureId(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
};