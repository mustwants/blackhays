// Custom error class for database operations
export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Custom error class for API operations
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Error handling utilities
export const errorUtils = {
  // Format error messages for user display
  formatErrorMessage(error: unknown): string {
    if (error instanceof DatabaseError) {
      return `Database error: ${error.message}`;
    }
    if (error instanceof ApiError) {
      return `API error: ${error.message}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  },

  // Check if an error is retryable
  isRetryableError(error: unknown): boolean {
    if (error instanceof DatabaseError) {
      // Network errors, connection timeouts, etc.
      return !error.code || ['23505', '40001', '40P01'].includes(error.code);
    }
    if (error instanceof ApiError) {
      // 5xx errors and some 4xx errors
      return !error.status || error.status >= 500 || [429, 408].includes(error.status);
    }
    return true;
  },

  // Log errors with appropriate context
  logError(error: unknown, context?: string): void {
    const timestamp = new Date().toISOString();
    const errorDetails = {
      timestamp,
      context,
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    };
    console.error('Error occurred:', errorDetails);
  },

  // Create a standardized error response
  createErrorResponse<T>(error: unknown): ApiResponse<T> {
    return {
      data: null,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
};

// Retry utility for async operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = true
  } = options;

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (!errorUtils.isRetryableError(error) || attempt === maxRetries - 1) {
        throw lastError;
      }
      
      const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}